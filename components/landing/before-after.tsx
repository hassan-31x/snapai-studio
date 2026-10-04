import Image from "next/image";
export default function BeforeAfter() {
  return (
    <section className="section-wrap grid items-center gap-12 py-16 md:grid-cols-2 md:py-20">
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <Image
          src="/images/fragrance.jpg"
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          alt="Fragrance product styled with flowers and soft light"
          className="object-cover"
        />
      </div>
      <div>
        <p className="mb-4 text-sm text-blue-600">
          Your product stays the focus
        </p>
        <h2 className="text-3xl font-medium md:text-4xl">
          Change the setting.
          <br />
          Keep the character.
        </h2>
        <p className="mt-6 max-w-md text-base text-muted-foreground">
          The model uses your photo as a reference, so you can explore lighting,
          backgrounds, and composition around the product you already have.
        </p>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">
          AI can alter fine details. Review labels and proportions before
          publishing, especially when accuracy matters.
        </p>
      </div>
    </section>
  );
}
