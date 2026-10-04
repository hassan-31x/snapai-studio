import { beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({
  balance: 2,
  reservations: new Map<
    string,
    {
      id: string;
      userId: string;
      amount: number;
      settled: boolean;
      expiresAt: Date;
    }
  >(),
  transaction: vi.fn(),
  auth: vi.fn(),
}));
vi.mock("@/auth", () => ({ auth: state.auth }));
vi.mock("@/lib/db", () => ({
  db: { $transaction: state.transaction },
  transaction: state.transaction,
}));
import { reserveCredits, refundCredits, settleCredits } from "@/lib/security";
const tx = {
  user: {
    updateMany: vi.fn(async ({ where, data }: any) => {
      if (state.balance < where.tokens.gte) return { count: 0 };
      state.balance -= data.tokens.decrement;
      return { count: 1 };
    }),
    update: vi.fn(async ({ data }: any) => {
      state.balance += data.tokens.increment;
    }),
  },
  creditReservation: {
    create: vi.fn(async ({ data }: any) => {
      const item = {
        id: String(state.reservations.size),
        settled: false,
        ...data,
      };
      state.reservations.set(item.id, item);
      return item;
    }),
    findUnique: vi.fn(async ({ where }: any) =>
      state.reservations.get(where.id),
    ),
    updateMany: vi.fn(async ({ where }: any) => {
      const item = state.reservations.get(where.id);
      if (
        !item ||
        item.settled ||
        (where.expiresAt && item.expiresAt <= where.expiresAt.gt)
      )
        return { count: 0 };
      item.settled = true;
      return { count: 1 };
    }),
  },
};
beforeEach(() => {
  state.balance = 2;
  state.reservations.clear();
  let queue = Promise.resolve();
  state.transaction.mockImplementation((fn: any) => {
    const next = queue.then(() => fn(tx));
    queue = next.catch(() => {});
    return next;
  });
});
describe("durable credit reservations", () => {
  it("cannot overspend when requests compete for the same balance", async () => {
    const results = await Promise.allSettled([
      reserveCredits("owner", 2),
      reserveCredits("owner", 2),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(state.balance).toBe(0);
  });
  it("refunds a failed reservation exactly once", async () => {
    const id = await reserveCredits("owner", 1);
    await Promise.all([refundCredits("owner", id), refundCredits("owner", id)]);
    expect(state.balance).toBe(2);
  });
  it("does not refund a committed generation", async () => {
    const id = await reserveCredits("owner", 1);
    await settleCredits(tx as any, id);
    await refundCredits("owner", id);
    expect(state.balance).toBe(1);
  });
  it("prevents an expired request from committing after recovery", async () => {
    const id = await reserveCredits("owner", 1);
    state.reservations.get(id)!.expiresAt = new Date(0);
    await expect(settleCredits(tx as any, id)).rejects.toThrow("expired");
    await refundCredits("owner", id);
    expect(state.balance).toBe(2);
  });
});
