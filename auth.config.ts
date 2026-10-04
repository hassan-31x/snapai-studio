import { db, transaction } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/utils/user";
import { LoginSchema } from "@/schemas";
export default {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      async authorize(credentials, request) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
        try {
          await rateLimit(`credentials:ip:${ip}`, 30);
          await rateLimit(`credentials:${parsed.data.email}`, 8);
        } catch {
          return null;
        }
        const user = await getUserByEmail(parsed.data.email);
        if (
          !user?.password ||
          !user.emailVerified ||
          !(await bcrypt.compare(parsed.data.password, user.password))
        )
          return null;
        if (user.isTwoFactorEnabled) {
          const code = parsed.data.code;
          if (!code) return null;
          const token = await db.twoFactorToken.findFirst({
            where: {
              email: user.email!,
              token: code,
              expires: { gt: new Date() },
            },
          });
          if (!token) return null;
          try {
            await transaction(async (tx) => {
              await tx.twoFactorToken.delete({ where: { id: token.id } });
            });
          } catch {
            return null;
          }
        }
        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
