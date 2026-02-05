import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Define your domains
  const appDomain = "app.ojalaai.com";
  const marketingDomain = "ojalaai.com";

  // Check if on app subdomain (production or local dev)
  const isAppSubdomain =
    hostname.startsWith("app.") ||
    hostname === appDomain;

  // Check if on marketing domain (production or local dev)
  const isMarketingDomain =
    hostname === marketingDomain ||
    hostname === "www.ojalaai.com" ||
    hostname.startsWith("localhost") ||
    hostname.includes("127.0.0.1");

  // Dashboard routes
  const isDashboardRoute =
    pathname === "/home" ||
    pathname.startsWith("/home/") ||
    pathname === "/invoices" ||
    pathname.startsWith("/invoices/");

  // If on app subdomain
  if (isAppSubdomain) {
    // Rewrite root to /home for app subdomain
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/home", request.url));
    }
    // Allow dashboard routes
    return NextResponse.next();
  }

  // If on marketing domain, redirect dashboard routes to app subdomain
  if (isMarketingDomain && isDashboardRoute) {
    const appUrl = new URL(pathname, `https://${appDomain}`);
    return NextResponse.redirect(appUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home", "/home/:path*", "/invoices", "/invoices/:path*"],
};
