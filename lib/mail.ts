import "server-only";
import { Resend } from "resend";
import { brand } from "@/lib/brand";
async function send(email: string, subject: string, html: string) {
  console.log("🚀 ~ send ~ env.RESEND_API_KEY:", process.env.FROM_EMAIL, process.env.RESEND_API_KEY)
  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL)
    throw new Error(
      "Email delivery is not configured. Please contact the site owner.",
    );
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: `Stillframe: ${subject}`,
    html,
  });
  if (error) throw new Error("We could not send your email. Please try again.");
}
export const sendVerificationEmail = (email: string, token: string) =>
  send(
    email,
    "Confirm your email",
    `<p>Welcome to Stillframe.</p><p><a href="${brand.url}/auth/verify-email?token=${encodeURIComponent(token)}">Verify your email</a> to open your studio. This link expires in 15 minutes.</p>`,
  );
export const sendResetPasswordEmail = (email: string, token: string) =>
  send(
    email,
    "Reset your password",
    `<p><a href="${brand.url}/auth/new-password?token=${encodeURIComponent(token)}">Reset your password</a>. This link expires in 15 minutes. If you did not request this, ignore this email.</p>`,
  );
export const sendTwoFactorEmail = (email: string, token: string) =>
  send(
    email,
    "Your sign in code",
    `<p>Your sign in code is <strong>${token}</strong>. It expires in 15 minutes.</p>`,
  );
