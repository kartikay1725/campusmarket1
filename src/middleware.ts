import { NextRequest, NextResponse } from "next/server";

// Paths that require authentication
const protectedPaths = ["/dashboard", "/sell", "/checkout", "/profile", "/admin/cm-secret-panel", "/wallet", "/orders"];

// Paths that are only for guests (logged out users)
const guestOnlyPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For API routes, just pass through
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // For static files, pass through
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Note: Client-side auth checking is handled in each page
  // Server middleware can check cookies but we're using localStorage
  // So we'll let pages handle redirects

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
