-- Add missing analytics fields to Event table (Umami parity)

ALTER TABLE "Event"
  ADD COLUMN IF NOT EXISTS "visitId"       TEXT,
  ADD COLUMN IF NOT EXISTS "eventName"     TEXT,
  ADD COLUMN IF NOT EXISTS "hostname"      TEXT,
  ADD COLUMN IF NOT EXISTS "urlQuery"      TEXT,
  ADD COLUMN IF NOT EXISTS "referrerDomain" TEXT,
  ADD COLUMN IF NOT EXISTS "pageTitle"     TEXT,
  ADD COLUMN IF NOT EXISTS "os"            TEXT,
  ADD COLUMN IF NOT EXISTS "utmSource"     TEXT,
  ADD COLUMN IF NOT EXISTS "utmMedium"     TEXT,
  ADD COLUMN IF NOT EXISTS "utmCampaign"   TEXT,
  ADD COLUMN IF NOT EXISTS "utmContent"    TEXT,
  ADD COLUMN IF NOT EXISTS "utmTerm"       TEXT;

-- Add bounces counter to DailyStat
ALTER TABLE "DailyStat"
  ADD COLUMN IF NOT EXISTS "bounces" INTEGER NOT NULL DEFAULT 0;

-- New indexes for analytics queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Event_websiteId_os_createdAt_idx"
  ON "Event"("websiteId", "os", "createdAt");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "Event_websiteId_country_createdAt_idx"
  ON "Event"("websiteId", "country", "createdAt");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "Event_websiteId_referrerDomain_createdAt_idx"
  ON "Event"("websiteId", "referrerDomain", "createdAt");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "Event_websiteId_utmSource_createdAt_idx"
  ON "Event"("websiteId", "utmSource", "createdAt");
