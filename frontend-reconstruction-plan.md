# PulseStat — Frontend Reconstruction Plan

**Repo:** `Ramnivas11/PulseStat` (branch: `pulse-v2`)
**Live:** pulse-stat.ramnivas.in
**Scope of this document:** Phase 1–5 audit, then the final Antigravity prompt.

---

## 1. Repository Audit

### 1.1 Architecture Overview

```
src/
├── app/
│   ├── (auth)/login, signup          → public, unauthenticated
│   ├── (dashboard)/                  → protected, shares one layout.tsx
│   │   ├── dashboard/                → multi-site overview (the main page)
│   │   ├── websites/                 → list + [id] detail + [id]/settings
│   │   ├── docs/                     → static integration snippets
│   │   ├── settings/                 → profile / password / delete account
│   │   └── billing/                  → usage + plan cards (Paddle disabled)
│   ├── api/                          → 13 route handlers (see 1.3)
│   ├── page.tsx                      → marketing landing page
│   ├── pricing/, privacy/, terms/, refund-policy/   → static marketing pages
├── components/
│   ├── ui/        → shadcn primitives, default styling, untouched tokens
│   ├── layout/    → Navbar, Sidebar, Footer
│   └── shared/    → PageHeader, EmptyState, LoadingSpinner, ThemeProvider/Toggle
├── features/      → analytics, billing, dashboard, marketing, realtime, settings, websites
├── lib/           → auth.ts, auth.config.ts, prisma.ts, rate-limit.ts, logger.ts, utils.ts
├── legacy/billing  → Paddle code, intentionally disconnected
├── tracker/       → source for the public tracker.js (bundled via tsup)
└── proxy.ts        → Next.js middleware entrypoint (NOT middleware.ts — see 1.5)
```

**Route groups:** `(auth)` and `(dashboard)` are Next.js route groups — they don't appear in the URL. `(dashboard)/layout.tsx` renders a fixed desktop sidebar + sticky navbar with a Sheet-based mobile drawer already wired up correctly.

**State management:** No global client state library. Everything is React Server Components fetching directly from Prisma/service functions, with `useState`/`useEffect` for client-only widgets (realtime polling, forms). This is intentional and idiomatic for the App Router — **do not introduce Redux/Zustand/Jotai**, there's nothing here that needs it.

**Forms:** `react-hook-form` + `zod` via `@hookform/resolvers`, consistently used in login, signup, settings, create/edit website forms.

**Auth flow:** Auth.js v5 (`next-auth@beta`) with a Credentials provider, bcrypt password hashing, JWT sessions (30-day, refreshed every 24h). Route protection happens in `proxy.ts` via the `authorized` callback in `auth.config.ts`, which gates `/dashboard`, `/websites`, `/settings`, `/billing`, `/docs`.

### 1.2 Dependency Analysis

| Category | Library | Version | Notes |
|---|---|---|---|
| Framework | Next.js | **16.2.6** | Very recent major version — see 1.5 |
| React | react / react-dom | **19.2.4** | |
| Language | TypeScript | ^5, `strict: true` | Strict mode already on — keep it on |
| Styling | Tailwind CSS | ^4 (CSS-first `@theme`) | No `tailwind.config.js`; tokens live in `globals.css` |
| Components | `shadcn` (CLI) + `radix-ui` | shadcn ^4.7, radix-ui ^1.4.3 | Only ~15 primitives installed (button, card, dialog, dropdown-menu, form, input, label, select, separator, sheet, skeleton, sonner, table, tabs, accordion, avatar) |
| Animation | **framer-motion** ^12.38 | ✅ installed, used only on `/login` and `/signup` | |
| Animation | **GSAP** | ❌ **not installed anywhere** | The prompt you provided asks for GSAP + ScrollTrigger — this is a net-new dependency, not a refactor |
| Icons | lucide-react ^1.14 | | |
| Charts | recharts ^3.8 | used in `PageViewsChart` only | |
| Forms | react-hook-form + zod ^4 | | |
| Auth | next-auth ^5.0.0-beta.31 | beta — pin exact version before any upgrade work |
| DB | Prisma ^7.8 + `@prisma/adapter-pg` | Postgres via driver adapter (Prisma 7 style) | |
| Rate limiting | `@upstash/ratelimit` + `@upstash/redis` | optional, falls back to in-memory | |
| Testing | **none** | No Jest/Vitest/Playwright in `package.json` | This materially raises redesign risk — see Risk Report |

