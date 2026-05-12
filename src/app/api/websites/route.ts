import { v4 as uuidv4 } from "uuid";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { createWebsiteSchema } from "@/lib/validations/website";

import { createWebsite } from "@/services/website.service";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return Response.json([]);
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const validated =
    createWebsiteSchema.safeParse(body);

  if (!validated.success) {
    return Response.json(
      {
        error: validated.error.flatten(),
      },
      {
        status: 400,
      }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return Response.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const website = await createWebsite({
    name: validated.data.name,
    domain: validated.data.domain,
    userId: user.id,
    siteKey: `site_${uuidv4()}`,
  });

  return Response.json({
    success: true,
    website,
  });
}