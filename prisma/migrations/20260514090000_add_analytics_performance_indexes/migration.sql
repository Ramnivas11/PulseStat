-- Improve tenant lookup, dashboard range filters, and realtime analytics query performance.
CREATE INDEX IF NOT EXISTS "User_createdAt_idx" ON "User"("createdAt");
CREATE INDEX IF NOT EXISTS "Website_userId_idx" ON "Website"("userId");
CREATE INDEX IF NOT EXISTS "Website_domain_idx" ON "Website"("domain");
CREATE INDEX IF NOT EXISTS "Website_createdAt_idx" ON "Website"("createdAt");
CREATE INDEX IF NOT EXISTS "Event_websiteId_createdAt_idx" ON "Event"("websiteId", "createdAt");
CREATE INDEX IF NOT EXISTS "Event_websiteId_createdAt_visitorId_idx" ON "Event"("websiteId", "createdAt", "visitorId");
CREATE INDEX IF NOT EXISTS "Event_websiteId_createdAt_sessionId_idx" ON "Event"("websiteId", "createdAt", "sessionId");
CREATE INDEX IF NOT EXISTS "Event_websiteId_path_createdAt_idx" ON "Event"("websiteId", "path", "createdAt");
CREATE INDEX IF NOT EXISTS "Event_websiteId_browser_createdAt_idx" ON "Event"("websiteId", "browser", "createdAt");
CREATE INDEX IF NOT EXISTS "Event_websiteId_device_createdAt_idx" ON "Event"("websiteId", "device", "createdAt");
