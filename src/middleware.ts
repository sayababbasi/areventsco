import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static files, api routes, next internal routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/brand") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check custom redirects
  try {
    const origin = req.nextUrl.origin;
    const res = await fetch(`${origin}/api/redirects?path=${encodeURIComponent(pathname)}`, {
      headers: { "x-middleware-check": "1" },
      next: { revalidate: 300 }, // Cache check for 5 mins
    });

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
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
