import { z } from "zod";
import { auth } from "@/lib/auth";
import { deleteWebsite } from "@/features/websites/services/website.service";
import { successResponse, errorResponse, apiErrorHandler } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

const updateWebsiteSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  domain: z
    .string()
    .min(3)
    .max(253)
    .transform((v) => v.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").trim().toLowerCase())
    .optional(),
});

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse("Unauthorized", 401);

    const { id } = await context.params;
    if (!id) return errorResponse("Website ID required", 400);

    let body: unknown;
    try { body = await req.json(); }
    catch { return errorResponse("Invalid request body", 400); }

    const parsed = updateWebsiteSchema.safeParse(body);
    if (!parsed.success) return errorResponse("Invalid payload", 400);

    // Verify ownership before updating
    const existing = await prisma.website.findFirst({
      where: { id, userId: session.user.id },
      select: { id: true },
    });
    if (!existing) return errorResponse("Website not found", 404);

    const updated = await prisma.website.update({
      where: { id },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.domain !== undefined && { domain: parsed.data.domain }),
      },
      select: { id: true, name: true, domain: true, siteKey: true },
    });

    return successResponse({ website: updated });
  } catch (error) {
    return apiErrorHandler(error, "PATCH /api/websites/[id]");
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse("Unauthorized", 401);

    const { id } = await context.params;
    if (!id) return errorResponse("Website ID is required", 400);

    const result = await deleteWebsite(id, session.user.id);
    if (result.count === 0) return errorResponse("Website not found", 404);

    return successResponse({ deleted: true });
  } catch (error) {
    return apiErrorHandler(error, "DELETE /api/websites/[id]");
  }
}
