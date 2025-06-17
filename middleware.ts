// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname.startsWith("/forgot-password") ||
    request.nextUrl.pathname.startsWith("/reset-password");

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/quiet-routes") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/onboarding");

  const isPublicRoute =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/map");

  const isApiRoute = request.nextUrl.pathname.startsWith("/api");

  // Log API requests
  if (isApiRoute) {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    console.log({
      path: request.nextUrl.pathname,
      ip: ip,
      timestamp: new Date().toISOString(),
      method: request.method,
    });
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect authenticated routes
  if (isProtectedRoute && !token) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Check onboarding status for authenticated users (except on onboarding page and API routes)
  if (
    token &&
    !token.onboarded &&
    !request.nextUrl.pathname.startsWith("/onboarding") &&
    !request.nextUrl.pathname.startsWith("/api") &&
    !isAuthPage
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // Redirect from onboarding if already onboarded
  if (
    token &&
    token.onboarded &&
    request.nextUrl.pathname.startsWith("/onboarding")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
