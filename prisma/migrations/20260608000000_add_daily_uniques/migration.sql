-- Phase 1: Create new daily tracking tables for atomic visitor/session aggregation
CREATE TABLE IF NOT EXISTS "DailyVisitor" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "visitorId" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,

    CONSTRAINT "DailyVisitor_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "DailySession" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "sessionId" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,

    CONSTRAINT "DailySession_pkey" PRIMARY KEY ("id")
);

-- Phase 2: Create indexes for query performance
CREATE INDEX IF NOT EXISTS "DailyVisitor_websiteId_idx" ON "DailyVisitor"("websiteId");
CREATE INDEX IF NOT EXISTS "DailyVisitor_date_idx" ON "DailyVisitor"("date");
CREATE UNIQUE INDEX IF NOT EXISTS "DailyVisitor_websiteId_date_visitorId_key" ON "DailyVisitor"("websiteId", "date", "visitorId");

CREATE INDEX IF NOT EXISTS "DailySession_websiteId_idx" ON "DailySession"("websiteId");
CREATE INDEX IF NOT EXISTS "DailySession_date_idx" ON "DailySession"("date");
CREATE UNIQUE INDEX IF NOT EXISTS "DailySession_websiteId_date_sessionId_key" ON "DailySession"("websiteId", "date", "sessionId");

-- Phase 3: Update foreign key constraints to use CASCADE delete
-- First, drop old constraints (they must be dropped before re-adding with different rules)
DO $$ 
BEGIN
    -- Drop Event FK if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Event_websiteId_fkey' 
        AND table_name = 'Event'
    ) THEN
        ALTER TABLE "Event" DROP CONSTRAINT "Event_websiteId_fkey";
    END IF;
    
    -- Drop DailyStat FK if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'DailyStat_websiteId_fkey' 
        AND table_name = 'DailyStat'
    ) THEN
        ALTER TABLE "DailyStat" DROP CONSTRAINT "DailyStat_websiteId_fkey";
    END IF;
    
    -- Drop PageStat FK if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'PageStat_websiteId_fkey' 
        AND table_name = 'PageStat'
    ) THEN
        ALTER TABLE "PageStat" DROP CONSTRAINT "PageStat_websiteId_fkey";
    END IF;
END $$;

-- Re-add constraints with CASCADE delete
ALTER TABLE "Event" ADD CONSTRAINT "Event_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DailyStat" ADD CONSTRAINT "DailyStat_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PageStat" ADD CONSTRAINT "PageStat_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Phase 4: Add constraints to new tables
ALTER TABLE "DailyVisitor" ADD CONSTRAINT "DailyVisitor_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DailySession" ADD CONSTRAINT "DailySession_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
