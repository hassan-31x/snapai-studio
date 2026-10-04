const questions = [
  [
    "What can I create?",
    "Product photographs in new settings, variations of saved shots, and campaign images for five social and website formats.",
  ],
  [
    "How does the free allowance work?",
    "New accounts receive 10 credits. A product shot or variation costs one credit; a campaign of five images costs five. Credits do not renew automatically, and paid plans are not available yet.",
  ],
  [
    "Do I need my own API key?",
    "No. The studio uses a shared image service. Your account allowance limits usage, so you can start after verifying your email.",
  ],
  [
    "What should I upload?",
    "Use a clear product photo in JPG, PNG, or WebP format, up to 3 MB. A simple background and a visible label help preserve the product.",
  ],
  [
    "Is my work public?",
    "Your projects are visible only inside your account. Stored image links can be opened by anyone you share them with.",
  ],
  [
    "Can I use the results for my brand?",
    "Review every result before use. AI can change labels or introduce inaccuracies. You are responsible for rights to uploaded content, product claims, and checking the model provider’s usage terms.",
  ],
];
export default function FAQ() {
  return (
    <section id="faq" className="section-wrap py-16 md:py-20">
      <div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
        <div>
          <h2 className="text-3xl font-medium">
            A few things
            <br />
            worth knowing.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Clear expectations, before you create.
          </p>
        </div>
        <div className="divide-y">
          {questions.map(([q, a]) => (
            <details key={q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                {q}
                <span
                  aria-hidden="true"
                  className="text-muted-foreground group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
