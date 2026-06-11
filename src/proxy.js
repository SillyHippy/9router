import { proxy } from "./dashboardGuard";
export default proxy;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|manifest\\.webmanifest).*)"],
};
