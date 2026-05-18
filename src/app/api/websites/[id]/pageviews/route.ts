import { auth } from "@/lib/auth";
import { errorResponse, successResponse, apiErrorHandler } from "@/lib/api-helpers";
import { getDailyStats } from "@/features/analytics/services/analytics.service";
import { getAnalyticsDateRange, normalizeAnalyticsRange } from "@/features/analytics/services/date-range";
import { getWebsiteByIdForUser } from "@/features/websites/services/website.service";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse("Unauthorized", 401);

    const { id } = await context.params;
    const website = await getWebsiteByIdForUser(id, session.user.id);
    if (!website) return errorResponse("Website not found", 404);

    const url = new URL(req.url);
    const range = normalizeAnalyticsRange(url.searchParams.get("range") ?? undefined);
    const { startDate, endDate } = getAnalyticsDateRange(range);

    const series = await getDailyStats(id, startDate, endDate);
    return successResponse(series);
  } catch (error) {
    return apiErrorHandler(error, "GET /api/websites/[id]/pageviews");
  }
}
