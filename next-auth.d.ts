import { UserRole } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole
  isTwoFactorEnabled: boolean
  isOAuth: boolean
  tokens: number
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}