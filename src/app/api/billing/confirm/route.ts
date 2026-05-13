import { auth } from "@/lib/auth";
import {
  activatePendingSubscription,
  verifyCheckoutSignature,
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
    const razorpayOrderId = body?.razorpay_order_id as string;
    const razorpayPaymentId = body?.razorpay_payment_id as string;
    const razorpaySignature = body?.razorpay_signature as string;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return errorResponse("Missing Razorpay payment confirmation data.", 400);
    }

    if (
      !verifyCheckoutSignature({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      })
    ) {
      return errorResponse("Invalid Razorpay signature.", 400);
    }

    const subscription = await activatePendingSubscription(session.user.id);

    if (!subscription) {
      return errorResponse("No pending subscription found for this user.", 404);
    }

    return successResponse({ confirmed: true });
  } catch (error) {
    return apiErrorHandler(error, "POST /api/billing/confirm");
  }
}
