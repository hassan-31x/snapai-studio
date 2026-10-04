const steps = [
  [
    "01",
    "Bring your product",
    "Upload a JPG, PNG, or WebP. A clear product photo gives the model a better reference.",
  ],
  [
    "02",
    "Set the direction",
    "Choose a studio shot or a campaign. Describe your setting, brand, and the feeling you want.",
  ],
  [
    "03",
    "Make it yours",
    "Review the images, create variations, and download your favorites. Your projects stay in your library.",
  ],
];
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-secondary py-16 md:py-20">
      <div className="section-wrap">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-medium md:text-4xl">
            An idea is all
            <br />
            you need to start.
          </h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            A straightforward workflow, from the first upload to the image you
            keep.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map(([n, title, text]) => (
            <article key={n}>
              <span className="mb-6 block text-sm text-blue-600">{n}</span>
              <h3 className="mb-3 text-xl font-medium">{title}</h3>
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                {text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
