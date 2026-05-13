import { prisma } from "@/lib/prisma";
import { PLANS, type PlanKey } from "@/config/plans";
import crypto from "crypto";

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

// ---------------------------------------------------------------------------
// Subscription lifecycle
// ---------------------------------------------------------------------------

export async function createPendingSubscription(data: {
  userId: string;
  plan: BillingPlan;
  amount: number;
  currency: string;
}) {
  return prisma.subscription.upsert({
    where: { userId: data.userId },
    create: {
      userId: data.userId,
      plan: data.plan,
      status: "pending",
    },
    update: {
      plan: data.plan,
      status: "pending",
    },
  });
}

export function verifyWebhookSignature(
  payload: string,
  signature: string
) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error(
      "Missing Razorpay webhook secret. Set RAZORPAY_WEBHOOK_SECRET."
    );
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return expected === signature;
}

export function verifyCheckoutSignature(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    throw new Error(
      "Missing Razorpay key secret. Set RAZORPAY_KEY_SECRET."
    );
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(
      `${payload.razorpay_order_id}|${payload.razorpay_payment_id}`
    )
    .digest("hex");

  return generatedSignature === payload.razorpay_signature;
}

export async function activatePendingSubscription(
  userId: string
) {
  const pendingSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "pending",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!pendingSubscription) {
    return null;
  }

  // Set period end to 30 days from now
  const currentPeriodEnd = new Date();
  currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

  return prisma.subscription.update({
    where: {
      id: pendingSubscription.id,
    },
    data: {
      status: "active",
      currentPeriodEnd,
    },
  });
}

export async function handleRazorpayWebhook(
  payload: Record<string, unknown>
) {
  const event = payload.event as string;
  const paymentEntity = (payload.payload as Record<string, unknown>)?.payment as
    | { entity: Record<string, unknown> }
    | undefined;

  const entity = paymentEntity?.entity;
  if (!entity) {
    return null;
  }

  const notes = entity.notes as Record<string, unknown> | undefined;
  const userId = notes?.userId as string | undefined;

  if (!userId) {
    return null;
  }

  if (event === "payment.captured" || event === "payment.authorized") {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "pending",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!subscription) {
      return null;
    }

    // Set period end to 30 days from now
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

    return prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        status: "active",
        razorpayPaymentId: entity.id as string,
        razorpayOrderId: entity.order_id as string,
        currentPeriodEnd,
      },
    });
  }

  return null;
}
