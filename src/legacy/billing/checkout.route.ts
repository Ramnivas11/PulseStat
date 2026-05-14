// Legacy billing route: disabled while subscription checkout is temporarily paused.
// TODO: Restore this logic when Paddle checkout is enabled again.

import { auth } from "@/lib/auth";
import { getPlan, type PlanKey } from "@/config/plans";
import { createCheckoutSession } from "./paddle.service";
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

    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      planKey,
    });

    return successResponse({
      checkoutUrl: checkoutSession.checkout.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return apiErrorHandler(error, "POST /api/billing/checkout");
  }
}
