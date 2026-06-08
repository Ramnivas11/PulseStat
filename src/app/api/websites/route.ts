import { v4 as uuidv4 } from "uuid";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { createWebsiteSchema } from "@/validations/website";

import { successResponse, errorResponse, apiErrorHandler } from "@/lib/api-helpers";
import { canUseLocalhostDomains, normalizeDomain } from "@/lib/domain";

import { createWebsite, getWebsitesByUserId } from "@/features/websites/services/website.service";
import { canCreateWebsite } from "@/features/billing/services/billing.service";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return errorResponse("Unauthorized", 401);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    const websites = await getWebsitesByUserId(user.id);
    return successResponse(websites);
  } catch (error) {
    return apiErrorHandler(error, "GET /api/websites");
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const validated = createWebsiteSchema.safeParse(body);

    if (!validated.success) {
      return errorResponse("Invalid payload", 400);
    }

    const normalizedDomain = normalizeDomain(validated.data.domain, {
      allowLocalhost: canUseLocalhostDomains(),
    });

    if (!normalizedDomain) {
      return errorResponse("Enter a valid domain, such as example.com", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    // --- Website limit enforcement ---
    const permission = await canCreateWebsite(user.id);

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
      domain: normalizedDomain,
      userId: user.id,
      siteKey: `site_${uuidv4()}`,
    });

    return successResponse({ website }, 201);
  } catch (error) {
    return apiErrorHandler(error, "POST /api/websites");
  }
}
