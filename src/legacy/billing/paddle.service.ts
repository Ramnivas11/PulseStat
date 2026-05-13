import { prisma } from "@/lib/prisma";
import { PLANS, type PlanKey } from "@/config/plans";
import { paddleConfig, getPaddleApiUrl } from "./paddle.config";
import crypto from "crypto";

export type BillingPlan = "free" | "pro";
export type SubscriptionStatus = "pending" | "active" | "cancelled";

async function paddleApiRequest(endpoint: string, options: RequestInit = {}) {
  const url = getPaddleApiUrl(endpoint);
  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${paddleConfig.apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Paddle API error: ${response.status} ${error}`);
  }

  return response.json();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export interface CreateCheckoutSessionData {
  userId: string;
  planKey: PlanKey;
  successUrl?: string;
  cancelUrl?: string;
}

export async function createCheckoutSession(data: CreateCheckoutSessionData) {
  const { userId, planKey, successUrl, cancelUrl } = data;
  const plan = PLANS[planKey];

  if (!plan || plan.price <= 0) {
    throw new Error("Invalid billing plan");
  }

  const customer = await getOrCreatePaddleCustomer(userId);

  const checkoutData = {
    items: [
      {
        price_id: await getOrCreatePaddlePrice(planKey),
        quantity: 1,
      },
    ],
    customer_id: customer.id,
    success_url: successUrl || `${process.env.NEXTAUTH_URL}/billing?success=true`,
    cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/billing?canceled=true`,
    custom_data: {
      userId,
      planKey,
    },
  };

  const response = await paddleApiRequest("/transactions", {
    method: "POST",
    body: JSON.stringify(checkoutData),
  });

  return response.data;
}

async function getOrCreatePaddleCustomer(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (subscription?.paddleCustomerId) {
    try {
      const response = await paddleApiRequest(`/customers/${subscription.paddleCustomerId}`);
      return response.data;
    } catch {
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const response = await paddleApiRequest("/customers", {
    method: "POST",
    body: JSON.stringify({
      email: user.email,
      name: user.name || undefined,
    }),
  });

  const customer = response.data;

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId: userId,
      plan: "free",
      status: "active",
      paddleCustomerId: customer.id,
    },
    update: {
      paddleCustomerId: customer.id,
    },
  });

  return customer;
}

async function getOrCreatePaddlePrice(planKey: PlanKey): Promise<string> {
  const priceIds = {
    free: null,
    pro: "pri_01jtest1234567890abcdef",
  };

  const priceId = priceIds[planKey];
  if (!priceId) {
    throw new Error(`Price not configured for plan: ${planKey}`);
  }

  return priceId;
}

export async function getPaddleSubscription(subscriptionId: string) {
  const response = await paddleApiRequest(`/subscriptions/${subscriptionId}`);
  return response.data;
}

export async function cancelPaddleSubscription(subscriptionId: string) {
  const response = await paddleApiRequest(`/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
  });
  return response.data;
}

export function verifyPaddleWebhookSignature(payload: string, signature: string) {
  const secret = paddleConfig.webhookSecret;
  if (!secret) {
    throw new Error("Missing Paddle webhook secret");
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return expected === signature;
}

export async function handlePaddleWebhook(payload: Record<string, unknown>) {
  const eventType = payload.event_type as string;

  switch (eventType) {
    case "transaction.completed":
      return handleTransactionCompleted(payload);
    case "subscription.created":
      return handleSubscriptionCreated(payload);
    case "subscription.updated":
      return handleSubscriptionUpdated(payload);
    case "subscription.canceled":
      return handleSubscriptionCanceled(payload);
    default:
      console.log(`Unhandled Paddle webhook event: ${eventType}`);
      return null;
  }
}

async function handleTransactionCompleted(payload: Record<string, unknown>) {
  const data = isRecord(payload.data) ? payload.data : undefined;
  const customData = data && isRecord(data.custom_data) ? data.custom_data : undefined;

  if (!customData || typeof customData.userId !== "string" || typeof customData.planKey !== "string") {
    return null;
  }

  const userId = customData.userId;
  const planKey = customData.planKey as PlanKey;

  const currentPeriodEnd = new Date();
  currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);
  const paddleSubscriptionId =
    typeof data?.subscription_id === "string"
      ? data.subscription_id
      : undefined;

  return prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan: planKey,
      status: "active",
      currentPeriodEnd,
      paddleSubscriptionId,
    },
    update: {
      plan: planKey,
      status: "active",
      currentPeriodEnd,
      paddleSubscriptionId,
    },
  });
}

async function handleSubscriptionCreated(payload: Record<string, unknown>) {
  const data = isRecord(payload.data) ? payload.data : undefined;
  const customerId = typeof data?.customer_id === "string" ? data.customer_id : undefined;
  const subscriptionId = typeof data?.id === "string" ? data.id : undefined;

  const subscription = await prisma.subscription.findFirst({
    where: { paddleCustomerId: customerId },
  });

  if (!subscription || !subscriptionId) {
    return null;
  }

  return prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      paddleSubscriptionId: subscriptionId,
      status: "active",
    },
  });
}

async function handleSubscriptionUpdated(payload: Record<string, unknown>) {
  const data = isRecord(payload.data) ? payload.data : undefined;
  const subscriptionId = typeof data?.id === "string" ? data.id : undefined;
  const status = typeof data?.status === "string" && data.status === "active" ? "active" : "cancelled";
  const currentPeriodEnd = typeof data?.current_period_end === "string" ? new Date(data.current_period_end) : undefined;

  const subscription = await prisma.subscription.findFirst({
    where: { paddleSubscriptionId: subscriptionId },
  });

  if (!subscription) {
    return null;
  }

  return prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status,
      currentPeriodEnd,
    },
  });
}

async function handleSubscriptionCanceled(payload: Record<string, unknown>) {
  const data = isRecord(payload.data) ? payload.data : undefined;
  const subscriptionId = typeof data?.id === "string" ? data.id : undefined;

  const subscription = await prisma.subscription.findFirst({
    where: { paddleSubscriptionId: subscriptionId },
  });

  if (!subscription) {
    return null;
  }

  return prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: "cancelled",
    },
  });
}
