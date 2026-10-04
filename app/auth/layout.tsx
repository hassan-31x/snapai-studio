import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/brand-logo";
import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col p-6 md:p-12">
        <BrandLogo />
        <main
          id="main-content"
          className="flex flex-1 items-center justify-center py-16"
        >
          {children}
        </main>
        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link className="underline" href="/terms">
            terms
          </Link>
          . Read our{" "}
          <Link className="underline" href="/privacy">
            privacy policy
          </Link>
          .
        </p>
      </div>
      <aside className="relative hidden bg-secondary lg:block">
        <Image
          src="/images/skincare.jpg"
          fill
          className="object-cover"
          alt="Carefully styled skincare products"
          sizes="50vw"
          priority
        />
        <div className="absolute bottom-12 left-12 right-12 rounded-xl bg-background p-8">
          <p className="mb-4 text-xs text-muted-foreground">
            A little space for a better idea.
          </p>
          <h2 className="text-3xl font-medium">
            Your product.
            <br />A whole new perspective.
          </h2>
        </div>
      </aside>
    </div>
  );
}
