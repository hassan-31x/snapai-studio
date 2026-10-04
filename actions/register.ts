"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { rateLimit, actionError } from "@/lib/security";
import { FREE_CREDITS } from "@/lib/brand";
import { headers } from "next/headers";
export async function register(values: z.infer<typeof RegisterSchema>) {
  try {
    const parsed = RegisterSchema.safeParse(values);
    if (!parsed.success)
      return { error: "Please check your name, email, and password" };
    const { email, password, name } = parsed.data;
    const ip =
      (await headers()).get("x-forwarded-for")?.split(",")[0] || "unknown";
    await rateLimit(`register:ip:${ip}`, 5, 3600_000);
    await rateLimit(`register:${email}`, 3, 3600_000);
    const existing = await db.user.findUnique({ where: { email } });
    if (existing?.emailVerified)
      return { error: "This email already has an account. Sign in instead." };
    if (existing && existing.password) {
      if (!(await bcrypt.compare(password, existing.password)))
        return {
          error:
            "This email already has an account. Reset your password if needed.",
        };
    } else {
      await db.user.create({
        data: {
          email,
          name,
          password: await bcrypt.hash(password, 12),
          tokens: FREE_CREDITS,
        },
      });
    }
    const verification = await generateVerificationToken(email);
    await sendVerificationEmail(email, verification.token);
    return {
      success:
        "Check your inbox to verify your email, then sign in. You can submit again to resend the link.",
    };
  } catch (error) {
    return { error: actionError(error) };
  }
}
