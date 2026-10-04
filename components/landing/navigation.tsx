import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
export default function Navigation() {
  return (
    <header className="section-wrap">
      <nav
        aria-label="Main navigation"
        className="flex h-20 items-center justify-between gap-4"
      >
        <BrandLogo />
        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link href="#features">Features</Link>
          <Link href="#how-it-works">How it works</Link>
          <Link href="#faq">Questions</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link className="hidden text-sm sm:inline" href="/auth/login">
            Sign in
          </Link>
          <Button asChild>
            <Link href="/auth/register">
              Start creating <span aria-hidden="true">↗</span>
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
