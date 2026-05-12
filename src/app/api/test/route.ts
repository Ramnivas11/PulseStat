import { getWebsites } from "@/services/website.service";

export async function GET() {
  const websites = await getWebsites();

  return Response.json({
    success: true,
    websites,
  });
}