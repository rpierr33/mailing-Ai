# mailing-Ai

## Architecture Notes

- **Auth**: NextAuth 5 beta. Credentials + Google providers, JWT sessions. Every API route goes through `requireAuth()` from `src/lib/auth-guard.ts` — no public read/write endpoints. Unauthenticated requests get `401 Unauthorized`.
- **Database**: Uses an in-memory mock store (`src/lib/db.ts`) seeded with deterministic demo data. No PostgreSQL or DATABASE_URL required for development/demo. All rows carry a `userId` column and API routes filter by `user.id` (`session.user.id`) so tenants cannot see each other's campaigns / contacts.
- **Email Sending**: Uses Resend SDK (`src/lib/email.ts`). When `RESEND_API_KEY` is not set, emails are mocked (returns success with a mock message ID). Set the env var to enable real delivery.
- **AI Generation**: Routes at `/api/ai/generate-email` and `/api/ai/generate-subject` are rate-limited per authenticated user (10 and 15 requests/minute respectively) — keyed by `user.id`, not IP, so shared NATs don't collide.
- **Write safety**: PATCH endpoints on `/api/campaigns` and `/api/contacts` use a `pickAllowed()` allowlist. Anything not in `CAMPAIGN_PATCH_FIELDS` / `CONTACT_PATCH_FIELDS` is silently dropped → no mass-assignment of `userId`, `createdAt`, stats, etc.

## What's landed

- ✅ All API routes auth-guarded (campaigns, contacts, send, analytics, ai/generate-email, ai/generate-subject).
- ✅ Multi-tenant scoping: campaigns & contacts filtered + ownership-checked by `userId`.
- ✅ Campaign send route: ownership check on the campaign; contacts filtered by owner; 400 when no recipients exist instead of silently succeeding.
- ✅ Real recipient counts: new campaigns pull `recipients` from the caller's own contact count (no more `Math.random()` placeholder at creation time — though seeded demo campaigns still have static stats).
- ✅ PATCH mass-assignment protection via allowlist.
- ✅ Zod validation (`safeParse`) on every write body.
- ✅ TypeScript typecheck clean (`npx tsc --noEmit`).

## ⚠️ Operator-facing workarounds / known gaps

1. **Mock store is per-process**. Any `next dev` / `next start` reload wipes user-created data. Demo-suitable only. Before deploying: swap `src/lib/db.ts` for a real DB (Postgres + Drizzle or Prisma). All callers go through `getCampaigns()` / `addCampaign()` / etc., so the surface is small.
2. **Seeded demo data is hardcoded to `userId: "demo-user-001"`**. A fresh signup will not see any seeded campaigns or contacts until they create some. If you want new users to see demo content, either (a) re-seed per-user on first login, or (b) remove the seed block in `src/lib/db.ts`.
3. **Seeded analytics are deterministic mock values**, not wired to Resend webhooks. `getAudienceGrowthData / getOpensClicksData / getHeatmapData` return synthetic series. For real analytics: ingest Resend webhooks (`email.opened`, `email.clicked`, `email.bounced`) into your real DB and aggregate from there.
4. **Campaign stats on seed rows** (openRate, clickRate, recipients) are static. New campaigns created via the UI get real recipient counts now, but the 3 seeded ones will keep their fixed values.
5. **NextAuth session `user.id` typing**. Default NextAuth types don't include `id` on `session.user` — `auth-guard.ts` casts via `(session?.user as { id?: string })?.id`. If a real `types/next-auth.d.ts` module-augmentation file is added, simplify the guard accordingly.
6. **No password reset / email verification flow**. Credentials provider accepts email+password; there's no "forgot password" path, no verify-email-on-signup. Fine for demo, not fine for prod.
7. **Rate limit is in-memory**. `checkRateLimit` stores counters in a Map; multi-instance deployments will see drift. For prod: swap to Redis (Upstash or equivalent).
8. **No CSRF on custom API routes**. NextAuth handles its own endpoints; our JSON API routes rely on same-origin + cookie JWT. If you expose these to other origins, add CSRF tokens or move to Bearer auth.
9. **`sendEmail` runs synchronously in the request**. Large sends will block the Vercel/Node request for minutes and may time out. For prod: push to a queue (Resend has batch + idempotency).
10. **Lint cannot be verified in this sandbox** — `next lint` tries to download the SWC binary and the sandbox has no outbound registry access. Typecheck is clean; run `pnpm lint` in your local env before merging.

## Files most changed in the audit

- `src/lib/auth-guard.ts` — NEW. `requireAuth()` + `pickAllowed()`.
- `src/app/api/campaigns/route.ts` — auth guard, user scoping, allowlist PATCH, ownership checks, real recipient counts.
- `src/app/api/contacts/route.ts` — auth guard, user scoping, allowlist PATCH.
- `src/app/api/send/route.ts` — ownership check, user-scoped recipients, no-recipients 400.
- `src/app/api/analytics/route.ts` — auth guard.
- `src/app/api/ai/generate-email/route.ts` — auth guard, per-user rate limit.
- `src/app/api/ai/generate-subject/route.ts` — auth guard, per-user rate limit.
