import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
            radial-gradient(circle 500px at 0% 20%, rgba(139,92,246,0.13), transparent),
            radial-gradient(circle 500px at 100% 0%, rgba(59,130,246,0.13), transparent)
          `,
          backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
          maskImage: "linear-gradient(to bottom, black 65%, transparent)",
        }}
      />
      <div className="section-wrap pb-16 pt-16 md:pt-20">
        <div className="mx-auto max-w-[680px] text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Your independent creative studio
          </div>
          <h1 className="text-4xl font-medium md:text-6xl">
            Your product.
            <br />A whole new perspective.
          </h1>
          <p className="mx-auto mb-8 mt-6 max-w-xl text-lg text-muted-foreground">
            Turn the photo you have into the campaign you imagined. Create
            studio shots and ad creatives, all in one considered workspace.
          </p>
          <Button asChild size="lg" className="gap-4">
            <Link href="/auth/register">
              Open your studio <span aria-hidden="true">↗</span>
            </Link>
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            10 free image credits. No credit card required.
          </p>
        </div>
        <div className="mt-12 overflow-hidden rounded-xl border bg-secondary p-2 shadow-[0_16px_48px_-24px_rgba(25,30,40,0.3)]">
          <div className="flex items-center justify-between px-4 py-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              The campaign workspace
            </span>
            <span>Product photography, reimagined</span>
          </div>
          <div className="grid gap-2 md:grid-cols-[1fr_1.45fr_1fr]">
            <div className="relative h-64 overflow-hidden rounded-lg bg-[#e6e9e2] md:h-80">
              <Image
                src="/images/fragrance.jpg"
                fill
                className="object-cover"
                alt="Fragrance bottle with carefully arranged botanicals"
                sizes="(max-width:768px) 100vw, 30vw"
                priority
              />
              <span className="absolute bottom-4 left-4 rounded-md bg-background px-3 py-2 text-xs">
                A quieter kind of luxury
              </span>
            </div>
            <div className="relative h-80 overflow-hidden rounded-lg bg-[#e5ece5]">
              <Image
                src="/images/skincare.jpg"
                fill
                className="object-cover"
                alt="Skincare products in a softly lit studio composition"
                sizes="(max-width:768px) 100vw, 45vw"
                priority
              />
              <span className="absolute bottom-4 left-4 rounded-md bg-background px-3 py-2 text-xs">
                Make room for your next idea
              </span>
            </div>
            <div className="relative h-64 overflow-hidden rounded-lg bg-[#e8342b] md:h-80">
              <Image
                src="/images/sneaker.jpg"
                fill
                className="object-cover"
                alt="Red sneaker photographed against a tonal red background"
                sizes="(max-width:768px) 100vw, 30vw"
              />
              <span className="absolute bottom-4 left-4 rounded-md bg-background px-3 py-2 text-xs">
                A different point of view
              </span>
            </div>
          </div>
          <p className="px-4 pt-3 pb-1 text-xs text-muted-foreground">
            Art direction references. Photography from Unsplash; these are not
            generated customer results.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
          <span>Studio photography</span>
          <span>Social campaigns</span>
          <span>Product variations</span>
          <span>Full resolution exports</span>
        </div>
      </div>
    </section>
  );
}
