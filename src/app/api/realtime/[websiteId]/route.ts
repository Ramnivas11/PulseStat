import { auth } from "@/lib/auth";
import { logError, logWarn } from "@/lib/logger";
import { successResponse, errorResponse, apiErrorHandler } from "@/lib/api-helpers";
import { getActiveVisitors } from "@/features/analytics/services/analytics.service";
import { getWebsiteByIdForUser } from "@/features/websites/services/website.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  context: {
    params: Promise<{
      websiteId: string;
    }>;
  }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const { websiteId } = await context.params;
    const website = await getWebsiteByIdForUser(websiteId, session.user.id);

    if (!website) {
      logWarn("Realtime request for inaccessible website", {
        websiteId,
        userId: session.user.id,
      });
      return errorResponse("Website not found", 404);
    }

    const activeVisitors = await getActiveVisitors(websiteId);

    return successResponse({
      activeVisitors,
      windowSeconds: 30,
      polledAt: new Date().toISOString(),
    });
  } catch (error) {
    return apiErrorHandler(error, "GET /api/realtime/[websiteId]");
  }
}
