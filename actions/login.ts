"use server";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/security";
import { headers } from "next/headers";

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { getTwoFactorConfirmationByUserId } from "@/utils/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/utils/two-factor-token";
import { getUserByEmail } from "@/utils/user";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, code } = validatedFields.data;
  try {
    const ip =
      (await headers()).get("x-forwarded-for")?.split(",")[0] || "unknown";
    await rateLimit(`login:ip:${ip}`, 30);
    await rateLimit(`login:${email}`, 8);
  } catch {
    return {
      error: "Too many sign in attempts. Please try again in a minute.",
    };
  }

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.password) {
    return { error: "Invalid credentials" };
  }

  if (!(await bcrypt.compare(password, existingUser.password)))
    return { error: "Invalid credentials" };
  if (!existingUser.emailVerified) {
    try {
      const verificationToken = await generateVerificationToken(email);
      await sendVerificationEmail(email, verificationToken.token);
    } catch {
      return {
        error: "We could not send your verification link. Please try again.",
      };
    }
    return {
      success: "Check your inbox to verify your email before signing in",
    };
  }
  if (existingUser.isTwoFactorEnabled && !code) {
    try {
      const twoFactorToken = await generateTwoFactorToken(email);
      await sendTwoFactorEmail(email, twoFactorToken.token);
      return { twoFactor: true };
    } catch {
      return {
        error: "We could not send your sign in code. Please try again.",
      };
    }
  }
  try {
    await signIn("credentials", {
      email,
      password,
      code,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      //? for next-auth-beta.19: https://github.com/nextauthjs/next-auth/issues/9900#issuecomment-2228807677
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "An error occurred" };
      }
    }

    throw error;
  }

  return { success: "Login Successful" };
};
