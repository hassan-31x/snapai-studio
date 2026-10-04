import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).email({
    message: "Email is required",
  }),
  password: z.string().max(72).min(1, {
    message: "Password is required",
  }),
  code: z.optional(
    z
      .string()
      .regex(/^\d{6}$/, "Enter the six digit code")
      .or(z.literal("")),
  ),
});

export const RegisterSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).email({
    message: "Email is required",
  }),
  password: z.string().max(72).min(8, {
    message: "Password must be at least 8 characters",
  }),
  name: z.string().trim().max(100).min(1, {
    message: "Name is required",
  }),
});

export const ResetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().max(72).min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const SettingsSchema = z.object({
  name: z.string().trim().min(1).max(100),
  password: z.string().max(72).min(8).max(72).optional().or(z.literal("")),
  currentPassword: z.string().max(72).optional(),
  isTwoFactorEnabled: z.boolean().optional(),
});
