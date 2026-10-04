import Link from "next/link";
import { cn } from "@/lib/utils";
export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="SnapAI Studio home"
      className={cn(
        "inline-flex items-center gap-2 text-xl font-semibold tracking-tight",
        className,
      )}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="currentColor" />
        <path
          d="M23 9H14a5 5 0 0 0 0 10h4a1 1 0 0 1 0 2H9v4h9a5 5 0 0 0 0-10h-4a1 1 0 0 1 0-2h9V9Z"
          fill="#FAFBFC"
        />
      </svg>
      SnapAI Studio<span className="sr-only"> home</span>
    </Link>
  );
}
