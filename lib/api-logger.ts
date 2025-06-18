// lib/api-logger.ts - Fixed API logging utility
import { NextRequest, NextResponse } from "next/server";
import { addLog } from "./logger";

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

export function withLogging<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>,
  routeName: string
) {
  return async (...args: T): Promise<R> => {
    const start = Date.now();

    // Extract request info if first argument is NextRequest
    const request = args[0] as NextRequest;
    const ip = getClientIP(request);
    const userAgent = request?.headers?.get("user-agent") || "unknown";

    try {
      addLog("info", `${routeName} - Started`, {
        endpoint: routeName,
        ip,
        userAgent,
      });

      const result = await handler(...args);
      const responseTime = Date.now() - start;

      addLog("info", `${routeName} - Completed`, {
        endpoint: routeName,
        responseTime,
        ip,
        userAgent,
      });

      return result;
    } catch (error) {
      const responseTime = Date.now() - start;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      addLog("error", `${routeName} - Error: ${errorMessage}`, {
        endpoint: routeName,
        responseTime,
        error: errorMessage,
        ip,
        userAgent,
      });

      throw error;
    }
  };
}

// Enhanced middleware wrapper for API routes
export function withApiMiddleware(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const start = Date.now();
    const { pathname } = request.nextUrl;
    const method = request.method;
    const ip = getClientIP(request);
    const userAgent = request.headers.get("user-agent") || "unknown";

    try {
      const response = await handler(request);
      const responseTime = Date.now() - start;

      addLog("info", `API Request: ${method} ${pathname}`, {
        method,
        endpoint: pathname,
        statusCode: response.status,
        responseTime,
        ip,
        userAgent,
      });

      // Add response time header
      response.headers.set("X-Response-Time", `${responseTime}ms`);
      return response;
    } catch (error) {
      const responseTime = Date.now() - start;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      addLog("error", `API Error: ${method} ${pathname} - ${errorMessage}`, {
        method,
        endpoint: pathname,
        statusCode: 500,
        responseTime,
        error: errorMessage,
        ip,
        userAgent,
      });

      throw error;
    }
  };
}
