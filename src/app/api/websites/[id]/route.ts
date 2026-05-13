import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, apiErrorHandler } from "@/lib/api-helpers";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const params = await context.params;

    if (!session?.user?.email) {
      return errorResponse("Unauthorized", 401);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    await prisma.website.deleteMany({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    return successResponse({ deleted: true });
  } catch (error) {
    return apiErrorHandler(error, "DELETE /api/websites/[id]");
  }
}