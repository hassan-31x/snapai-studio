# Deploy SnapAI Studio

1. Use Node 24 LTS. Install from the committed lockfile with `npm ci`.
2. Create a MongoDB Atlas database (or replica set), a Cloudinary account, an OpenRouter key, and a Resend verified sending domain. Set the variables listed in `.env.example` as environment secrets.
3. Set `BASE_URL`, `NEXT_PUBLIC_APP_URL`, and `AUTH_URL` to the final HTTPS origin. `AUTH_URL` also configures Auth.js host trust for self-hosted production. Set the support contact address. Do not set `NODE_ENV` manually on Vercel; Next manages it.
4. Provision indexes with `npm run db:push`, using the intended production `DATABASE_URL`. Never use `--force-reset` or `--accept-data-loss` on an existing database. Inspect any proposed changes first. The additive models are `RateLimit`, `CreditReservation`, and `Design`; users also have a defaulted `sessionVersion` field.
5. Build with `npm run build`, then run `npm start` or deploy using Vercel's Next.js preset. The generation page declares a 300-second limit. Your hosting tier must support that duration. Self-hosted reverse proxies must permit it too.
6. Optional Google authentication: set the two Google variables and add `https://YOUR_DOMAIN/api/auth/callback/google` as an authorized redirect URI. Without both variables the Google button is hidden.
7. Restrict the OpenRouter key's spending and monitor usage. New verified accounts receive 10 credits. Product shots and variations cost one per image, campaigns cost five. There is no renewal or checkout. Existing users retain their existing credit balance.
8. Schedule an authenticated GET to `/api/maintenance` every 15 minutes, with `Authorization: Bearer YOUR_CRON_SECRET`, using your host's scheduler. It restores expired credit reservations, marks stale generations failed, and removes old rate-limit counters. If no scheduler is configured, user requests also recover that user's expired reservations.
9. Run the live smoke checks below before accepting public traffic.
10. Complete the [SEO launch checklist](seo/ACTION-PLAN.md): confirm the final canonical origin, connect webmaster tools, submit the sitemap, and test the sharing card on the public domain.

## Live smoke checks

- Register a fresh account, receive the real verification message, verify, and sign in.
- Upload a real product image, generate one shot, confirm one credit was spent, and download it.
- Create a campaign, inspect all five exported formats, and confirm five credits were spent.
- Generate one variation, reopen the project, edit and save a canvas, reload it, and export PNG.
- Confirm two separate accounts cannot access each other's project, image, or editor URLs.
- Save a profile name, change a password, reset a password by email, and test email two factor login.
- Confirm password changes invalidate older sessions.
- Exhaust a test account's allowance and confirm generation cannot spend below zero.
- Test a provider failure and confirm refunds; test maintenance on an expired reservation.
- Delete a test account and verify database removal and storage cleanup logs.

## Operational limits

Generation runs inside a bounded server request. Closing the browser can hide the immediate result; the project library stores completed work. A host restart can interrupt the provider request; the reservation expires after 15 minutes and is refunded. This implementation does not include a separate job queue, automatic paid retries, or background workers. Scale to a durable job queue before increasing batch sizes or adopting a short-duration host.

Database counters enforce account and email limits across instances. IP limits use the deployment's `x-forwarded-for` header. Your ingress must replace untrusted forwarded headers, and should enforce additional bot/IP restrictions for a large public launch. Verified email limits casual allowance abuse but is not proof of a unique human.

Cloudinary image delivery uses public URLs. Account pages are private, but a shared link grants image access. For sensitive content, adopt authenticated Cloudinary delivery before advertising private storage.

Set a stable `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` across multiple self-hosted instances. Keep `AUTH_SECRET` stable between deploys. Review backup retention and service provider policies for your actual business. Monitor provider errors, database availability, refunds, and failed Cloudinary cleanup.
