# PulseStat

Privacy-focused, real-time analytics for your websites — inspired by Umami.
No cookies. No consent banners. Just clean, accurate data.

Built with **Next.js 16**, **Prisma 7**, **PostgreSQL**, and **Auth.js v5**.

---

## Features

| Feature | Details |
|---|---|
| Real-time visitors | Active count updated every 10 s |
| Pageview tracking | Per-website time-series chart |
| Bounce rate | Calculated from actual session data |
| Referrer breakdown | Domain-level referrer stats |
| Country / Language | Geo breakdown panels |
| Browser / OS / Device | Full environment breakdown |
| UTM attribution | utm_source, medium, campaign, content, term |
| Custom events | `window.pulsestat.track("event-name")` |
| Per-website page | `/websites/[id]` — full Umami-style analytics view |
| Date ranges | 24h · 7d · 30d · 90d · 6mo · 1y · all |
| Lightweight tracker | 4.4 KB IIFE, visit-rotation, SPA support |
| Rate limiting | Per-IP (Redis or in-memory fallback) |
| Bot filtering | UA-based bot/crawler rejection |
| Deduplication | Redis or in-memory event deduplication |

---

## Quick Start

### 1. Install

```bash
git clone https://github.com/your-org/pulsestat.git
cd pulsestat
npm install          # runs prisma generate automatically
```

### 2. Configure

```bash
cp .env.example .env.local
```

Minimum required variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pulsestat"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Migrate the database

```bash
npx prisma migrate deploy
```

### 4. (Optional) Seed demo data

```bash
npx prisma db seed
# Creates: demo@pulsestat.com / demo1234!
```

### 5. Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Production Build

```bash
npm run build   # runs tsc + next build + tracker bundle
npm start
```

---

## Embed the Tracker

Add to `<head>` of any site you want to track:

```html
<script
  src="https://your-pulsestat.com/tracker.js"
  data-site-id="site_YOUR_KEY"
  defer
></script>
```

**Custom events:**
```javascript
window.pulsestat.track("signup-button-clicked");
window.pulsestat.track("checkout-complete");
```

Find your site key in **Dashboard → Websites → Settings**.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           — Login, signup
│   ├── (dashboard)/      — Dashboard, websites, billing, settings
│   │   ├── dashboard/    — Main dashboard (multi-site selector)
│   │   └── websites/
│   │       └── [id]/     — Per-website full analytics page
│   └── api/
│       ├── track/        — Event ingestion (public, CORS)
│       ├── realtime/     — Active visitor feed
│       └── websites/[id]/
│           ├── stats/    — Summary + previous-period comparison
│           ├── pageviews/ — Time-series
│           ├── metrics/  — Unified breakdown (browser/os/country/referrer/utm…)
│           └── active/   — Live visitor count
├── features/
│   ├── analytics/        — Queries, chart, date-range
│   ├── billing/          — Plan limits, Paddle
│   ├── realtime/         — RealtimeCard (polls every 10 s)
│   ├── settings/         — User profile form
│   └── websites/         — Website CRUD, WebsiteCard
├── lib/                  — prisma, auth, rate-limit, logger
├── middleware/            — Security headers
└── tracker/              — Browser SDK (→ public/tracker.js)
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Random secret for JWT signing |
| `NEXTAUTH_URL` | ✅ (prod) | Full base URL of your deployment |
| `UPSTASH_REDIS_REST_URL` | ☐ | Upstash Redis for distributed rate-limiting |
| `UPSTASH_REDIS_REST_TOKEN` | ☐ | Upstash Redis token |
| `PADDLE_API_KEY` | ☐ | Paddle billing integration |
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | ☐ | Paddle client token |
| `NEXT_PUBLIC_PADDLE_ENVIRONMENT` | ☐ | `sandbox` or `production` |

---

## What Was Fixed (vs original)

| Area | Fix |
|---|---|
| `src/proxy.ts` | Auth middleware was missing entirely — created with Auth.js + rate-limit |
| `prisma/schema.prisma` | Missing `url = env("DATABASE_URL")` — database never connected |
| `src/app/api/track/route.ts` | `requestMatchesWebsite` had missing `}` and `return` — file wouldn't compile |
| `src/lib/rate-limit.ts` | Every declaration was duplicated — caused TS compile failure |
| `prisma/seed.ts` | Password stored as plaintext string — login always failed |
| Schema fields | Added `os`, `referrerDomain`, `pageTitle`, `hostname`, `urlQuery`, `visitId`, `utmSource/medium/campaign/content/term`, `eventName`, `bounces` |
| Analytics service | Added bounce rate, OS, country, referrer, language, UTM, realtime feed |
| Tracker SDK | Added hostname, title, UTM extraction, visitId rotation, custom events |
| New API routes | `/stats`, `/pageviews`, `/metrics`, `/active` |
| New pages | `/websites/[id]` per-website analytics, `/websites/[id]/settings` |
| Dashboard | Added referrer, country, OS, language tabs + bounce rate stat |
| UI components | Created missing `Tabs` component from existing `radix-ui` |
| TypeScript | Fixed 26 compiler errors (implicit any, null/undefined, missing types) |
| Next.js build | Fixed all build errors — `next build` passes cleanly |

---

## License

MIT
