import { Suspense } from "react";
import NewPasswordForm from "@/components/auth/new-password-form";
export const metadata = { title: "Reset password" };
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-80 w-full max-w-md animate-pulse rounded-xl bg-secondary" />
      }
    >
      <NewPasswordForm />
    </Suspense>
  );
}
