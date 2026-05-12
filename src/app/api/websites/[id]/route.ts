import { auth } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const session = await auth();
  const params = await context.params;

  if (!session?.user?.email) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
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

  await prisma.website.deleteMany({
    where: {
      id: params.id,
      userId: user.id,
    },
  });

  return Response.json({
    success: true,
  });
}