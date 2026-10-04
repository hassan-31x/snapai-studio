import "server-only";
import { auth } from "@/auth";
import { db, transaction } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
export { rateLimit } from "@/lib/rate-limit";
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Please sign in to continue");
  await recoverCredits(session.user.id);
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("Please sign in to continue");
  return user;
}
export async function reserveCredits(userId: string, cost: number) {
  if (!Number.isInteger(cost) || cost < 1 || cost > 5)
    throw new Error("Invalid credit cost");
  return transaction(async (tx) => {
    const reserved = await tx.user.updateMany({
      where: { id: userId, tokens: { gte: cost } },
      data: { tokens: { decrement: cost } },
    });
    if (!reserved.count)
      throw new Error(
        `You need ${cost} credits for this request. Your free allowance has been used.`,
      );
    const reservation = await tx.creditReservation.create({
      data: {
        userId,
        amount: cost,
        expiresAt: new Date(Date.now() + 15 * 60_000),
      },
    });
    return reservation.id;
  });
}
export async function settleCredits(
  tx: Prisma.TransactionClient,
  reservationId: string,
) {
  const settled = await tx.creditReservation.updateMany({
    where: { id: reservationId, settled: false, expiresAt: { gt: new Date() } },
    data: { settled: true },
  });
  if (!settled.count)
    throw new Error(
      "This request expired. Your credits were restored. Please try again.",
    );
}
export async function refundCredits(_userId: string, reservationId: string) {
  await transaction(async (tx) => {
    const reservation = await tx.creditReservation.findUnique({
      where: { id: reservationId },
    });
    if (!reservation || reservation.settled) return;
    const claimed = await tx.creditReservation.updateMany({
      where: { id: reservationId, settled: false },
      data: { settled: true },
    });
    if (claimed.count)
      await tx.user.update({
        where: { id: reservation.userId },
        data: { tokens: { increment: reservation.amount } },
      });
  });
}
export async function recoverCredits(userId: string) {
  const stale = await db.creditReservation.findMany({
    where: { userId, settled: false, expiresAt: { lt: new Date() } },
    take: 20,
  });
  for (const reservation of stale) await refundCredits(userId, reservation.id);
  await db.generation.updateMany({
    where: {
      userId,
      status: { in: ["PENDING", "IN_PROGRESS"] },
      updatedAt: { lt: new Date(Date.now() - 15 * 60_000) },
    },
    data: { status: "FAILED" },
  });
}
export function actionError(error: unknown) {
  if (error instanceof ZodError)
    return error.issues[0]?.message || "Please check your inputs";
  if (error instanceof Error && !("code" in error)) return error.message;
  console.error(
    "Action failed",
    error instanceof Error ? error.name : "Unknown error",
  );
  return "We could not complete this request. Please try again.";
}
