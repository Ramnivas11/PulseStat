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
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${isDev ? "blob:" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self' https://api.upstash.io https://api.neon.tech ${isDev ? "ws: localhost:*" : ""}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Disable caching for dynamic pages, enable long caching for static assets (handled elsewhere)
  if (!req.nextUrl.pathname.startsWith('/_next/static')) {
    res.headers.set('Cache-Control', 'no-store');
  }

  return res;
}
