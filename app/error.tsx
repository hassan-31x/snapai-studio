"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className="studio-page py-20">
      <h1 className="text-3xl font-medium">We could not load this page.</h1>
      <p className="mb-8 mt-4 text-muted-foreground">
        Please try again. If the problem continues, check the service
        configuration.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </main>
  );
}
