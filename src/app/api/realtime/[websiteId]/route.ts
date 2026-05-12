import { getActiveVisitors } from "@/services/analytics.service";

export async function GET(
  req: Request,
  context: {
    params: Promise<{
      websiteId: string;
    }>;
  }
) {
  const { websiteId } = await context.params;

  const activeVisitors =
    await getActiveVisitors(websiteId);

  return Response.json({
    activeVisitors,
  });
}