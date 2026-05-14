import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { successResponse, errorResponse, apiErrorHandler } from "@/lib/api-helpers";

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid request body", 400);
    }

    const validated = updateUserSchema.safeParse(body);
    if (!validated.success) {
      return errorResponse(validated.error.issues[0]?.message ?? "Invalid data", 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: validated.data.name },
      select: { id: true, name: true, email: true },
    });

    return successResponse({ user: updatedUser });
  } catch (error) {
    return apiErrorHandler(error, "PATCH /api/user");
  }
}
