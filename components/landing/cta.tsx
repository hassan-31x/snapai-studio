import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function CTA() {
  return (
    <section className="section-wrap pb-16">
      <div className="rounded-xl bg-[#181818] p-8 text-[#fafbfc] md:p-16">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-medium md:text-4xl">
              Your next campaign
              <br />
              starts with one photo.
            </h2>
            <p className="mt-4 text-sm text-[#b4b7bc]">
              Open your studio. See where an idea takes you.
            </p>
          </div>
          <div>
            <Button
              asChild
              className="bg-[#fafbfc] text-[#181818] hover:bg-[#e6e8ec]"
              size="lg"
            >
              <Link href="/auth/register">Open your studio ↗</Link>
            </Button>
            <p className="mt-3 text-xs text-[#b4b7bc]">
              10 free credits. No credit card.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
