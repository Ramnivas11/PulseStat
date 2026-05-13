import { auth } from "@/lib/auth";
import { razorpay } from "@/lib/razorpay";
import { getPlan, type PlanKey } from "@/config/plans";
import {
  createPendingSubscription,
  getCurrentSubscription,
} from "@/features/billing/services/billing.service";
import { successResponse, errorResponse, apiErrorHandler } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const planKey = body?.planKey as PlanKey | undefined;

    if (!planKey) {
      return errorResponse("Missing billing plan.", 400);
    }

    const plan = getPlan(planKey);

    if (!plan || plan.price <= 0) {
      return errorResponse("Invalid billing plan.", 400);
    }

    const currentSubscription = await getCurrentSubscription(session.user.id);

    if (currentSubscription?.plan === planKey && currentSubscription.status === "active") {
      return errorResponse("You already have this plan active.", 400);
    }

    const order = await razorpay.orders.create({
      amount: plan.price * 100,
      currency: plan.currency,
      receipt: `rcpt_${session.user.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        userId: session.user.id,
        plan: planKey,
      },
    });

    await createPendingSubscription({
      userId: session.user.id,
      plan: planKey,
      amount: plan.price * 100,
      currency: plan.currency,
    });

    return successResponse({
      order,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    // Preserve original error handling for API response
    return apiErrorHandler(error, "POST /api/billing/checkout");
  }
}
