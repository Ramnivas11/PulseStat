import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function applySecurityHeaders(req: NextRequest) {
  const res = NextResponse.next();
  const isDev = process.env.NODE_ENV === 'development';

  // In production: no unsafe-eval. In dev: allow for HMR/React DevTools.
  const scriptSrc = isDev
    ? `script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:`
    : `script-src 'self' 'unsafe-inline'`;

  const connectSrc = isDev
    ? `connect-src 'self' ws: wss: localhost:* 127.0.0.1:* https://api.upstash.io`
    : `connect-src 'self' https://api.upstash.io`;

  const csp = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    connectSrc,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  res.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  res.headers.set('X-DNS-Prefetch-Control', 'off');

  if (!req.nextUrl.pathname.startsWith('/_next/static')) {
    res.headers.set('Cache-Control', 'no-store');
  }

  return res;
}
