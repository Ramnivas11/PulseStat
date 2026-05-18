import { auth } from "@/lib/auth";
import { errorResponse, successResponse, apiErrorHandler } from "@/lib/api-helpers";
import { getActiveVisitors } from "@/features/analytics/services/analytics.service";
import { getWebsiteByIdForUser } from "@/features/websites/services/website.service";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse("Unauthorized", 401);

    const { id } = await context.params;
    const website = await getWebsiteByIdForUser(id, session.user.id);
    if (!website) return errorResponse("Website not found", 404);

    const active = await getActiveVisitors(id);
    return successResponse({ active });
  } catch (error) {
    return apiErrorHandler(error, "GET /api/websites/[id]/active");
  }
}
