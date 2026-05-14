import { prisma } from "@/lib/prisma";
import { PLANS, type PlanKey } from "@/config/plans";

export type BillingPlan = "free" | "pro";
export type SubscriptionStatus = "pending" | "active" | "cancelled";

// ---------------------------------------------------------------------------
// Subscription queries
// ---------------------------------------------------------------------------

export async function getCurrentSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  return subscription;
}

/**
 * Resolve the effective plan for a user.
 * Returns "pro" only when an active, non-expired subscription exists.
 */
export async function getUserPlan(userId: string): Promise<PlanKey> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription || subscription.status !== "active") {
    return "free";
  }

  // Check if subscription has expired
  if (
    subscription.currentPeriodEnd &&
    subscription.currentPeriodEnd < new Date()
  ) {
    return "free";
  }

  return subscription.plan as PlanKey;
}

// ---------------------------------------------------------------------------
// Website limit enforcement
// ---------------------------------------------------------------------------

export interface WebsitePermission {
  allowed: boolean;
  currentCount: number;
  limit: number;
  plan: PlanKey;
}

export async function canCreateWebsite(
  userId: string
): Promise<WebsitePermission> {
  const [plan, websiteCount] = await Promise.all([
    getUserPlan(userId),
    prisma.website.count({ where: { userId } }),
  ]);

  const planConfig = PLANS[plan];

  return {
    allowed: websiteCount < planConfig.websiteLimit,
    currentCount: websiteCount,
    limit: planConfig.websiteLimit,
    plan,
  };
}

// ---------------------------------------------------------------------------
// Event usage tracking
// ---------------------------------------------------------------------------

/**
 * Count total pageviews for the current calendar month across all
 * websites belonging to a user. Uses DailyStat aggregates (indexed)
 * for performance — avoids scanning raw Event rows.
 */
export async function getMonthlyEventUsage(
  userId: string
): Promise<number> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const result = await prisma.dailyStat.aggregate({
    where: {
      website: { userId },
      date: { gte: monthStart },
    },
    _sum: { pageviews: true },
  });

  return result._sum.pageviews ?? 0;
}

// ---------------------------------------------------------------------------
// Event limit enforcement
// ---------------------------------------------------------------------------

export interface EventPermission {
  allowed: boolean;
  currentUsage: number;
  limit: number;
  plan: PlanKey;
}

export async function canTrackEvent(
  websiteId: string
): Promise<EventPermission> {
  // Resolve website → user in a single query
  const website = await prisma.website.findUnique({
    where: { id: websiteId },
    select: { userId: true },
  });

  if (!website) {
    return { allowed: false, currentUsage: 0, limit: 0, plan: "free" };
  }

  const [plan, currentUsage] = await Promise.all([
    getUserPlan(website.userId),
    getMonthlyEventUsage(website.userId),
  ]);

  const planConfig = PLANS[plan];

  return {
    allowed: currentUsage < planConfig.eventLimit,
    currentUsage,
    limit: planConfig.eventLimit,
    plan,
  };
}

// ---------------------------------------------------------------------------
// Usage summary (for dashboard / API)
// ---------------------------------------------------------------------------

export interface UsageSummary {
  plan: PlanKey;
  websites: { used: number; limit: number };
  events: { used: number; limit: number };
  subscription: {
    status: string;
    currentPeriodEnd: string | null;
  } | null;
}

export async function getUserUsageSummary(
  userId: string
): Promise<UsageSummary> {
  const [plan, websiteCount, eventUsage, subscription] =
    await Promise.all([
      getUserPlan(userId),
      prisma.website.count({ where: { userId } }),
      getMonthlyEventUsage(userId),
      getCurrentSubscription(userId),
    ]);

  const planConfig = PLANS[plan];

  return {
    plan,
    websites: {
      used: websiteCount,
      limit: planConfig.websiteLimit,
    },
    events: {
      used: eventUsage,
      limit: planConfig.eventLimit,
    },
    subscription: subscription
      ? {
          status: subscription.status,
          currentPeriodEnd:
            subscription.currentPeriodEnd?.toISOString() ?? null,
        }
      : null,
  };
}
