// middleware.ts - Enhanced middleware with logging
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { addLog } from "./lib/logger";

// Helper function to extract IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}

export function middleware(request: NextRequest) {
  const start = Date.now();
  const { pathname } = request.nextUrl;
  const method = request.method;
  const ip = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "unknown";

  // Skip logging for static assets and health checks to reduce noise
  const skipLogging = [
    "/_next/",
    "/favicon.ico",
    "/api/health",
    "/api/logs",
    "/health", // Skip the health page itself
  ].some((path) => pathname.startsWith(path));

  if (!skipLogging) {
    addLog("info", `${method} ${pathname}`, {
      method,
      endpoint: pathname,
      ip,
      userAgent: userAgent.substring(0, 100), // Truncate long user agents
    });
  }

  const response = NextResponse.next();

  // Add response time header
  const responseTime = Date.now() - start;
  response.headers.set("X-Response-Time", `${responseTime}ms`);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
