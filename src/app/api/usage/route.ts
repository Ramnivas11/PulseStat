import { auth } from "@/lib/auth";
import { errorResponse, successResponse, apiErrorHandler } from "@/lib/api-helpers";
import { getUserUsageSummary } from "@/features/billing/services/billing.service";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const usage = await getUserUsageSummary(session.user.id);
    return successResponse(usage);
  } catch (error) {
    return apiErrorHandler(error, "GET /api/usage");
  }
}