### 1.3 Backend Dependency Map (per route)

| Page | Route | Server data / mutations consumed | Client-side calls |
|---|---|---|---|
| Landing | `/` | none | none |
| Pricing / Privacy / Terms / Refund | static routes | none | none |
| Login | `/login` | — | `signIn("credentials")` (next-auth client) |
| Signup | `/signup` | — | `POST /api/signup` |
| **Dashboard** | `/dashboard` | `auth()`, `getWebsitesByUserId`, `canCreateWebsite`, **13 parallel analytics service calls** (`getDashboardStats`, `getTopPages`, `getBrowserStats`, `getDeviceStats`, `getDailyStats`, `getOSStats`, `getCountryStats`, `getReferrerStats`, `getLanguageStats`, `getAvgSessionDuration`, `getUTMStats` ×3) | `RealtimeCard` polls `GET /api/realtime/[websiteId]` every **10s** |
| Websites list | `/websites` | `getWebsitesByUserId`, `canCreateWebsite` | `POST /api/websites` (create), `DELETE /api/websites/[id]` (delete, from `WebsiteCard`) |
| Website detail | `/websites/[id]` | direct Prisma reads + `/stats`, `/pageviews`, `/metrics` route logic (Umami-style full page, 279 lines) | `GET /api/websites/[id]/active` (realtime) |
| Website settings | `/websites/[id]/settings` | direct Prisma read of the website | `PATCH /api/websites/[id]` (edit), `DELETE /api/websites/[id]` (delete, same card reused) |
| Docs | `/docs` | reads the user's first website's `siteKey` to pre-fill snippets | none (copy-to-clipboard only) |
| Settings | `/settings` | `auth()` | `PATCH /api/user` (profile), `PATCH /api/user/password`, `DELETE /api/user` (account deletion) |
| Billing | `/billing` | usage stats (`getCurrentSubscription`/`canCreateWebsite`-style logic), static plan cards | `GET /api/usage` (Usage Overview widget); **Upgrade buttons are non-functional** — Paddle is deliberately disabled and parked in `src/legacy/billing/` per `TODO.md` |

### 1.4 Risk Classification

| Page | Risk | Why |
|---|---|---|
| `/`, `/pricing`, `/privacy`, `/terms`, `/refund-policy` | **LOW** | Fully static marketing content, no auth, no mutations. Safe to fully restyle. |
| `/docs` | **LOW** | Read-only, one dynamic string interpolation (site key). |
| `/login`, `/signup` | **MEDIUM** | Already has framer-motion polish (the *best*-designed page in the app today). Auth submission logic (`signIn`, `fetch`) must stay byte-identical; only markup/classes change. |
| `/billing` | **MEDIUM** | Mostly static "coming soon" UI, but `UsageOverview` pulls live data, and the Upgrade buttons must remain visibly disabled/no-op — don't accidentally wire them to anything. |
| `/websites` | **MEDIUM-HIGH** | Create (POST) and delete (DELETE) flows with toasts/optimistic UI live in `WebsiteCard` / `CreateWebsiteForm`. |
| `/settings` | **HIGH** | Three independent mutations (`PATCH /api/user`, `PATCH /api/user/password`, `DELETE /api/user`). Account deletion is irreversible — the "Danger Zone" confirmation UX must be preserved or strengthened, never weakened. |
| `/websites/[id]/settings` | **HIGH** | Edit (PATCH) + delete (DELETE) on a real resource; delete is irreversible (cascades analytics data). |
| **`/dashboard`** | **HIGH** | The single most complex page: 13 parallel data dependencies, conditional empty/upgrade states, `searchParams`-driven `siteId`/`range` filtering, a 10s-polling realtime widget, and three internal helper components (`MetricsCard`, `BreakdownList`) defined in the same file. Any restructuring must preserve every prop contract. |
| **`/websites/[id]`** | **HIGH** | Same shape as dashboard but for a single site (279 lines), with its own settings sub-route. |

