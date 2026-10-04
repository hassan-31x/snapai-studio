"use server";
import { requireUser, actionError } from "@/lib/security";
import { db } from "@/lib/db";
import { cascadeDeleteUser } from "@/lib/mongodb-utils";
import { deleteFromCloudinary } from "@/lib/cloudinary";
export async function deleteUser() {
  try {
    const user = await requireUser();
    const [shots, submissions, generations] = await Promise.all([
      db.productImage.findMany({ where: { userId: user.id } }),
      db.submission.findMany({ where: { userId: user.id } }),
      db.generation.findMany({ where: { userId: user.id } }),
    ]);
    const ids = new Set<string>();
    for (const row of [...shots, ...submissions, ...generations])
      for (const [key, value] of Object.entries(row))
        if (
          key.toLowerCase().endsWith("publicid") &&
          typeof value === "string" &&
          value
        )
          ids.add(value);
    await cascadeDeleteUser(user.id);
    const cleanup = await Promise.allSettled(
      [...ids].map(deleteFromCloudinary),
    );
    if (cleanup.some((result) => result.status === "rejected"))
      console.error("Account removed; some stored images need manual cleanup");
    return { success: "Account deleted" };
  } catch (error) {
    return { error: actionError(error) };
  }
}
