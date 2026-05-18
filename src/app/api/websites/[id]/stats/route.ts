import { auth } from "@/lib/auth";
import { errorResponse, successResponse, apiErrorHandler } from "@/lib/api-helpers";
import {
  getDashboardStats,
  getAvgSessionDuration,
} from "@/features/analytics/services/analytics.service";
import {
  getAnalyticsDateRange,
  normalizeAnalyticsRange,
} from "@/features/analytics/services/date-range";
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

    const [current, avgDuration] = await Promise.all([
      getDashboardStats(id, startDate, endDate),
      getAvgSessionDuration(id, startDate, endDate),
    ]);

    // Previous period for change comparison
    let previous = null;
    let prevAvgDuration = 0;
    if (startDate && endDate) {
      const duration = endDate.getTime() - startDate.getTime();
      const prevEnd = new Date(startDate.getTime() - 1);
      const prevStart = new Date(prevEnd.getTime() - duration);
      [previous, prevAvgDuration] = await Promise.all([
        getDashboardStats(id, prevStart, prevEnd),
        getAvgSessionDuration(id, prevStart, prevEnd),
      ]);
    }

    return successResponse({
      current: { ...current, avgDuration },
      previous: previous ? { ...previous, avgDuration: prevAvgDuration } : null,
    });
  } catch (error) {
    return apiErrorHandler(error, "GET /api/websites/[id]/stats");
  }
}
