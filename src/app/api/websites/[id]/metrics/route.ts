import { auth } from "@/lib/auth";
import { errorResponse, successResponse, apiErrorHandler } from "@/lib/api-helpers";
import { getMetrics, getTopPages } from "@/features/analytics/services/analytics.service";
import { getAnalyticsDateRange, normalizeAnalyticsRange } from "@/features/analytics/services/date-range";
import { getWebsiteByIdForUser } from "@/features/websites/services/website.service";

export const dynamic = "force-dynamic";

// Allowed metric types and their corresponding DB fields
const METRIC_FIELD_MAP: Record<string, string> = {
  browser: "browser",
  os: "os",
  device: "device",
  country: "country",
  language: "language",
  referrer: "referrerDomain",
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  hostname: "hostname",
};

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
    const type = url.searchParams.get("type") ?? "";
    const range = normalizeAnalyticsRange(url.searchParams.get("range") ?? undefined);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? "10"), 100);
    const { startDate, endDate } = getAnalyticsDateRange(range);

    if (type === "path") {
      const pages = await getTopPages(id, startDate, endDate);
      return successResponse(
        pages.map((p) => ({ label: p.path, count: p.views }))
      );
    }

    const field = METRIC_FIELD_MAP[type];
    if (!field) {
      return errorResponse(
        `Unknown metric type "${type}". Valid types: ${Object.keys(METRIC_FIELD_MAP).join(", ")}, path`,
        400
      );
    }

    const items = await getMetrics(
      id,
      field as Parameters<typeof getMetrics>[1],
      startDate,
      endDate,
      limit
    );

    return successResponse(items);
  } catch (error) {
    return apiErrorHandler(error, "GET /api/websites/[id]/metrics");
  }
}
