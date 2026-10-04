# Stillframe

A product photography and ad creative studio built with Next.js 16, React 19, Auth.js, Prisma/MongoDB, OpenRouter, Cloudinary, and Resend.

Users verify their email, open a studio, upload a product photo, generate shots or five-format campaigns, create variations, reopen saved projects, edit a canvas, and export images. Each new account gets 10 image credits. There is no paid subscription or credit purchase flow yet.

## Run locally

Use Node 24 LTS (`nvm use`, or install it with `nvm install`).

```sh
npm ci
cp .env.example .env
# Fill the required settings in .env.
npm run db:push
npm run dev
```

MongoDB must be a replica set, such as Atlas. `db:push` creates the schema's indexes; it is a separate provisioning step, never part of the production build. Existing documents do not need a destructive reset. Prisma 6.19.3 is intentionally retained for MongoDB support. TypeScript 6 is retained for the current ESLint integration.

The landing and auth screens render without database or API credentials. Live authentication and generation require the services below. Existing OpenAI keys are not used.

## Service configuration

| Setting                                                                | Purpose                                                        |
| ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| `DATABASE_URL`                                                         | MongoDB replica set connection                                 |
| `AUTH_SECRET`                                                          | Auth.js session encryption; generate a random 32-byte secret   |
| `BASE_URL`, `NEXT_PUBLIC_APP_URL`                                      | Final application origin, including HTTPS in production        |
| `RESEND_API_KEY`, `FROM_EMAIL`                                         | Transactional email with a verified sender domain              |
| `OPENROUTER_API_KEY`                                                   | Shared server-side generation key                              |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image storage                                                  |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`                             | Optional Google login; callback is `/api/auth/callback/google` |
| `NEXT_PUBLIC_SUPPORT_EMAIL`                                            | Contact address displayed in Settings                          |
| `CRON_SECRET`                                                          | Optional protected maintenance endpoint                        |

Default prompt/vision model: `google/gemini-2.5-flash-lite`. Default image model: `google/gemini-3.1-flash-lite-image`. Override these with `OPENROUTER_TEXT_MODEL` and `OPENROUTER_IMAGE_MODEL`. The image model must support references and the [OpenRouter image API](https://openrouter.ai/docs/guides/overview/multimodal/image-generation). Image pricing differs from text token pricing; consult the model's live endpoint prices and set a spending cap on the shared OpenRouter key before public launch.

API failures return errors and refund credits. Stock photography is used only as clearly labeled landing-page art direction, never as a substitute for generated results.

## Verify

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```

Unit tests cover upload signatures, validation, account field restrictions, credit concurrency and idempotent refunds, ownership, provider failure, and OpenRouter's image protocol. `npm run check` runs the first four commands together.

For an isolated UI preview:

```sh
# Stop another dev server on port 3000 first.
npm run preview:isolated
```

This starts a disposable local MongoDB replica set and seeds a verified account: `preview@example.test` / `PreviewPass123!`. It does not connect to the database in `.env`; external email and generation are disabled. The saved image is a Cloudinary public demo fixture. Stopping the process discards the database. This preview is a development tool, never a production mode.

## Deploy

See [deployment instructions](docs/DEPLOYMENT.md) and [verification notes](docs/VERIFICATION.md). Build with `npm run build`, start with `npm start`, and provision MongoDB once with `npm run db:push` against the intended environment. Use a Node host that permits requests of at least 300 seconds for generation, or Vercel with that duration supported and configured. Images are generated in parallel with 90-second provider deadlines; campaign planning adds a bounded text request.

The service uses essential authentication cookies only. Optional session recording and analytics have been removed. The included privacy and terms pages reflect the implementation; fill the operator contact address and review the policies for your business before launch.

Production dependencies pass `npm audit --omit=dev`. The full audit currently includes upstream advisories in the Next.js ESLint plugin's development-only glob parser chain. They do not appear in the production dependency audit. Do not blindly downgrade the Next.js lint integration to resolve those advisories.
