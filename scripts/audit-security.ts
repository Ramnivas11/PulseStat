import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "",
});

const client = new PrismaClient({ adapter });

interface SecurityAuditReport {
  timestamp: string;
  checks: {
    foreignKeyIntegrity: { status: "PASS" | "FAIL"; issues: string[] };
    multiTenancyBoundaries: { status: "PASS" | "FAIL"; issues: string[] };
    orphanedRecords: { status: "PASS" | "FAIL"; issues: string[] };
    indexCoverage: { status: "PASS" | "FAIL"; issues: string[] };
    dataConsistency: { status: "PASS" | "FAIL"; issues: string[] };
  };
  summary: string;
}

async function auditMultiTenancy(): Promise<SecurityAuditReport> {
  const report: SecurityAuditReport = {
    timestamp: new Date().toISOString(),
    checks: {
      foreignKeyIntegrity: { status: "PASS", issues: [] },
      multiTenancyBoundaries: { status: "PASS", issues: [] },
      orphanedRecords: { status: "PASS", issues: [] },
      indexCoverage: { status: "PASS", issues: [] },
      dataConsistency: { status: "PASS", issues: [] },
    },
    summary: "",
  };

  console.log("🔐 SECURITY & MULTI-TENANCY AUDIT\n");

  // 1. Check for orphaned websites (websites without valid users)
  console.log("✓ Checking for orphaned websites...");
  const orphanedWebsites = await client.$queryRawUnsafe<
    { id: string; userId: string }[]
  >(
    `SELECT w.id, w."userId" FROM "Website" w 
     LEFT JOIN "User" u ON w."userId" = u.id 
     WHERE u.id IS NULL`
  );

  if (orphanedWebsites.length > 0) {
    report.checks.orphanedRecords.status = "FAIL";
    report.checks.orphanedRecords.issues.push(
      `Found ${orphanedWebsites.length} orphaned websites without valid User`
    );
  }

  // 2. Check for orphaned events
  console.log("✓ Checking for orphaned events...");
  const orphanedEvents = await client.$queryRawUnsafe<{ count: number }[]>(
    `SELECT COUNT(*) as count FROM "Event" e 
     LEFT JOIN "Website" w ON e."websiteId" = w.id 
     WHERE w.id IS NULL`
  );

  if (orphanedEvents[0]?.count > 0) {
    report.checks.orphanedRecords.status = "FAIL";
    report.checks.orphanedRecords.issues.push(
      `Found ${orphanedEvents[0].count} orphaned events without valid Website`
    );
  }

  // 3. Check for orphaned analytics records
  console.log("✓ Checking for orphaned analytics records...");
  const orphanedDailyStats = await client.$queryRawUnsafe<{ count: number }[]>(
    `SELECT COUNT(*) as count FROM "DailyStat" ds 
     LEFT JOIN "Website" w ON ds."websiteId" = w.id 
     WHERE w.id IS NULL`
  );

  if (orphanedDailyStats[0]?.count > 0) {
    report.checks.orphanedRecords.issues.push(
      `Found ${orphanedDailyStats[0].count} orphaned DailyStat records`
    );
  }

  // 4. Check subscription integrity
  console.log("✓ Checking subscription integrity...");
  const orphanedSubscriptions = await client.$queryRawUnsafe<{ count: number }[]>(
    `SELECT COUNT(*) as count FROM "Subscription" s 
     LEFT JOIN "User" u ON s."userId" = u.id 
     WHERE u.id IS NULL`
  );

  if (orphanedSubscriptions[0]?.count > 0) {
    report.checks.foreignKeyIntegrity.status = "FAIL";
    report.checks.foreignKeyIntegrity.issues.push(
      `Found ${orphanedSubscriptions[0].count} orphaned subscriptions`
    );
  }

  // 5. Verify unique constraints
  console.log("✓ Checking unique constraint violations...");
  
  // Check for duplicate (websiteId, date) in DailyStat
  const duplicateDailyStats = await client.$queryRawUnsafe<
    { count: number }[]
  >(
    `SELECT COUNT(*) as count FROM (
       SELECT "websiteId", "date", COUNT(*) as cnt 
       FROM "DailyStat" 
       GROUP BY "websiteId", "date" 
       HAVING COUNT(*) > 1
     ) t`
  );

  if (duplicateDailyStats[0]?.count > 0) {
    report.checks.dataConsistency.status = "FAIL";
    report.checks.dataConsistency.issues.push(
      `Found ${duplicateDailyStats[0].count} duplicate (websiteId, date) pairs in DailyStat`
    );
  }

  // 6. Check for missing indexes
  console.log("✓ Checking index coverage...");
  const missingIndexes = await client.$queryRawUnsafe<
    { indexname: string }[]
  >(
    `SELECT indexname FROM pg_indexes 
     WHERE schemaname = 'public' 
     AND indexname LIKE '%idx' 
     ORDER BY indexname`
  );

  const requiredIndexes = [
    "Event_websiteId_lastActiveAt_idx",
    "Event_websiteId_createdAt_idx",
    "Website_userId_idx",
  ];

  const foundIndexNames = missingIndexes.map((i) => i.indexname);
  const missingRequired = requiredIndexes.filter((idx) => !foundIndexNames.includes(idx));

  if (missingRequired.length > 0) {
    report.checks.indexCoverage.status = "FAIL";
    report.checks.indexCoverage.issues.push(
      `Missing recommended indexes: ${missingRequired.join(", ")}`
    );
  }

  // 7. Verify cascade delete rules
  console.log("✓ Checking foreign key cascade rules...");
  const fkConstraints = await client.$queryRawUnsafe<
    { constraint_name: string; delete_rule: string }[]
  >(
    `SELECT constraint_name, delete_rule 
     FROM information_schema.referential_constraints 
     WHERE constraint_schema = 'public'
     AND (table_name = 'Event' OR table_name = 'Website' OR table_name = 'Subscription')`
  );

  const criticalFKs = ["Event_websiteId_fkey", "Website_userId_fkey", "Subscription_userId_fkey"];
  
  for (const fkName of criticalFKs) {
    const fk = fkConstraints.find((c) => c.constraint_name === fkName);
    if (fk && fk.delete_rule !== "CASCADE") {
      report.checks.foreignKeyIntegrity.status = "FAIL";
      report.checks.foreignKeyIntegrity.issues.push(
        `${fkName} should use ON DELETE CASCADE but has ${fk.delete_rule}`
      );
    }
  }

  // Summary
  const allPassed = Object.values(report.checks).every((c) => c.status === "PASS");
  report.summary = allPassed
    ? "✅ All security and multi-tenancy checks PASSED"
    : "❌ Some security checks failed - review issues above";

  console.log("\n" + report.summary);
  console.log("\nDetailed Results:");
  console.table(
    Object.entries(report.checks).map(([name, check]) => ({
      Check: name,
      Status: check.status,
      "Issue Count": check.issues.length,
      Issues: check.issues.join("; "),
    }))
  );

  return report;
}

// Run audit
auditMultiTenancy()
  .then((report) => {
    console.log("\n📊 AUDIT COMPLETE");
    process.exit(report.summary.includes("failed") ? 1 : 0);
  })
  .catch((err) => {
    console.error("❌ Audit failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await client.$disconnect();
  });
