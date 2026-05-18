import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { authRateLimit, getIp } from "@/lib/rate-limit";
import { applySecurityHeaders } from "@/middleware/securityHeaders";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  applySecurityHeaders(res, req);

  // Rate-limit login attempts
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

  return res;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|site\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|js)|api/track|api/auth).*)",
  ],
};
