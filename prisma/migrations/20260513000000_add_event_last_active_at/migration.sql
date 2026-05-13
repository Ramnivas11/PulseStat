-- Add an optional activity timestamp for realtime visitor windows.
-- This is nullable to keep the migration backward compatible with existing events.
ALTER TABLE "Event" ADD COLUMN "lastActiveAt" TIMESTAMP(3);

-- Supports realtime queries scoped by website and recent activity window.
CREATE INDEX "Event_websiteId_lastActiveAt_idx" ON "Event"("websiteId", "lastActiveAt");
