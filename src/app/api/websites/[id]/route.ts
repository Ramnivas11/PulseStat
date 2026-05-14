import { auth } from "@/lib/auth";
import { deleteWebsite } from "@/features/websites/services/website.service";
import { successResponse, errorResponse, apiErrorHandler } from "@/lib/api-helpers";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await context.params;

    if (!id) {
      return errorResponse("Website ID is required", 400);
    }

    const result = await deleteWebsite(id, session.user.id);
    if (result.count === 0) {
      return errorResponse("Website not found", 404);
    }

    return successResponse({ deleted: true });
  } catch (error) {
    return apiErrorHandler(error, "DELETE /api/websites/[id]");
  }
}
