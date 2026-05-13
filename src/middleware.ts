import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { authRateLimit, getIp } from "@/lib/rate-limit";

const { auth } = NextAuth(authConfig);

import { applySecurityHeaders } from "@/middleware/securityHeaders";

export default auth(async function middleware(req: NextRequest) {
  // Apply security headers to every response
  const response = applySecurityHeaders(req);

  // Apply rate limiting specifically to the credentials login endpoint
  // to protect against brute-force attacks on passwords
  if (req.nextUrl.pathname === "/api/auth/callback/credentials") {
    const ip = getIp(req);
    const { success } = await authRateLimit.limit(`login_${ip}`);

    if (!success) {
      // Return 429 Too Many Requests if rate limit is exceeded
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }
  }

  return response;
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/websites/:path*",
    "/settings/:path*",
    "/billing/:path*",
    "/api/auth/callback/credentials",
  ],
};