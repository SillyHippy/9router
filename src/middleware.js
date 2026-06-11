import { proxy as dashboardProxy } from "./dashboardGuard";
import { NextResponse } from "next/server";

const BASE_PATH = process.env.NINEROUTER_BASE_PATH || "";

export default async function middleware(request) {
  console.log("[MIDDLEWARE] Request:", request.url);
  console.log("[MIDDLEWARE] Pathname:", request.nextUrl.pathname);
  console.log("[MIDDLEWARE] BasePath:", BASE_PATH);
  console.log("[MIDDLEWARE] nextUrl.basePath:", request.nextUrl.basePath);

  // Strip the basePath from the request URL for internal routing
  if (BASE_PATH && request.nextUrl.pathname.startsWith(BASE_PATH + "/")) {
    const newPathname = request.nextUrl.pathname.slice(BASE_PATH.length);
    const newUrl = new URL(request.url);
    newUrl.pathname = newPathname;
    console.log("[MIDDLEWARE] Rewriting to:", newUrl.pathname);
    return NextResponse.rewrite(newUrl);
  }

  // Also handle exact BASE_PATH match (e.g., /9router -> /)
  if (BASE_PATH && request.nextUrl.pathname === BASE_PATH) {
    const newUrl = new URL(request.url);
    newUrl.pathname = "/";
    console.log("[MIDDLEWARE] Rewriting exact basePath to:", newUrl.pathname);
    return NextResponse.rewrite(newUrl);
  }

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