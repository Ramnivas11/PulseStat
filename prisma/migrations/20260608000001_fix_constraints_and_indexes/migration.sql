-- PHASE 1: Add missing cascade delete rules on relationships
-- This ensures data integrity when users are deleted

-- Fix Website -> User relationship (should cascade)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Website_userId_fkey' 
        AND table_name = 'Website'
    ) THEN
        ALTER TABLE "Website" DROP CONSTRAINT "Website_userId_fkey";
    END IF;
END $$;

ALTER TABLE "Website" ADD CONSTRAINT "Website_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Fix Subscription -> User relationship (should cascade)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Subscription_userId_fkey' 
        AND table_name = 'Subscription'
    ) THEN
        ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";
    END IF;
END $$;

ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- PHASE 2: Add indexes for better query performance
-- Index for common "get websites for user" queries
CREATE INDEX IF NOT EXISTS "Website_userId_idx" ON "Website"("userId");

-- Composite index for Event filtering by website and visitor
-- This helps with "get all events for visitor on website" queries
CREATE INDEX IF NOT EXISTS "Event_websiteId_visitorId_idx" ON "Event"("websiteId", "visitorId");

-- Composite index for Event filtering by website and session
-- This helps with "get all events for session on website" queries
CREATE INDEX IF NOT EXISTS "Event_websiteId_sessionId_idx" ON "Event"("websiteId", "sessionId");

-- Index for DailyStat lookups by date range
CREATE INDEX IF NOT EXISTS "DailyStat_websiteId_date_idx" ON "DailyStat"("websiteId", "date" DESC);

-- Index for DailyVisitor queries by date range
CREATE INDEX IF NOT EXISTS "DailyVisitor_websiteId_date_idx" ON "DailyVisitor"("websiteId", "date" DESC);

-- Index for DailySession queries by date range
CREATE INDEX IF NOT EXISTS "DailySession_websiteId_date_idx" ON "DailySession"("websiteId", "date" DESC);

-- Index for PageStat queries (commonly sorted by views DESC)
CREATE INDEX IF NOT EXISTS "PageStat_websiteId_views_idx" ON "PageStat"("websiteId", "views" DESC);

-- PHASE 3: Add check constraints for data integrity
-- Ensure Event eventType is not null or empty
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventType_not_empty" 
CHECK ("eventType" != '');

-- Ensure DailyStat counters are non-negative
ALTER TABLE "DailyStat" ADD CONSTRAINT "DailyStat_positive_counters" 
CHECK ("pageviews" >= 0 AND "visitors" >= 0 AND "sessions" >= 0);

-- Ensure PageStat views is non-negative
ALTER TABLE "PageStat" ADD CONSTRAINT "PageStat_positive_views" 
CHECK ("views" >= 0);

-- PHASE 4: Verify foreign key integrity
-- This is a documentation comment for safety check:
-- All Event rows should have valid websiteId references
-- All DailyStat rows should have valid websiteId references
-- All PageStat rows should have valid websiteId references
-- All DailyVisitor rows should have valid websiteId references
-- All DailySession rows should have valid websiteId references
-- All Website rows should have valid userId references
-- All Subscription rows should have valid userId references
