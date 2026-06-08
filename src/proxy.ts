import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import type { NextAuthRequest } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { authRateLimit, getIp } from "@/lib/rate-limit";

const { auth } = NextAuth(authConfig);

import { applySecurityHeaders } from "@/middleware/securityHeaders";

const protectedPrefixes = ["/dashboard", "/websites", "/settings", "/billing"];

export default auth(async function proxy(req: NextAuthRequest) {
  // Apply security headers to every response
  const response = applySecurityHeaders(req);
  const isAuthCallback = req.nextUrl.pathname === "/api/auth/callback/credentials";
  const isProtectedRoute = protectedPrefixes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  // Apply rate limiting specifically to the credentials login endpoint
  // to protect against brute-force attacks on passwords
  if (isAuthCallback) {
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

  if (isProtectedRoute && !req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);

    return NextResponse.redirect(loginUrl);
  }

  return response;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|site.webmanifest|.*\\..*).*)"],
};
