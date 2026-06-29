# PulseStat

A real-time, privacy-focused web analytics platform built for modern applications.

## Tech Stack
*   **Framework**: Next.js 16.2.6 (App Router + Turbopack)
*   **Runtime**: React 19.2.4
*   **Styling**: Tailwind CSS v4
*   **Database & ORM**: PostgreSQL + Prisma v7.8.0
*   **Authentication**: NextAuth.js v5 (Beta)
*   **Caching & Rate Limiting**: Upstash Redis
*   **Visualization**: Recharts
*   **Animation**: GSAP + Framer Motion
*   **Tracker SDK**: Custom tracking script bundled with `tsup`

## Getting Started

### 1. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pulsestat"
NEXTAUTH_SECRET="your-nextauth-secret"
UPSTASH_REDIS_REST_URL="https://your-redis-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup & Seed
Generate Prisma client and apply migrations:
```bash
npx prisma db push
npm run postinstall
npx prisma db seed
```

### 4. Running the Development Server
Build the tracker SDK and start the Next.js dev server:
```bash
npm run dev
```

## Available Scripts
*   `npm run dev` - Starts dev server.
*   `npm run build` - Bundles the tracker script and builds the production Next.js application.
*   `npm run build:tracker` - Bundles the custom tracker SDK script (`src/tracker/tracker.ts`) using `tsup`.
*   `npm run test` - Runs test suite using native `tsx` runner.
*   `npm run smoke` - Runs the smoke test suite.
