# Rivals Codes Hub

English US/EU-focused live-service hub for **Marvel Rivals** guides/meta and **redeem codes** for Genshin Impact, Honkai: Star Rail, and Wuthering Waves.

## Stack

- Next.js (App Router) + TypeScript
- PostgreSQL + Prisma
- Scheduled crawlers via `/api/cron/*` (Vercel Cron ready)

## Quick start

```bash
# 1) Start Postgres
docker compose up -d

# 2) Install + migrate + seed
npm install
npx prisma migrate dev --name init
npm run db:seed

# 3) Dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Cron jobs

Protected by `CRON_SECRET`:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/codes
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/patches
```

- **Codes:** ingests `data/codes-feed.json` (+ optional `CODES_FEED_URL`), then verifies/expires stale entries.
- **Patches:** pulls Marvel Rivals Steam news and upserts editorial patch pages.

## AdSense

Set in `.env`:

- `NEXT_PUBLIC_ADSENSE_CLIENT`
- `NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE`
- `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR`
- `NEXT_PUBLIC_ADSENSE_SLOT_CODES`

Slots render placeholders until those values are present.

## Content policy

Original summaries + structured tables only. Always attribute and link official sources. Do not wholesale republish third-party articles.
