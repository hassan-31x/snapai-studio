import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
export const metadata = { title: "Terms of use" };
export default function Page() {
  return (
    <main id="main-content" className="section-wrap max-w-3xl py-12">
      <BrandLogo />
      <h1 className="mb-4 mt-12 text-4xl font-medium">Terms of use</h1>
      <p className="mb-12 text-xs text-muted-foreground">
        Updated October 3, 2026
      </p>
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-medium">Using the studio</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Use Stillframe only with content you own or have permission to use. Do
          not upload unlawful content, personal documents, or material that
          infringes another person’s rights.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-medium">AI results</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Generated images can be inaccurate, including product labels and
          details. Review outputs before publishing. Stillframe does not
          guarantee sales, factual accuracy, exclusivity, or suitability for any
          commercial purpose. Model provider terms also apply.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-medium">Credits and availability</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          New accounts receive 10 image credits. A shot or variation costs one
          credit; a campaign costs five. The free allowance does not renew.
          There is no paid subscription currently. Limits, model availability,
          and service operation may change.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-medium">Your account</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Keep your sign in information safe. Automated abuse, multiple accounts
          to evade limits, and attempts to access another user’s projects are
          prohibited.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-medium">Service and deletion</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          The service is provided as available. You can delete your account in
          Settings. Download any images you want to keep before deleting your
          account.
        </p>
      </section>
      <Link href="/" className="text-sm underline">
        Return home
      </Link>
    </main>
  );
}
