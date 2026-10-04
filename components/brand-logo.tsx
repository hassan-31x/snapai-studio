import Link from "next/link";
import { cn } from "@/lib/utils";
export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Stillframe home"
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
        <path d="M10 9H23V13H14V16H22V20H14V23H10V9Z" fill="#FAFBFC" />
        <path d="M23 23H18V20H23V23Z" fill="#FAFBFC" />
      </svg>
      Stillframe<span className="sr-only"> home</span>
    </Link>
  );
}
