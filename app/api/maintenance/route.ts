import { db } from "@/lib/db";
import { refundCredits } from "@/lib/security";
import { timingSafeEqual } from "node:crypto";
export async function GET(request: Request) {
  const token = request.headers.get("authorization") || "";
  const expected = `Bearer ${process.env.CRON_SECRET || ""}`;
  if (
    !process.env.CRON_SECRET ||
    token.length !== expected.length ||
    !timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  )
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const stale = await db.creditReservation.findMany({
    where: { settled: false, expiresAt: { lt: new Date() } },
    take: 100,
  });
  for (const item of stale) await refundCredits(item.userId, item.id);
  await db.generation.updateMany({
    where: {
      status: { in: ["PENDING", "IN_PROGRESS"] },
      updatedAt: { lt: new Date(Date.now() - 15 * 60_000) },
    },
    data: { status: "FAILED" },
  });
  await db.rateLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  await db.creditReservation.deleteMany({
    where: {
      settled: true,
      expiresAt: { lt: new Date(Date.now() - 30 * 86400_000) },
    },
  });
  return Response.json({ recovered: stale.length });
}
