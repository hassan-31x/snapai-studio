import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main
      id="main-content"
      className="section-wrap flex min-h-screen flex-col items-center justify-center text-center"
    >
      <BrandLogo />
      <p className="mt-12 text-sm text-muted-foreground">404</p>
      <h1 className="mt-4 text-4xl font-medium">Outside the frame.</h1>
      <p className="mb-8 mt-4 text-muted-foreground">
        This page does not exist, or the project is not available in your
        account.
      </p>
      <Button asChild>
        <Link href="/">Return home</Link>
      </Button>
    </main>
  );
}
