import { Suspense } from "react";
import VerificationForm from "@/components/auth/verification-form";
export const metadata = { title: "Verify email" };
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-80 w-full max-w-md animate-pulse rounded-xl bg-secondary" />
      }
    >
      <VerificationForm />
    </Suspense>
  );
}
