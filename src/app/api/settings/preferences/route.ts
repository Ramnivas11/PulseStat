import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { safeJsonResponse } from "@/lib/serialize";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return safeJsonResponse({ error: "Unauthorized" }, 401);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, settings: true },
    });

    if (!user) return safeJsonResponse({ error: "User not found" }, 404);

    return safeJsonResponse({ ok: true, data: user.settings ?? {} });
  } catch (err: any) {
    console.error("/api/settings/preferences GET error:", err?.message ?? err);
    return safeJsonResponse({ error: "Internal server error" }, 500);
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return safeJsonResponse({ error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));

    // Merge existing settings with incoming body
    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { settings: true } });

    const merged = { ...(user?.settings as any || {}), ...(body || {}) };

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { settings: merged },
      select: { id: true, settings: true },
    });

    return safeJsonResponse({ ok: true, data: updated.settings });
  } catch (err: any) {
    console.error("/api/settings/preferences PATCH error:", err?.message ?? err);
    return safeJsonResponse({ error: "Internal server error" }, 500);
  }
}
