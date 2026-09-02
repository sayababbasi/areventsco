import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_SECRET = process.env.AUTH_SECRET || "dev-super-secret-key-areventsco-secure-12345";

async function verifyEdgeToken(token: string) {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadB64, providedSig] = parts;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(AUTH_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Convert base64url signature to Uint8Array
    const sigBinary = atob(providedSig.replace(/-/g, "+").replace(/_/g, "/"));
    const sigBytes = new Uint8Array(sigBinary.length);
    for (let i = 0; i < sigBinary.length; i++) {
      sigBytes[i] = sigBinary.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      encoder.encode(payloadB64)
    );

    if (!isValid) return null;

    const jsonStr = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(jsonStr);

    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

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

  // 2. Protect Admin routes (/admin/* and /api/admin/*)
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/api/dashboard");
  const isApiRoute = pathname.startsWith("/api/");

  if (isAdminRoute) {
    const sessionCookie = req.cookies.get("ar_session")?.value;

    if (!sessionCookie) {
      if (isApiRoute) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyEdgeToken(sessionCookie);
    if (!payload) {
      if (isApiRoute) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const allowedRoles = ["ADMIN", "SUPER_ADMIN", "EVENT_MANAGER", "STAFF"];
    if (!payload.role || !allowedRoles.includes(payload.role)) {
      if (isApiRoute) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 3. Protect Customer Dashboard routes (/dashboard/* and /api/dashboard/*)
  if (isDashboardRoute && !isAdminRoute) {
    const sessionCookie = req.cookies.get("ar_session")?.value;
    if (!sessionCookie) {
      if (isApiRoute) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyEdgeToken(sessionCookie);
    if (!payload) {
      if (isApiRoute) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Dynamic 301/302 Database Redirects Check (Fast non-blocking with 400ms timeout)
  if (!pathname.startsWith("/api/")) {
    try {
      const origin = req.nextUrl.origin;
      const res = await fetch(
        `${origin}/api/redirects?path=${encodeURIComponent(pathname)}`,
        {
          headers: { "x-middleware-check": "1" },
          signal: AbortSignal.timeout(400),
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
    } catch {
      // Fail gracefully if check times out or network is offline
    }
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
