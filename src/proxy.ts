import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
const ADMIN_HOSTS = new Set<string>([
  "admin.kbcuniverse.org",
  "admin.localhost",
]);
export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const host = (req.headers.get("host") || "").split(":")[0]; // remove :3000 etc.
  const isAdminHost = ADMIN_HOSTS.has(host as string);

  if (isAdminHost) {
    if (
      !url.pathname.startsWith("/admin") &&
      !url.pathname.startsWith("/_next") &&
      !url.pathname.startsWith("/api") &&
      !url.pathname.startsWith("/assets") &&
      !url.pathname.startsWith("/favicon")
    ) {
      url.pathname = url.pathname === "/" ? "/admin" : `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  if (url.pathname.startsWith("/admin")) {
    url.pathname = "/not-found";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|site.webmanifest|robots.txt|sitemap.xml|apple-touch-icon.png).*)",
  ],
};
