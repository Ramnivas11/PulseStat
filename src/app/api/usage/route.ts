import { auth } from "@/lib/auth";
import { getUserUsageSummary } from "@/features/billing/services/billing.service";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const usage = await getUserUsageSummary(session.user.id);

  return Response.json(usage);
}
