import "server-only";
import { db } from "@/lib/db";
import { createHash } from "node:crypto";
// Database counters apply across instances. TTL cleanup does not reset active windows.
export async function rateLimit(key: string, limit: number, windowMs = 60_000) {
  const now = Date.now();
  const bucket = Math.floor(now / windowMs);
  const id = createHash("sha256").update(`${key}:${bucket}`).digest("hex");
  let counter;
  try {
    counter = await db.rateLimit.upsert({
      where: { id },
      create: { id, count: 1, expiresAt: new Date((bucket + 2) * windowMs) },
      update: { count: { increment: 1 } },
    });
  } catch (error) {
    // A concurrent upsert can race on the unique index; retry as an atomic update.
    if ((error as { code?: string }).code !== "P2002") throw error;
    counter = await db.rateLimit.update({
      where: { id },
      data: { count: { increment: 1 } },
    });
  }
  if (counter.count > limit)
    throw new Error("Too many requests. Please try again in a minute.");
}
