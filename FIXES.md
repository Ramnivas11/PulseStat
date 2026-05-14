# PulseStat — Fixes Applied

## 🔴 Critical Security Fixes

### 1. Removed unauthenticated `/api/test` endpoint
**File:** `src/app/api/test/route.ts`  
Exposed ALL users' websites with zero authentication. Now returns 404.

### 2. Fixed signup route — no longer returns hashed password
**File:** `src/app/api/signup/route.ts`  
Previously returned the full user DB row including the bcrypt hash. Now returns only `{ success: true }`. Also added proper Zod validation before hitting the database.

### 3. Added session `maxAge` to Auth.js config
**File:** `src/lib/auth.config.ts`  
Sessions were immortal by default. Now expire after 30 days and re-issue every 24 hours. Added `authorized` callback so middleware correctly redirects unauthenticated users.

### 4. Removed `unsafe-eval` from production CSP
**File:** `src/middleware/securityHeaders.ts`  
`unsafe-eval` was included in all environments. Now only in dev (needed for HMR). Added `upgrade-insecure-requests` and `X-DNS-Prefetch-Control`.

### 5. Added `/docs` to middleware protected routes matcher
**File:** `src/middleware.ts`  
The `/docs` route (under dashboard layout) was missing from the middleware matcher, making it publicly accessible without auth.

### 6. Logger no longer leaks stack traces in production
**File:** `src/lib/logger.ts`  
Error stack traces and detailed context are now only logged in development.

---

## 🟠 Bug Fixes

### 7. Fixed daily visitor/session counting — was always 0 or 1
**File:** `src/features/analytics/services/analytics.service.ts`  
`processTrackEvent` was creating DailyStat with visitors=1 on create but never incrementing on update. Also, all events were counted as new visitors. Now correctly checks if the visitorId/sessionId already exists today before incrementing, within the same transaction.

### 8. Fixed double Footer on marketing pages
**File:** `src/app/layout.tsx`  
Root layout was rendering `<Footer />` AND marketing pages were rendering their own footer. Removed from root layout.

### 9. Fixed realtime card description mismatch
**File:** `src/features/realtime/components/realtime-card.tsx`  
Said "Last 30 seconds" but backend uses a 5-minute window. Fixed to "Last 5 minutes".

### 10. Fixed missing CORS headers on 404 response in `/api/track`
**File:** `src/app/api/track/route.ts`  
Missing `corsHeaders` on the "Invalid configuration" 404 caused browser CORS errors when siteKey was wrong. Also added a 8KB payload size guard.

### 11. Fixed active link detection in Sidebar
**File:** `src/components/layout/sidebar.tsx`  
Was using `pathname === item.href` — would not highlight sub-routes. Changed to `startsWith`.

### 12. Fixed Settings page — was literally `<div>Page</div>`
**Files:** `src/app/(dashboard)/settings/page.tsx` + new settings feature components  
Built a full settings page with profile name update, email display, and danger zone.

### 13. Removed BOM character from billing page
**File:** `src/app/(dashboard)/billing/page.tsx`  
A UTF-8 BOM (`\xef\xbb\xbf`) at the top of the file could cause parse issues.

### 14. Fixed websites/API routes to use `session.user.id` directly
**Files:** `src/app/api/websites/route.ts`, `src/app/api/websites/[id]/route.ts`  
Were doing an extra `prisma.user.findUnique` by email. Session already has `user.id` — used directly.

---

## 🔵 Improvements

### 15. Domain validation — proper regex
**File:** `src/validations/website.ts`  
Was just `min(3)`. Now validates actual domain format with RFC-compliant regex.

### 16. Track event validation tightened
**File:** `src/validations/track-event.ts`  
`visitorId` and `sessionId` now validated as UUIDs. `siteId` validated against `site_` prefix format. `path` must start with `/`.

### 17. Create website form — rebuilt with shadcn components
**File:** `src/features/websites/components/create-website-form.tsx`  
Was using raw `<input>` and `<button>`. Rebuilt with `Form`, `FormField`, `Input`, `Button` from shadcn. Uses `router.refresh()` instead of `window.location.reload()`.

### 18. Website card — added delete with confirmation dialog
**File:** `src/features/websites/components/website-card.tsx`  
Added hover-revealed delete button with a confirmation dialog. Fixed copy buttons with toast feedback.

### 19. Website selector — shows current site even with 1 site
**File:** `src/features/websites/components/website-selector.tsx`  
Was hidden when only 1 website. Now shows a readable non-interactive badge for single sites.

### 20. Stats card — added optional icon + description props
**File:** `src/features/analytics/components/stats-card.tsx`

### 21. Traffic chart — added visitors line, better tooltips, proper date labels
**File:** `src/features/analytics/components/pageviews-chart.tsx`

### 22. Docs page — dynamic tracker URL + pre-filled site key
**File:** `src/app/(dashboard)/docs/page.tsx`  
Was hardcoded to `pulsestat.ramnivas.in`. Now reads from `siteConfig.url` and pre-fills the user's actual site key.

### 23. Dashboard layout — cleaner responsive flex layout
**File:** `src/app/(dashboard)/layout.tsx`

### 24. Navbar — settings link in user dropdown, cleaner mobile layout
**File:** `src/components/layout/navbar.tsx`

### 25. Usage overview — proper loading skeletons, error handling
**File:** `src/features/billing/components/usage-overview.tsx`

### 26. Dashboard loading.tsx — proper skeleton layout
**File:** `src/app/(dashboard)/dashboard/loading.tsx`

### 27. Tracker SDK improvements
**File:** `src/tracker/tracker.ts`, `public/tracker.js`  
- Shorter localStorage keys (`_ps_vid`, `_ps_sid`)
- Sends `application/json` content type (was `text/plain`, harder to parse)
- Trailing slash normalization on paths
- Safe `bind()` calls on history methods
- Silent fail on beacon errors (no console.warn)

### 28. Created `/api/user` PATCH endpoint
**File:** `src/app/api/user/route.ts`  
For the settings page to update display name.

### 29. Footer broken links fixed
**File:** `src/features/marketing/components/footer.tsx`  
Removed links to non-existent `/contact`, `/changelog`, `/dpa` routes.

### 30. `tsup.config.ts` and `build:tracker` script
Now properly configured to rebuild `public/tracker.js` as part of every production build.
