import { proxy } from "./dashboardGuard";

export default async function middleware(request) {
  return proxy(request);
}

export const config = {
  // Run in Node.js runtime so SQLite/jose/bcrypt imports work.
  runtime: "nodejs",
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)",
  ],
};
