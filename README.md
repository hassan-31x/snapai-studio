# SnapAI Studio

**Your product. A whole new perspective.**

An AI product photography and ad creative studio for turning existing product photos into studio shots, campaign images, and variations. Built with Next.js, OpenRouter, and a complete account-to-export workflow.

![SnapAI Studio: AI product photography and campaign creatives](app/opengraph-image.jpg)

## Features

- **Product photography:** upload a product photo, choose a setting and aspect ratio, and generate up to four shots.
- **Campaign creatives:** create five images formatted for Instagram posts, Instagram stories, Facebook, LinkedIn, and website banners.
- **Creative direction:** refine prompts with AI and create variations of saved images.
- **Project library:** reopen saved projects, view results, and download images.
- **Canvas editor:** add text and shapes, adjust colors, save your design, and export a PNG.
- **Account management:** email verification, password reset, optional Google sign in, email two factor authentication, profile settings, and account deletion.
- **Credit controls:** shared balance tracking, request limits, failed-request refunds, and recovery for interrupted generation.
- **Responsive interface:** a minimal landing page with a fine line grid and subtle gradients, plus a dashboard, mobile navigation, studio, and settings.
- **Search and sharing:** generated OG artwork, Open Graph and Twitter cards, canonical URLs, structured data, sitemap, robots rules, and branded icons.

## How it works

1. Create an account and verify your email.
2. Upload a clear product photo in JPG, PNG, or WebP format, up to 3 MB.
3. Describe the scene and generate product shots or a campaign.
4. Reopen your saved project, create variations, or finish it in the canvas editor.
5. Download your images or export your edited design.

New accounts receive **10 image credits**.

| Action                    | Credits     |
| ------------------------- | ----------- |
| Product shot              | 1 per image |
| Image variation           | 1 per image |
| Campaign with five images | 5           |

The allowance does not renew automatically. Paid plans, checkout, and credit purchases are not implemented. Failed generation requests refund their reserved credits.

## Tech stack

| Area           | Technology                                         |
| -------------- | -------------------------------------------------- |
| Application    | Next.js 16 App Router, React 19, TypeScript        |
| UI             | Tailwind CSS 4, Radix UI, Geist, Phosphor icons    |
| Authentication | Auth.js with credentials and optional Google OAuth |
| Database       | MongoDB replica set with Prisma 6                  |
| AI             | OpenRouter image API and OpenAI-compatible SDK     |
| Image storage  | Cloudinary                                         |
| Email          | Resend                                             |
| Canvas editing | Fabric.js                                          |
| Verification   | Vitest, ESLint, TypeScript, GitHub Actions         |

Prisma 6 is retained for MongoDB support. The lockfile records the exact package versions used by the project.

## Getting started

Use **Node 24 LTS** and a MongoDB replica set, such as MongoDB Atlas. Transactions require a replica set.

```sh
nvm install
nvm use
npm ci
cp .env.example .env
```

Fill in `.env` using the configuration table below, then provision the database and start the app:

```sh
npm run db:push
npm run dev
```

