import { auth } from "@/lib/auth";
import { getUserUsageSummary } from "@/features/billing/services/billing.service";
import { safeJsonResponse, deepSerialize } from "@/lib/serialize";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return safeJsonResponse({ error: "Unauthorized" }, 401);
    }

    const usage = await getUserUsageSummary(session.user.id);

    // Ensure BigInts are converted before sending
    return safeJsonResponse({ ok: true, data: deepSerialize(usage) });
  } catch (err) {
    // Log server-side safely
    console.error("/api/usage error:", err instanceof Error ? err.message : String(err));
    return safeJsonResponse({ error: "Internal server error" }, 500);
  }
}
