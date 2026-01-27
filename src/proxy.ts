import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const isAuthenticated = request.cookies.get("auth")?.value === "true";
  const { pathname } = request.nextUrl;

  // Authenticated users visiting the landing page → redirect to dashboard
  if (isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Unauthenticated users visiting dashboard routes → redirect to landing
  if (!isAuthenticated && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home", "/invoices/:path*"],
};
