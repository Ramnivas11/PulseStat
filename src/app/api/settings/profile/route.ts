import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { safeJsonResponse } from "@/lib/serialize";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return safeJsonResponse({ error: "Unauthorized" }, 401);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, createdAt: true, settings: true },
    });

    if (!user) return safeJsonResponse({ error: "User not found" }, 404);

    return safeJsonResponse({ ok: true, data: user });
  } catch (err: any) {
    console.error("/api/settings/profile GET error:", err?.message ?? err);
    return safeJsonResponse({ error: "Internal server error" }, 500);
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return safeJsonResponse({ error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const updates: any = {};
    if (typeof body.name === "string") updates.name = body.name;
    if (typeof body.email === "string") updates.email = body.email;

    if (Object.keys(updates).length === 0) {
      return safeJsonResponse({ error: "No valid fields to update" }, 400);
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updates,
      select: { id: true, email: true, name: true, createdAt: true, settings: true },
    });

    return safeJsonResponse({ ok: true, data: user });
  } catch (err: any) {
    console.error("/api/settings/profile PATCH error:", err?.message ?? err);
    return safeJsonResponse({ error: "Internal server error" }, 500);
  }
}
