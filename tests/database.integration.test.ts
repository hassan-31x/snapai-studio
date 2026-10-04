import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { execFileSync } from "node:child_process";
import bcrypt from "bcryptjs";
import type { PrismaClient } from "@prisma/client";
const context = vi.hoisted(() => ({ userId: "", generate: vi.fn() }));
vi.mock("@/auth", () => ({
  auth: vi.fn(async () => ({ user: { id: context.userId } })),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/utils/generateProductShots", () => ({
  generateProductShots: context.generate,
}));
let replica: MongoMemoryReplSet;
let db: PrismaClient;
let security: typeof import("@/lib/security");
let generate: typeof import("@/actions/generate-product-shots");
let read: typeof import("@/actions/get-generation");
let settings: typeof import("@/actions/settings");
let verify: typeof import("@/actions/verify-email");
let cascade: typeof import("@/lib/mongodb-utils");
beforeAll(async () => {
  replica = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: "wiredTiger" },
  });
  vi.stubEnv("DATABASE_URL", replica.getUri("integration"));
  execFileSync(
    process.execPath,
    ["node_modules/prisma/build/index.js", "db", "push"],
    { env: process.env, stdio: "pipe" },
  );
  db = (await import("@/lib/db")).db;
  security = await import("@/lib/security");
  generate = await import("@/actions/generate-product-shots");
  read = await import("@/actions/get-generation");
  settings = await import("@/actions/settings");
  verify = await import("@/actions/verify-email");
  cascade = await import("@/lib/mongodb-utils");
}, 120000);
afterAll(async () => {
  await db?.$disconnect();
  await replica?.stop();
  vi.unstubAllEnvs();
});
function data() {
  const form = new FormData();
  form.set("prompt", "A product on stone in soft daylight");
  form.set("numberOfImages", "1");
  form.set(
    "productImage",
    new File([new Uint8Array([255, 216, 255, 0])], "photo.jpg", {
      type: "image/jpeg",
    }),
  );
  return form;
}
describe("real MongoDB replica-set flows", () => {
  it("enforces a shared balance across competing transactions", async () => {
    const user = await db.user.create({
      data: { email: "credits@example.test", tokens: 2 },
    });
    const results = await Promise.allSettled([
      security.reserveCredits(user.id, 2),
      security.reserveCredits(user.id, 2),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(
      (await db.user.findUniqueOrThrow({ where: { id: user.id } })).tokens,
    ).toBe(0);
    const success = results.find(
      (r) => r.status === "fulfilled",
    ) as PromiseFulfilledResult<string>;
    await Promise.all([
      security.refundCredits(user.id, success.value),
      security.refundCredits(user.id, success.value),
    ]);
    expect(
      (await db.user.findUniqueOrThrow({ where: { id: user.id } })).tokens,
    ).toBe(2);
  });
  it("saves generated results atomically and prevents cross-account reads", async () => {
    const user = await db.user.create({
      data: {
        email: "owner@example.test",
        tokens: 10,
        emailVerified: new Date(),
      },
    });
    context.userId = user.id;
    context.generate.mockResolvedValue({
      generatedImages: [
        {
          imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          publicId: "fixture",
          prompt: "Test",
          aspectRatio: "1024x1024",
          scene: "studio",
        },
      ],
      originalImage: {
        url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        publicId: "reference",
      },
    });
    const result = await generate.generateProductShotsAction(data());
    expect(result.success).toBe(true);
    const owner = await db.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(owner.tokens).toBe(9);
    expect(owner.generatedImages).toBe(1);
    expect(
      await db.creditReservation.count({
        where: { userId: user.id, settled: true },
      }),
    ).toBe(1);
    expect(
      (await read.getGenerationAction(result.generationId!, "untrusted"))
        .success,
    ).toBe(true);
    const other = await db.user.create({
      data: { email: "other@example.test" },
    });
    context.userId = other.id;
    expect(
      (await read.getGenerationAction(result.generationId!, user.id)).success,
    ).toBe(false);
  });
  it("persists owned designs and rejects foreign images and nested sources", async () => {
    const { saveDesign } = await import("@/actions/save-design");
    const user = await db.user.findUniqueOrThrow({
      where: { email: "owner@example.test" },
    });
    context.userId = user.id;
    const imageUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
    const document = JSON.stringify({
      width: 864,
      height: 576,
      objects: [
        { type: "Image", src: imageUrl },
        { type: "Textbox", text: "Your headline", left: 32, top: 32 },
      ],
    });
    expect((await saveDesign(imageUrl, document)).success).toBe(true);
    expect(
      (
        await db.design.findUniqueOrThrow({
          where: { userId_imageUrl: { userId: user.id, imageUrl } },
        })
      ).document,
    ).toBe(document);
    expect(
      (
        await saveDesign(
          imageUrl,
          JSON.stringify({
            width: 864,
            height: 576,
            objects: [
              {
                type: "Rect",
                clipPath: { type: "Image", src: "https://example.test/image" },
              },
            ],
          }),
        )
      ).success,
    ).toBe(false);
    context.userId = (
      await db.user.findUniqueOrThrow({
        where: { email: "other@example.test" },
      })
    ).id;
    expect((await saveDesign(imageUrl, document)).success).toBe(false);
  });
  it("refunds provider failures and marks the new project failed", async () => {
    const user = await db.user.create({
      data: { email: "failed@example.test", tokens: 10 },
    });
    context.userId = user.id;
    context.generate.mockRejectedValue(new Error("Provider unavailable"));
    expect((await generate.generateProductShotsAction(data())).success).toBe(
      false,
    );
    expect(
      (await db.user.findUniqueOrThrow({ where: { id: user.id } })).tokens,
    ).toBe(10);
    expect(
      await db.generation.count({
        where: { userId: user.id, status: "FAILED" },
      }),
    ).toBe(1);
  });
  it("recovers an interrupted request without issuing a second refund", async () => {
    const user = await db.user.create({
      data: { email: "recovery@example.test", tokens: 10 },
    });
    const id = await security.reserveCredits(user.id, 4);
    await db.creditReservation.update({
      where: { id },
      data: { expiresAt: new Date(0) },
    });
    await security.recoverCredits(user.id);
    await security.recoverCredits(user.id);
    expect(
      (await db.user.findUniqueOrThrow({ where: { id: user.id } })).tokens,
    ).toBe(10);
  });
  it("protects password and privilege fields in settings", async () => {
    const user = await db.user.create({
      data: {
        email: "settings@example.test",
        name: "Original",
        tokens: 10,
        password: "hashed",
      },
    });
    context.userId = user.id;
    expect(
      (
        await settings.settings({
          name: "Changed",
          role: "ADMIN",
          tokens: 5000,
        } as any)
      ).success,
    ).toBeDefined();
    const changed = await db.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(changed.role).toBe("USER");
    expect(changed.tokens).toBe(10);
    expect(
      (await settings.settings({ name: "Changed", password: "newpassword" }))
        .error,
    ).toContain("current password");
    expect(
      (await db.user.findUniqueOrThrow({ where: { id: user.id } })).password,
    ).toBe("hashed");
  });
  it("verifies an account exactly once with its email token", async () => {
    const user = await db.user.create({
      data: { email: "verify@example.test" },
    });
    await db.verificationToken.create({
      data: {
        email: user.email!,
        token: "test-token",
        expires: new Date(Date.now() + 60000),
      },
    });
    expect((await verify.verifyEmail("test-token")).success).toBeDefined();
    expect(
      (await db.user.findUniqueOrThrow({ where: { id: user.id } }))
        .emailVerified,
    ).not.toBeNull();
    expect((await verify.verifyEmail("test-token")).error).toContain(
      "already been used",
    );
  });
  it("requires the two factor code in the direct credentials endpoint", async () => {
    const config = (await import("@/auth.config")).default;
    const provider = config.providers.find(
      (p: any) => p.type === "credentials",
    ) as any;
    const authorize = provider.options.authorize;
    const user = await db.user.create({
      data: {
        email: "mfa@example.test",
        password: await bcrypt.hash("password123", 4),
        emailVerified: new Date(),
        isTwoFactorEnabled: true,
      },
    });
    await db.twoFactorToken.create({
      data: {
        email: user.email!,
        token: "123456",
        expires: new Date(Date.now() + 60000),
      },
    });
    const request = new Request("http://localhost/api/auth", {
      headers: { "x-forwarded-for": "127.0.0.1" },
    });
    const base = { email: user.email, password: "password123" };
    expect(await authorize(base, request)).toBeNull();
    expect(await authorize({ ...base, code: "000000" }, request)).toBeNull();
    expect((await authorize({ ...base, code: "123456" }, request))?.id).toBe(
      user.id,
    );
    expect(await authorize({ ...base, code: "123456" }, request)).toBeNull();
  });
  it("increments the session version on an authorized password change", async () => {
    const user = await db.user.create({
      data: {
        email: "password@example.test",
        name: "Owner",
        password: await bcrypt.hash("password123", 4),
      },
    });
    context.userId = user.id;
    expect(
      (
        await settings.settings({
          name: "Owner",
          currentPassword: "password123",
          password: "updated-password",
        })
      ).success,
    ).toContain("sign in again");
    const updated = await db.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(updated.sessionVersion).toBe(1);
    expect(await bcrypt.compare("updated-password", updated.password!)).toBe(
      true,
    );
  });
  it("removes all related database records when an account is deleted", async () => {
    const user = await db.user.findUniqueOrThrow({
      where: { email: "owner@example.test" },
    });
    const project = await db.generation.findFirstOrThrow({
      where: { userId: user.id },
    });
    await db.design.create({
      data: { userId: user.id, imageUrl: "fixture", document: "{}" },
    });
    await cascade.cascadeDeleteUser(user.id);
    expect(await db.user.findUnique({ where: { id: user.id } })).toBeNull();
    expect(await db.productImage.count({ where: { userId: user.id } })).toBe(0);
    expect(
      await db.creditReservation.count({ where: { userId: user.id } }),
    ).toBe(0);
    expect(await db.design.count({ where: { userId: user.id } })).toBe(0);
    expect(
      await db.generation.findUnique({ where: { id: project.id } }),
    ).toBeNull();
  });
});
