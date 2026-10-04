# Verification

Verified with Node 24 LTS, Next.js 16.3.8, React 19.3, and Prisma 6.19.3.

## Automated checks

- ESLint and TypeScript pass.
- All 27 tests pass.
- Production compilation and prerendering pass.
- Unit tests cover input limits, image signatures, credit costs, account identity, failed generation refunds, concurrent claims, and OpenRouter image responses.
- Integration tests start an isolated MongoDB replica set, create the real indexes, and exercise competing credit transactions, refunds, completed and failed generation persistence, cross-account reads, interrupted-request recovery, email verification, restricted profile updates, two factor credentials, password session versions, and cascade deletion.
- `npm audit --omit=dev` reports zero production dependency vulnerabilities. The full audit retains five development-only advisories in the Next ESLint plugin's glob/parser chain; forcing npm's recommended downgrade would mismatch the Next.js 16 lint integration. Prisma's development merge dependency is overridden to its fixed version and verified through schema generation and MongoDB provisioning.

## Browser checks

The collaborative preview uses a disposable local replica set and a verified fixture account, independent of `.env` database credentials. Sign in, dashboard statistics, saved-project loading, studio upload, failed-generation credit restoration, editor initialization, design save and reload, PNG export, and responsive layout are exercised against that fixture. Landing and authenticated screens are checked at phone and desktop widths.

## External services

Real OpenRouter generation, Resend inbox delivery, Google OAuth, and production Cloudinary credentials are not verified in this session. The repository has no configured `OPENROUTER_API_KEY`. Test generation uses mocked provider outputs; the isolated preview deliberately disables external paid services. Before launch, run the real-service smoke checklist in DEPLOYMENT.md with your own credentials and final domain.

No production database reset, hosting deployment, payment integration, or public launch was performed. The app implements a finite free allowance; no checkout or subscription plan is represented as available.
