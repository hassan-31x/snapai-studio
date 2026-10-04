import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  rateLimit: vi.fn(),
  reserve: vi.fn(),
  refund: vi.fn(),
  settle: vi.fn(),
  generate: vi.fn(),
  find: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  updateMany: vi.fn(),
  transaction: vi.fn(),
}));
vi.mock("@/lib/security", () => ({
  requireUser: mocks.requireUser,
  rateLimit: mocks.rateLimit,
  reserveCredits: mocks.reserve,
  refundCredits: mocks.refund,
  settleCredits: mocks.settle,
  actionError: (e: Error) => e.message,
}));
vi.mock("@/lib/db", () => ({
  db: {
    generation: {
      findFirst: mocks.find,
      create: mocks.create,
      update: mocks.update,
      updateMany: mocks.updateMany,
    },
    $transaction: mocks.transaction,
  },
}));
vi.mock("@/utils/generateProductShots", () => ({
  generateProductShots: mocks.generate,
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
import { generateProductShotsAction } from "@/actions/generate-product-shots";
const owner = "111111111111111111111111",
  foreign = "222222222222222222222222";
function form() {
  const data = new FormData();
  data.set("userId", foreign);
  data.set("prompt", "Product on a stone surface in morning light");
  data.set("numberOfImages", "1");
  data.set(
    "productImage",
    new File([new Uint8Array([255, 216, 255, 0])], "photo.jpg", {
      type: "image/jpeg",
    }),
  );
  return data;
}
beforeEach(() => {
  vi.resetAllMocks();
  mocks.requireUser.mockResolvedValue({ id: owner });
  mocks.reserve.mockResolvedValue("reservation");
  mocks.create.mockResolvedValue({ id: "333333333333333333333333" });
  mocks.update.mockResolvedValue({});
});
describe("generation ownership and failure behavior", () => {
  it("requires authentication before spending or generating", async () => {
    mocks.requireUser.mockRejectedValue(new Error("Please sign in"));
    const result = await generateProductShotsAction(form());
    expect(result.success).toBe(false);
    expect(mocks.reserve).not.toHaveBeenCalled();
    expect(mocks.generate).not.toHaveBeenCalled();
  });
  it("rejects another account's project before charging", async () => {
    const data = form();
    data.set("generationId", foreign);
    mocks.find.mockResolvedValue(null);
    const result = await generateProductShotsAction(data);
    expect(result.error).toBe("Project not found");
    expect(mocks.find).toHaveBeenCalledWith({
      where: { id: foreign, userId: owner, type: "PRODUCT_SHOT" },
    });
    expect(mocks.reserve).not.toHaveBeenCalled();
  });
  it("rejects abusive counts before generating", async () => {
    const data = form();
    data.set("numberOfImages", "-1");
    await generateProductShotsAction(data);
    expect(mocks.reserve).not.toHaveBeenCalled();
  });
  it("uses session identity and refunds when the provider fails", async () => {
    mocks.generate.mockRejectedValue(new Error("Provider unavailable"));
    const result = await generateProductShotsAction(form());
    expect(result.success).toBe(false);
    expect(mocks.reserve).toHaveBeenCalledWith(owner, 1);
    expect(mocks.refund).toHaveBeenCalledWith(owner, "reservation");
    expect(mocks.update).toHaveBeenCalledWith({
      where: { id: "333333333333333333333333" },
      data: { status: "FAILED" },
    });
  });
  it("refunds when a concurrent request already claimed the project", async () => {
    const data = form();
    data.set("generationId", foreign);
    mocks.find.mockResolvedValue({ id: foreign, status: "COMPLETED" });
    mocks.updateMany.mockResolvedValue({ count: 0 });
    await generateProductShotsAction(data);
    expect(mocks.refund).toHaveBeenCalled();
    expect(mocks.generate).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
  });
});
