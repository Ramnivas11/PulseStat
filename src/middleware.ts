import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { applySecurityHeaders } from "@/middleware/securityHeaders";
import { authRateLimit, getIp } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req: NextRequest) {
  // Security headers on every response
  const response = applySecurityHeaders(req);

  // Brute-force protection on credentials login
  if (req.nextUrl.pathname === "/api/auth/callback/credentials") {
    const ip = getIp(req);
    const { success } = await authRateLimit.limit(`login_${ip}`);
    if (!success) {
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
    "/docs/:path*",
    "/api/auth/callback/credentials",
  ],
};
