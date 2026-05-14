import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { authConfig } from "@/lib/auth.config";
import { authRateLimit, getIp } from "@/lib/rate-limit";
import { applySecurityHeaders } from "@/middleware/securityHeaders";

const { auth } = NextAuth(authConfig);

export const proxy = auth(async function proxy(req: NextRequest) {
  const response = applySecurityHeaders(req);

  if (req.nextUrl.pathname === "/api/auth/callback/credentials") {
    const ip = getIp(req);
    const { success } = await authRateLimit.limit(`login_${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429, headers: response.headers }
      );
    }
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|site.webmanifest|tracker.js|.*\\..*).*)",
  ],
};
