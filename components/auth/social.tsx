"use client";
import { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
export default function AuthSocial() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    getProviders()
      .then((providers) => setAvailable(!!providers?.google))
      .catch(() => setAvailable(false));
  }, []);
  if (!available) return null;
  return (
    <div className="mb-6">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => signIn("google", { redirectTo: "/dashboard" })}
      >
        <FcGoogle className="mr-3 h-5 w-5" />
        Continue with Google
      </Button>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        or use your email
      </p>
    </div>
  );
}
