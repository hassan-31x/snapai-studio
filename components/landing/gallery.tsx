import Image from "next/image";
export default function Gallery() {
  return (
    <section className="section-wrap pb-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl font-medium">
          A little inspiration
          <br />
          for your next brief.
        </h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          Studio, lifestyle, or something unexpected. You set the direction.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src="/images/skincare.jpg"
            fill
            sizes="(max-width:640px) 100vw, 50vw"
            className="object-cover"
            alt="A clean skincare product composition"
          />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src="/images/sneaker.jpg"
            fill
            sizes="(max-width:640px) 100vw, 50vw"
            className="object-cover"
            alt="An expressive red sneaker product photograph"
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Reference photography from Unsplash.
      </p>
    </section>
  );
}
