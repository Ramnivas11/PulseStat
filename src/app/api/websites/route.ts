import { v4 as uuidv4 } from "uuid";

import { auth } from "@/lib/auth";
import { createWebsiteSchema } from "@/validations/website";
import { successResponse, errorResponse, apiErrorHandler } from "@/lib/api-helpers";
import { createWebsite, getWebsitesByUserId } from "@/features/websites/services/website.service";
import { canCreateWebsite } from "@/features/billing/services/billing.service";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const websites = await getWebsitesByUserId(session.user.id);
    return successResponse(websites);
  } catch (error) {
    return apiErrorHandler(error, "GET /api/websites");
  }
}

export async function POST(req: Request) {
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

    const validated = createWebsiteSchema.safeParse(body);
    if (!validated.success) {
      return errorResponse("Invalid payload", 400);
    }

    const permission = await canCreateWebsite(session.user.id);

    if (!permission.allowed) {
      return Response.json(
        {
          error: "Website limit reached. Upgrade to Pro for more websites.",
          upgrade: true,
          limit: permission.limit,
          currentCount: permission.currentCount,
          plan: permission.plan,
        },
        { status: 403 }
      );
    }

    const website = await createWebsite({
      name: validated.data.name,
      domain: validated.data.domain,
      userId: session.user.id,
      siteKey: `site_${uuidv4()}`,
    });

    return successResponse({ website }, 201);
  } catch (error) {
    return apiErrorHandler(error, "POST /api/websites");
  }
}
