"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { requireUser, actionError } from "@/lib/security";
import { revalidatePath } from "next/cache";
export async function settings(values: z.infer<typeof SettingsSchema>) {
  try {
    const user = await requireUser();
    const parsed = SettingsSchema.safeParse(values);
    if (!parsed.success)
      return {
        error: "Check your name and password. Use at least eight characters.",
      };
    const data = parsed.data;
    const securityChange =
      !!data.password ||
      (data.isTwoFactorEnabled !== undefined &&
        data.isTwoFactorEnabled !== user.isTwoFactorEnabled);
    if (
      securityChange &&
      (!user.password ||
        !data.currentPassword ||
        !(await bcrypt.compare(data.currentPassword, user.password)))
    )
      return {
        error: "Enter your current password to change security settings",
      };
    await db.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        ...(data.password
          ? {
              password: await bcrypt.hash(data.password, 12),
              sessionVersion: { increment: 1 },
            }
          : {}),
        ...(user.password && data.isTwoFactorEnabled !== undefined
          ? { isTwoFactorEnabled: data.isTwoFactorEnabled }
          : {}),
      },
    });
    revalidatePath("/settings");
    return {
      success: data.password
        ? "Password updated. Please sign in again."
        : "Your account has been updated",
    };
  } catch (error) {
    return { error: actionError(error) };
  }
}