### 1.5 A constraint that overrides everything else

The repo ships its own `AGENTS.md`:

> *"This is NOT the Next.js you know. This version has breaking changes... Read the relevant guide in `node_modules/next/dist/docs/` before writing any code."*

This is corroborated by what's actually in the codebase: there is **no `middleware.ts`** — the middleware entrypoint is `src/proxy.ts`, a Next 16 convention that doesn't exist in most LLM training data. Antigravity (or any agent) pattern-matching to "standard Next.js" will likely try to rename, duplicate, or "fix" `proxy.ts`, which would silently break auth on every protected route. **This must be called out explicitly and early in the final prompt**, not left implicit.

---

## 2. UX/UI Audit

### Cross-cutting issues (apply to nearly every page)

- **Design tokens are 100% shadcn defaults.** `globals.css` uses the out-of-the-box OKLCH neutral palette with blue-600/emerald-500 swapped in as primary/secondary — nothing has been customized at the token level (radius, type scale, shadow scale, spacing scale all default). This is the literal "never leave default styling" anti-pattern the brief warns against.
- **One font, no scale.** Only Inter, loaded as a generic system stack — no display/heading face, no defined type scale (the brief asks for "large typography, strong hierarchy").
- **No skeleton/loading states except one.** Only `/dashboard` has a `loading.tsx`. `/websites/[id]`, `/settings`, `/billing` have none — a slow DB will show a blank page.
- **Inconsistent card chrome.** Some cards use the `glass` utility (backdrop-blur), others use plain `Card` — no documented rule for when each applies.
- **GSAP-driven landing-page storytelling doesn't exist yet.** The marketing page (image 2) is static sections with no scroll-triggered reveals, despite framer-motion already being a dependency. This is a fresh build, not a refactor.

### Page-by-page

**Landing (`/`)** — Functional but generic: standard hero → logos → feature grid → pricing → FAQ → CTA → footer pattern, zero motion, zero parallax. Good bones for a Linear/Vercel-style rebuild since the section order is already correct.

**Login / Signup** — Best page in the app today (glass card, gradient blobs, staggered field animation, shake-on-error). One dead link: "Forgot Password?" points to `href="#"`. Treat this page as the *design reference* for the rest of the app rather than something to fully rebuild.

**Dashboard** — Functionally dense, visually flat. Five stat cards in a row with no relative emphasis (pageviews and bounce rate look equally important). The traffic chart and realtime card are oddly paired into a `[1fr_400px]` grid that won't gracefully degrade between tablet breakpoints. Tabs-in-cards pattern (Sources/Environment) is consistent but visually busy at default shadcn tab styling.

**Websites list** — Underbuilt relative to its importance: one card per site key (image 4), no usage badges per site, no quick-stat preview, "1/1 on free plan" banner does the limit-messaging work the cards should be doing visually.

**Website detail (`[id]`)** — Mirrors the dashboard almost 1:1; worth asking whether this duplication is intentional (per-site deep-dive) or should share more component surface — flagging, not deciding, since this is a UX/architecture question for you, not something to silently resolve.

**Docs** — Clean, functional, but plain code blocks with no syntax highlighting and a slightly inconsistent monospace treatment vs. the rest of the app's mono usage (tracker IDs vs. code snippets render in different containers).

**Settings** — Three stacked cards (Profile, Change Password, Danger Zone) — correct structure, but the Danger Zone currently has the same visual weight as a normal card with just a red label; for an irreversible action this likely deserves a stronger confirmation pattern (e.g., type-to-confirm) — again, a product decision to raise with you, not to silently add.

