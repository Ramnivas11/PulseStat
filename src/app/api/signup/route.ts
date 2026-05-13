import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authRateLimit, getIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Rate limiting for signup to prevent abuse
  const ip = getIp(req);
  const { success } = await authRateLimit.limit(`signup_${ip}`);

  if (!success) {
    return Response.json(
      { error: "Too many signup attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return Response.json(
        {
          error: "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(
      body.password,
      10
    );

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
      },
    });

    return Response.json({
      success: true,
      user,
    });
  } catch (_error) {
    return Response.json(
      { error: "An unexpected error occurred during signup." },
      { status: 500 }
    );
  }
}