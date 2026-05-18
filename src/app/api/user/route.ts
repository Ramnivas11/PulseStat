import { z } from "zod";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, apiErrorHandler } from "@/lib/api-helpers";

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse("Unauthorized", 401);

    let body: unknown;
    try { body = await req.json(); }
    catch { return errorResponse("Invalid request body", 400); }

    const validated = updateUserSchema.safeParse(body);
    if (!validated.success) {
      return errorResponse(validated.error.issues[0]?.message ?? "Invalid data", 400);
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: validated.data.name },
      select: { id: true, name: true, email: true },
    });

    return successResponse({ user: updated });
  } catch (error) {
    return apiErrorHandler(error, "PATCH /api/user");
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse("Unauthorized", 401);

    const userId = session.user.id;

    // Delete in dependency order
    const websiteIds = (
      await prisma.website.findMany({ where: { userId }, select: { id: true } })
    ).map((w: { id: string }) => w.id);

    if (websiteIds.length > 0) {
      await prisma.event.deleteMany({ where: { websiteId: { in: websiteIds } } });
      await prisma.dailyStat.deleteMany({ where: { websiteId: { in: websiteIds } } });
      await prisma.pageStat.deleteMany({ where: { websiteId: { in: websiteIds } } });
      await prisma.website.deleteMany({ where: { userId } });
    }

    await prisma.subscription.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    return successResponse({ deleted: true });
  } catch (error) {
    return apiErrorHandler(error, "DELETE /api/user");
  }
}