**Billing** — The "Coming Soon" banner and feature checklist do a lot of the page's visual work (image 7) — reads more like a placeholder than a premium plan page. The actual Free/Pro comparison cards underneath are correctly built (good place to anchor the Stripe-style redesign).

### Accessibility

- Mobile nav (`Sheet` + `aria-label="Open navigation"`) is correctly implemented — a genuine strength, don't regress it.
- Sidebar nav has `aria-label="Main navigation"` and uses real `<nav>`/`<Link>` — good baseline.
- No skip-to-content link anywhere.
- Several icon-only buttons (theme toggle, refresh button) need to be checked individually for `aria-label`/`sr-only` text during implementation — not all currently inspected.

---

## 3. Design Strategy

Given the actual stack, here's the realistic strategy (not just restating the brief back):

1. **Token system first, components second.** Before touching any page, define a real design system in `globals.css`: a deliberate type scale, a heading font pairing (Inter stays for body; add a display face for H1/H2 only), a spacing rhythm, and a restrained shadow/radius scale. Every subsequent page change inherits this for free.
2. **Login page is the north star.** Its glass-card + gradient-orb + stagger language should become the *toned-down* baseline for dashboard cards too — not louder, just consistent.
3. **GSAP is additive, install it deliberately.** It's needed only for the public marketing pages (`/`, `/pricing`) — scroll-triggered hero/feature reveals. The authenticated dashboard should stay on framer-motion only (hover/tap/layout transitions); mixing both motion systems inside the same dashboard page adds bundle weight for no UX gain.
4. **Don't rebuild `/websites/[id]` and `/dashboard` twice.** Audit first whether they can share a `<SiteAnalyticsView>` composition before restyling both independently — restyling first and de-duplicating never happens in practice.
5. **Treat Billing as "static placeholder" honestly** — give it a premium look without pretending the Upgrade button does something it doesn't (no fake loading spinners on a no-op button).

---

## 4. Risk Report (summary)

| Risk | Severity | Mitigation |
|---|---|---|
| No automated tests exist anywhere in the repo | **High** | Before any visual rebuild, capture a manual smoke-test checklist per HIGH-risk page (login, dashboard data, create/delete website, settings mutations, account deletion) and re-run it after every phase. Antigravity should not "assume" parity. |
| `proxy.ts` mistaken for a missing `middleware.ts` | **High** | Explicit instruction in the final prompt (already included below) — never create/rename/duplicate this file. |
| Next 16 / React 19 / Prisma 7 / Tailwind 4 are all bleeding-edge | **Medium** | Agent's training data likely defaults to older API shapes (Tailwind config file, Prisma `$connect` patterns, Next 13–14 middleware). Must consult `node_modules/next/dist/docs/` and existing code patterns before generating anything, per `AGENTS.md`. |
| `/dashboard` and `/websites/[id]` have large, deeply-coupled server components (16K/12K source, multiple `Promise.all` data dependencies) | **Medium** | Refactor into smaller composed components incrementally, verifying each extraction renders identical data before moving to the next. |
| Paddle billing is intentionally disabled (`src/legacy/billing/`) | **Low-Medium** | Don't "helpfully" reconnect it during a frontend pass — it's explicitly parked per `TODO.md` pending a future, separate effort. |
| Stray `design-system/pulsestat/pages/auth.md` file with no `MASTER.md` | **Low** | Pre-existing orphaned doc, unrelated to current task — flagging only, not deleting. |

---

## 5. Component Plan (high level)

New/refactored shared primitives needed before page work starts:
- `<PageHero>` — replaces the inline radial-gradient header block currently duplicated ad hoc in dashboard/website-detail.
- `<StatCard>` — generalize the existing `StatsCard` to support a visual hierarchy (primary vs. secondary metrics), since right now all 5 dashboard stats render identically.
- `<BreakdownPanel>` — extract `MetricsCard`/`BreakdownList` out of `dashboard/page.tsx` into `features/analytics/components/`, shared by both dashboard and `[id]` page.
- `<MotionSection>` (GSAP ScrollTrigger wrapper) — marketing pages only.
- `<DangerZoneConfirm>` — shared destructive-action pattern for settings + website delete.

