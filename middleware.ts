// Updated middleware.ts
import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // NextRequest doesn't have an 'ip' property, use headers only
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

  console.log({
    path: request.nextUrl.pathname,
    ip: ip,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
