"use client";
import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/actions/verify-email";
import CardWrapper from "@/components/auth/card-wrapper";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
export default function VerificationForm() {
  const token = useSearchParams().get("token");
  const sent = useRef<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    if (!token) {
      setError("Verification token is missing");
      return;
    }
    if (sent.current === token) return;
    sent.current = token;
    verifyEmail(token)
      .then((result) => {
        setError(result.error || "");
        setSuccess(result.success || "");
      })
      .catch(() =>
        setError(
          "We could not verify this email. Please try signing in again.",
        ),
      );
  }, [token]);
  return (
    <CardWrapper
      headerLabel="Confirm your email"
      backButtonLabel="Continue to sign in"
      backButtonhref="/auth/login"
    >
      <div aria-live="polite">
        {!error && !success && (
          <p className="animate-pulse text-sm text-muted-foreground">
            Verifying your email…
          </p>
        )}
        <FormError message={error} />
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
}
