import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
// MongoDB reports write conflicts as P2034. Retry only database work, never generation.
export async function transaction<T>(
  work: (tx: import("@prisma/client").Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await db.$transaction(work);
    } catch (error) {
      if ((error as { code?: string }).code !== "P2034" || attempt === 2)
        throw error;
    }
  }
  throw new Error("Could not complete the database transaction");
}
