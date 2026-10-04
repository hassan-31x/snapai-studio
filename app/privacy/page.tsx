import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
export const metadata = { title: "Privacy policy" };
export default function Page() {
  return (
    <main id="main-content" className="section-wrap max-w-3xl py-12">
      <BrandLogo />
      <h1 className="mb-4 mt-12 text-4xl font-medium">Privacy policy</h1>
      <p className="mb-12 text-xs text-muted-foreground">
        Updated October 3, 2026
      </p>
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-medium">Your account</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Stillframe stores your name, email address, hashed password, account
          security settings, credit balance, and creative projects. Passwords
          are never sent to the image service.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-medium">Your uploads and prompts</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Photos and prompts are sent to OpenRouter and its model providers to
          fulfill your requests. Images are stored with Cloudinary.
          Transactional email is delivered with Resend. Google receives
          authentication information if you choose Google sign in.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-medium">Access and retention</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Project pages are restricted to your account. Cloudinary image URLs
          are shareable links, not private vault storage. Do not upload
          sensitive documents. Account deletion removes your database records;
          image cleanup is attempted separately. Provider backups and retention
          policies may apply.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-medium">Cookies</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          The app uses essential authentication cookies. Session recording and
          optional analytics are disabled by default.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-medium">Your choices</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          You can update your profile, reset your password, and delete your
          account from Settings. Contact the operator through the contact
          address shown in Settings for data requests.
        </p>
      </section>
      <Link href="/" className="text-sm underline">
        Return home
      </Link>
    </main>
  );
}