Open [localhost:3000](http://localhost:3000).

`db:push` provisions schema indexes separately from the production build. Inspect proposed changes before applying them to an existing database; never use a destructive reset for an upgrade.

### Environment variables

The complete template is in [`.env.example`](.env.example). Keep provider keys and database credentials in your local environment or hosting secrets.

| Variable                                                               | Purpose                                                                                |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                                         | MongoDB replica set connection                                                         |
| `AUTH_SECRET`                                                          | Auth.js session secret; generate with `openssl rand -hex 32`                           |
| `BASE_URL`, `NEXT_PUBLIC_APP_URL`, `AUTH_URL`                          | Application origin; use the same final HTTPS origin in production                      |
| `OPENROUTER_API_KEY`                                                   | Shared server-side AI generation key                                                   |
| `OPENROUTER_TEXT_MODEL`, `OPENROUTER_IMAGE_MODEL`                      | Optional overrides for the configured model defaults                                   |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image uploads and storage                                                              |
| `RESEND_API_KEY`, `FROM_EMAIL`                                         | Verification, password reset, and two factor emails; requires a verified sender domain |
| `NEXT_PUBLIC_SUPPORT_EMAIL`                                            | Operator contact address displayed in Settings                                         |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`                             | Optional Google sign in                                                                |
| `CRON_SECRET`                                                          | Optional authenticated maintenance endpoint                                            |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`                                   | Stable shared encryption key for multiple self-hosted instances                        |
| `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`                   | Optional webmaster-tool verification tokens                                            |

The configured defaults are `google/gemini-2.5-flash-lite` for text and vision, and `google/gemini-3.1-flash-lite-image` for images. The image model must support reference images and the [OpenRouter image API](https://openrouter.ai/docs/guides/overview/multimodal/image-generation). Set a spending cap on your shared provider key and check current model pricing before opening public registration.

For Google OAuth, register `/api/auth/callback/google` on your application origin as the authorized redirect URI. The Google button is hidden when its credentials are absent.

### Isolated preview

Explore the UI using a disposable local database:

```sh
# Stop any other server on port 3000 first.
npm run preview:isolated
```

Sign in with `preview@example.test` and `PreviewPass123!`.

The preview starts a temporary MongoDB replica set and seeds one saved project using a public Cloudinary demo image. It never connects to the database in `.env`. External email and generation are disabled, and stopping the process discards the temporary database. Use this mode for development previews only.

## Development and checks

| Command                    | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| `npm run dev`              | Start the development server                         |
| `npm run lint`             | Run ESLint                                           |
| `npm run typecheck`        | Generate route types and check TypeScript            |
| `npm test`                 | Run unit and database integration tests              |
| `npm run build`            | Generate Prisma Client and create a production build |
| `npm run check`            | Run lint, type checking, tests, and production build |
| `npm start`                | Serve the production build                           |
| `npm run db:push`          | Provision MongoDB schema indexes                     |
| `npm run preview:isolated` | Start the disposable preview environment             |

The current suite contains **27 tests**, including real MongoDB replica-set integration checks for competing credit transactions, refunds, ownership, saved designs, account security, and deletion. Provider responses are mocked in automated tests. GitHub Actions runs the project checks and `npm audit --omit=dev` on pushes and pull requests.

See the [verification report](docs/VERIFICATION.md) for tested behavior and external-service checks still required before launch. Production dependencies passed the recorded audit; development-only upstream advisories are documented there.

## Deployment

1. Provision MongoDB, OpenRouter, Cloudinary, and a Resend verified sender.
2. Configure hosting secrets and the final HTTPS application origin.
3. Run `npm run db:push` against the intended database after reviewing changes.
4. Build with `npm run build` and serve with `npm start`, or use Vercel's Next.js preset.
5. Run the live-service smoke checks and SEO launch checklist before accepting public traffic.

Generation uses bounded server requests with a 300-second page limit and parallel image requests with 90-second provider deadlines. Your hosting tier and reverse proxy must support the required request duration. A separate durable job queue is not included.

Optional maintenance uses `GET /api/maintenance` with `Authorization: Bearer YOUR_CRON_SECRET`. Schedule it every 15 minutes to recover expired credit reservations and clean up stale records. User requests also recover that user's expired reservations.

Account pages are private, while Cloudinary image URLs are shareable. Landing photography is labeled as art direction references. Provider-generated output should be reviewed for product details and suitability before publishing.

Full setup and operating details: [deployment guide](docs/DEPLOYMENT.md) and [Cloudinary configuration](CLOUDINARY_SETUP.md).

## SEO and branding

The generated [OG image](app/opengraph-image.jpg) is served at `/opengraph-image.jpg` and used for Open Graph and Twitter large-image cards. Public pages have individual titles, descriptions, canonical URLs, and sharing metadata. The landing page includes WebSite and WebApplication JSON-LD. Authentication and workspace routes are excluded from indexing and the public sitemap.

Set the final application origin before building, connect Search Console and Bing Webmaster Tools, and submit `/sitemap.xml` after deployment.

- [SEO verification report](docs/seo/FULL-AUDIT-REPORT.md)
- [SEO launch checklist](docs/seo/ACTION-PLAN.md)
- [OG image generation details](docs/seo/OG-IMAGE.md)

## Project structure

```text
app/                 Landing, authentication, workspace pages, API routes, metadata
components/          Studio, editor, navigation, forms, and shared UI
actions/            Server actions for accounts, generation, and saved designs
lib/                 Database, OpenRouter, validation, credits, security, and SEO
prisma/              MongoDB schema
tests/               Unit and replica-set integration tests
scripts/             Isolated preview tooling
docs/                Deployment, verification, and SEO documentation
```

## License

[MIT](LICENSE) © Hassan.