No new shadcn primitives appear necessary beyond what's installed; `badge` and `tooltip` are conspicuously absent and likely worth adding (`npx shadcn add badge tooltip`) for the stat-hierarchy and icon-button-labeling work above.

---

## 6. Final Antigravity Prompt

Copy everything below into Antigravity as-is.

```
ROLE
You are reconstructing the frontend of PulseStat, a Next.js 16 / React 19 / Prisma 7 / Tailwind 4 analytics SaaS. The backend is stable and fully functional. Your job is frontend-only: visual design, component structure, motion, and responsiveness. You are NOT redesigning data models, APIs, or business logic.

CRITICAL — READ BEFORE TOUCHING ANYTHING
This codebase pins very recent major versions: Next.js 16.2.6, React 19.2.4, Prisma 7.8, Tailwind CSS 4 (CSS-first config, no tailwind.config.js), next-auth v5 beta. Your training data's default assumptions about these tools' APIs are likely wrong or outdated for this version. The repo's own AGENTS.md states explicitly: "This is NOT the Next.js you know... Read the relevant guide in node_modules/next/dist/docs/ before writing any code." Follow that instruction literally before generating any code that touches routing, middleware, data fetching, or config files.

Specifically: the middleware entrypoint is src/proxy.ts, NOT middleware.ts. This is intentional for this Next.js version. Do not create, rename, duplicate, or "fix" this file. If you believe middleware is missing, you are wrong — check src/proxy.ts first.

NON-NEGOTIABLE BOUNDARIES
Do not modify, in any phase, for any reason:
- Any file under src/app/api/**
- src/lib/auth.ts, src/lib/auth.config.ts, src/proxy.ts
- prisma/schema.prisma, prisma/migrations/**
- Any *.service.ts file under src/features/**/services/
- src/legacy/billing/** (intentionally disconnected — do not reconnect Paddle)
- Environment variables / .env*

These are backend/business-logic boundaries. Frontend reconstruction means: JSX/markup, Tailwind classes, component composition, motion, and the design tokens in src/app/globals.css. If a visual goal seems to require changing a service function or API contract, STOP and ask for approval before proceeding — do not work around it by guessing at a new contract.

WHAT MUST KEEP WORKING (manual regression checklist — re-verify after every phase)
1. Login with valid/invalid credentials (toast + redirect behavior)
2. Signup flow
3. Dashboard loads with real data for a logged-in user with ≥1 website
4. Dashboard's "no websites yet" and "website limit reached" empty states
5. Date range selector and site selector on dashboard (searchParams-driven)
6. Realtime card continues polling every 10s without console errors
7. Create website (POST), delete website (DELETE), edit website (PATCH)
8. Settings: profile update, password change, account deletion (with confirmation)
9. Billing page Upgrade buttons remain visually present but non-functional (Paddle is deliberately disabled)
10. Mobile sidebar (Sheet drawer) still opens/closes correctly
There are no automated tests in this repo. You are the only verification layer — treat this checklist as mandatory, not optional, after each phase.

ARCHITECTURE YOU'RE WORKING WITH
- App Router with route groups: (auth) for login/signup, (dashboard) for the protected app shell (dashboard, websites, websites/[id], websites/[id]/settings, docs, settings, billing)
- Server Components do data fetching directly via Prisma-backed service functions; there is no global client state library (no Redux/Zustand) — do not introduce one
- Forms use react-hook-form + zod (@hookform/resolvers) — preserve this pattern for any form you touch or add
- shadcn/ui primitives already installed: button, card, dialog, dropdown-menu, form, input, label, select, separator, sheet, skeleton, sonner, table, tabs, accordion, avatar. Add badge and tooltip via `npx shadcn add badge tooltip` if needed — don't hand-roll equivalents.
- framer-motion is already a dependency, currently used only on /login and /signup
- GSAP + ScrollTrigger are NOT installed. You will need to add them (npm install gsap) — this is new, not a refactor.

DESIGN SYSTEM (do this first, before any page)
1. In src/app/globals.css, replace the default shadcn OKLCH token values with a deliberate set: keep the existing blue-600/emerald-500 brand identity (it's already used across the marketing site, login, and sidebar — don't change the brand colors), but define a real type scale (distinct sizes/weights for display, h1–h3, body, caption), a consistent spacing rhythm, and a restrained shadow/radius scale. Do not touch the --color-* variable NAMES (other components reference them) — only their values.
2. Add one display/heading font paired with the existing Inter body font. Wire it through next/font in src/app/layout.tsx.
3. Use the existing /login page as your visual reference point for "premium" — glass cards, gradient orbs, staggered field motion. The rest of the app should feel like a calmer, more functional sibling of that page, not a different product.

DESIGN QUALITY BAR
The person commissioning this work wants the best humanly possible design — treat "competent SaaS redesign" as the floor, not the target. Concretely, that means:
- No screen should look like it came from a template gallery. Every page needs at least one deliberate, specific design decision that couldn't be copy-pasted onto a different SaaS product (a distinctive chart treatment, an unexpected but purposeful layout break, a signature micro-interaction).
- Hierarchy must be real, not just implied by font-weight. On the dashboard, for example, the 5 stat cards currently render with identical visual weight — decide which 1-2 metrics actually matter most per page and let them dominate; demote the rest.
- Empty states, loading states, and error states get the same design attention as the "happy path" — a half-designed empty state is a half-designed page.
- Every animation must justify its own existence: it should clarify state change, draw the eye somewhere useful, or reinforce brand feel. Decoration for its own sake gets cut.
- When in doubt between "safe and competent" and "distinctive but slightly riskier," choose distinctive, then come back and ask if it's too far.

RESPONSIVENESS — NON-NEGOTIABLE, NOT AN AFTERTHOUGHT
Responsiveness is a primary design constraint from the first mockup, not a pass applied after desktop is "done." For every page you touch:
- Design and verify at minimum these widths: 360px (small phone), 768px (tablet/iPad portrait), 1024px (small laptop), 1440px (standard desktop), 1920px+ (ultrawide/large monitor). Don't just shrink the desktop layout — re-think layout, density, and what's visible at each tier.
- Zero horizontal overflow/scroll at any width, on any page, ever. This includes tables (Top Pages, breakdown lists) and code blocks (docs page) — they need their own mobile strategy (horizontal scroll *within* the component is fine; the page itself must never scroll horizontally).
- Touch targets on mobile/tablet are real touch targets (minimum ~44px), not desktop-sized buttons that happen to be tappable.
- Typography scales fluidly across breakpoints (e.g. clamp()-based sizing for display/heading text), not just 2-3 fixed breakpoint jumps.
- The existing mobile Sheet-drawer sidebar pattern is correct — extend that quality bar to every other piece of dashboard chrome (date range selector, website selector, tabs) rather than letting them silently degrade on small screens.
- On ultrawide (1920px+), content must not just stretch to fill space — set sensible max-widths and use the extra room deliberately (e.g. richer side-by-side layouts), the way Linear/Vercel dashboards do.
- After each phase, actually resize to each of the five widths above and look — don't reason about responsiveness only in the abstract.

OPEN ARCHITECTURE QUESTION — THE PERSON DOESN'T KNOW THE ANSWER EITHER
The person commissioning this has confirmed they don't have a preference on whether /dashboard and /websites/[id] should share components, given how structurally similar they are. Use your own best architectural judgment when you reach Phase 4, but still surface your reasoning and proposed approach before implementing it — don't go silent and just pick one. State the decision clearly enough that it can be reversed if it turns out wrong.

MOTION ARCHITECTURE
- framer-motion: hover/tap states, layout transitions, modal/dialog transitions, staggered list reveals — use throughout the authenticated app (dashboard, websites, settings, billing)
- GSAP + ScrollTrigger: marketing pages ONLY (/, /pricing) — hero entrance, scroll-triggered feature reveals, parallax. Do not add GSAP to authenticated dashboard pages; framer-motion alone is sufficient there and keeps bundle size down for logged-in users who don't need scroll storytelling.
- All animation must degrade gracefully — respect prefers-reduced-motion.

IMPLEMENTATION PHASES (work through these in order; do not skip ahead)

Phase 0 — Design tokens (src/app/globals.css, font setup). No page changes yet. Verify the app still renders correctly with old markup + new tokens before proceeding.

Phase 1 — LOW RISK pages first (build confidence and reusable patterns):
  - Marketing landing (/) and /pricing — add GSAP scroll storytelling here
  - /privacy, /terms, /refund-policy
  - /docs

Phase 2 — MEDIUM RISK:
  - /login, /signup — refine, don't rebuild; these are already close to the target aesthetic. Preserve the exact onSubmit / signIn / fetch logic; only change markup and classes. Fix the dead "Forgot Password?" href="#" by flagging it to me rather than inventing a destination.
  - /billing — restyle the "Coming Soon" section and plan cards. Keep Upgrade buttons visually present and clearly non-functional; do not add any loading/success states that imply they work.

Phase 3 — MEDIUM-HIGH RISK:
  - /websites (list page) — add per-site usage context (e.g. badges), refine WebsiteCard, preserve the create (POST /api/websites) and delete (DELETE /api/websites/[id]) flows exactly as-is, including their toasts.

Phase 4 — HIGH RISK (request explicit approval before starting each of these):
  - /settings — preserve all three mutations (PATCH /api/user, PATCH /api/user/password, DELETE /api/user) exactly; strengthen the Danger Zone's confirmation UX (e.g. type-to-confirm) and ask me to approve the specific confirmation pattern before implementing it.
  - /dashboard — extract the inline MetricsCard and BreakdownList helper components (currently defined at the bottom of src/app/(dashboard)/dashboard/page.tsx) into src/features/analytics/components/, preserving their exact prop contracts, before restyling. Do not change the Promise.all data-fetching structure or the searchParams (siteId, range) contract.
  - /websites/[id] and /websites/[id]/settings — before restyling, decide for yourself (using the OPEN ARCHITECTURE QUESTION guidance above) whether this page should share components with /dashboard or remain independent. State your reasoning and decision clearly before implementing, but don't block waiting for a reply.

WORKING STYLE
- Work incrementally, one phase at a time. After each phase, summarize exactly what changed and run through the relevant items in the manual regression checklist above.
- Never batch multiple HIGH RISK pages into one pass.
- If you're about to touch anything in the NON-NEGOTIABLE BOUNDARIES list, stop and ask first — do not proceed and explain afterward.
- If a visual idea from the design strategy conflicts with a constraint above, tell me the conflict and ask which one wins. Don't silently pick one.
- Match the existing code style (the codebase favors typed function signatures, named exports, and feature-folder organization under src/features/<domain>/components|services) — don't introduce a different file organization convention partway through.
```

---

# Autonomous Reconstruction Loop

For every page and feature:

Step 1:
Analyze existing implementation.

Step 2:
Identify:

* UI issues
* UX issues
* responsiveness issues
* accessibility issues
* duplicated code

Step 3:
Create or reuse shared components.

Step 4:
Implement premium UI improvements.

Step 5:
Add animations and interactions.

Step 6:
Verify:

* no TypeScript errors
* no console errors
* no backend breakage
* no API changes
* responsive behavior

Step 7:
Refactor duplicated code.

Step 8:
Run a final polish pass.

Step 9:
Continue automatically to the next page.

Repeat until the entire frontend reconstruction is complete.
Execution Mode

The agent should work autonomously.

Do not stop for approval between phases.

Proceed continuously while respecting all backend safety constraints.

The backend is considered stable and production-ready.

Frontend reconstruction should continue until all pages have been modernized.