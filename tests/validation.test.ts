import { describe, expect, it } from "vitest";
import {
  imageDataUrl,
  validateImage,
  imageCountSchema,
  aspectRatioSchema,
} from "@/lib/validation";
import { LoginSchema, RegisterSchema, SettingsSchema } from "@/schemas";
describe("upload and account boundaries", () => {
  it("rejects large, empty, and unsupported uploads", () => {
    expect(() =>
      validateImage(new File([], "empty.png", { type: "image/png" })),
    ).toThrow();
    expect(() =>
      validateImage(
        new File([new Uint8Array(5 * 1024 * 1024 + 1)], "huge.png", {
          type: "image/png",
        }),
      ),
    ).toThrow();
    expect(() =>
      validateImage(new File(["svg"], "x.svg", { type: "image/svg+xml" })),
    ).toThrow();
  });
  it("checks image signatures instead of trusting MIME declarations", async () => {
    await expect(
      imageDataUrl(new File(["script"], "fake.jpg", { type: "image/jpeg" })),
    ).rejects.toThrow("not a valid image");
    await expect(
      imageDataUrl(
        new File([new Uint8Array([255, 216, 255, 0])], "photo.jpg", {
          type: "image/jpeg",
        }),
      ),
    ).resolves.toMatch(/^data:image\/jpeg;base64,/);
  });
  it("rejects counts that could bypass credit costs", () => {
    for (const count of [0, -1, 5, 1.5, "NaN"])
      expect(imageCountSchema.safeParse(count).success).toBe(false);
    expect(aspectRatioSchema.safeParse("99999x99999").success).toBe(false);
  });
  it("normalizes emails and allows ordinary login without a two factor code", () => {
    expect(
      LoginSchema.parse({
        email: " OWNER@Brand.com ",
        password: "password",
        code: "",
      }).email,
    ).toBe("owner@brand.com");
    expect(
      RegisterSchema.safeParse({
        email: "owner@brand.com",
        name: "Owner",
        password: "short",
      }).success,
    ).toBe(false);
  });
  it("strips privilege and balance fields from profile updates", () => {
    expect(
      SettingsSchema.parse({ name: "Owner", role: "ADMIN", tokens: 99999 }),
    ).toEqual({ name: "Owner" });
  });
});
