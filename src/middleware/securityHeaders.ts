import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Apply strict security headers for every response.
 * CSP is set to only allow resources from self and the CDN used for static assets.
 * Adjust the directives if you use external services (e.g., fonts, analytics).
 */
export function applySecurityHeaders(req: NextRequest) {
  const res = NextResponse.next();

  const isDev = process.env.NODE_ENV === 'development';

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' blob:" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self' https://api.upstash.io https://api.neon.tech ${isDev ? "ws: localhost:*" : ""}`,
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Disable caching for authenticated app surfaces and APIs.
  if (
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/websites') ||
    req.nextUrl.pathname.startsWith('/settings') ||
    req.nextUrl.pathname.startsWith('/billing') ||
    req.nextUrl.pathname.startsWith('/api')
  ) {
    res.headers.set('Cache-Control', 'no-store');
  }

  return res;
}
