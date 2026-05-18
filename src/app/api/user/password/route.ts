import { z } from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, apiErrorHandler } from "@/lib/api-helpers";

export const runtime = "nodejs";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse("Unauthorized", 401);

    let body: unknown;
    try { body = await req.json(); }
    catch { return errorResponse("Invalid request body", 400); }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid data", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user) return errorResponse("User not found", 404);

    const isValid = await bcrypt.compare(parsed.data.currentPassword, user.password);
    if (!isValid) return errorResponse("Current password is incorrect", 400);

    const hashed = await bcrypt.hash(parsed.data.newPassword, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    });

    return successResponse({ updated: true });
  } catch (error) {
    return apiErrorHandler(error, "PATCH /api/user/password");
  }
}
