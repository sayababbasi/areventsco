import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Skip static assets, next internal files, and public brand files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/brand") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Protect Admin routes (/admin/*)
  if (pathname.startsWith("/admin")) {
    const sessionCookie = req.cookies.get("ar_session")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Decode session payload safely in Edge middleware
    try {
      const [payloadB64] = sessionCookie.split(".");
      if (!payloadB64) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const payload = JSON.parse(
        Buffer.from(payloadB64, "base64url").toString("utf-8")
      );

      const allowedRoles = ["ADMIN", "SUPER_ADMIN", "EVENT_MANAGER", "STAFF"];
      if (!payload.role || !allowedRoles.includes(payload.role)) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 3. Protect Customer Dashboard routes (/dashboard/*)
  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = req.cookies.get("ar_session")?.value;
    if (!sessionCookie) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Dynamic 301/302 Database Redirects Check
  try {
    const origin = req.nextUrl.origin;
    const res = await fetch(
      `${origin}/api/redirects?path=${encodeURIComponent(pathname)}`,
      {
        headers: { "x-middleware-check": "1" },
        next: { revalidate: 300 }, // 5 min cache
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.redirect && data.redirect.toPath) {
        const targetUrl = new URL(data.redirect.toPath, req.url);
        return NextResponse.redirect(targetUrl, data.redirect.statusCode || 301);
      }
    }
  } catch (err) {
    // Fail gracefully if check times out
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and favicon
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
