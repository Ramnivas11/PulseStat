import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authRateLimit, getIp } from "@/lib/rate-limit";
import { logWarn } from "@/lib/logger";

export const runtime = "nodejs";

const signupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255).toLowerCase().trim(),
  password: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  const ip = getIp(req);
  const { success } = await authRateLimit.limit(`signup_${ip}`);

  if (!success) {
    return Response.json(
      { error: "Too many signup attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const validated = signupSchema.safeParse(body);
    if (!validated.success) {
      return Response.json({ error: "Invalid input data" }, { status: 400 });
    }

    const { name, email, password } = validated.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      // Timing-safe: same delay whether user exists or not
      await bcrypt.hash(password, 10);
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    // Never return the user object — omit password hash
    return Response.json({ success: true });
  } catch {
    logWarn("Signup error", { ip });
    return Response.json(
      { error: "An unexpected error occurred during signup." },
      { status: 500 }
    );
  }
}
