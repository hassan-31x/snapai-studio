import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";
export const metadata = { title: "Sign in" };
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-80 w-full max-w-md animate-pulse rounded-xl bg-secondary" />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
