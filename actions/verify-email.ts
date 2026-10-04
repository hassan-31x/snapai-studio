"use server";
import { db } from "@/lib/db";
import { actionError } from "@/lib/security";
export async function verifyEmail(token: string) {
  try {
    if (typeof token !== "string" || token.length > 100)
      return { error: "Invalid verification link" };
    const verification = await db.verificationToken.findUnique({
      where: { token },
    });
    if (!verification)
      return {
        error:
          "This verification link has already been used or is invalid. Try signing in to request another.",
      };
    if (new Date() > verification.expires)
      return { error: "This link has expired. Sign in to request another." };
    const user = await db.user.findUnique({
      where: { email: verification.email },
    });
    if (!user) return { error: "Account not found" };
    await db.$transaction(async (tx) => {
      await tx.verificationToken.delete({ where: { id: verification.id } });
      await tx.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    });
    return { success: "Your email is verified. You can now sign in." };
  } catch (error) {
    return { error: actionError(error) };
  }
}
