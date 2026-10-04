"use server";

import { rateLimit, actionError } from "@/lib/security";
import { headers } from "next/headers";
import * as z from "zod";

import { ResetPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/utils/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendResetPasswordEmail } from "@/lib/mail";

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>,
) => {
  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email } = validatedFields.data;
  try {
    const ip =
      (await headers()).get("x-forwarded-for")?.split(",")[0] || "unknown";
    await rateLimit(`reset:ip:${ip}`, 10);
    await rateLimit(`reset:${email}`, 3);
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { success: "If an account exists, a reset link has been sent" };
    }

    const resetPasswordToken = await generatePasswordResetToken(email);
    await sendResetPasswordEmail(email, resetPasswordToken.token);

    return { success: "If an account exists, a reset link has been sent" };
  } catch (error) {
    return { error: actionError(error) };
  }
};
