import { proxy as dashboardProxy } from "./dashboardGuard";
import { NextResponse } from "next/server";

export default async function middleware(request) {
  // When basePath is configured in next.config.mjs, Next.js automatically
  // strips the basePath prefix from request.nextUrl.pathname and sets
  // request.nextUrl.basePath. No manual rewriting needed here.

  return dashboardProxy(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.svg (favicon files)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)",
  ],
};
