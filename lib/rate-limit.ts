// lib/rate-limit.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
  headers: Record<string, string>;
}

// Clean up old entries periodically
async function cleanupOldEntries() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  await prisma.rateLimitEntry.deleteMany({
    where: {
      createdAt: {
        lt: oneHourAgo,
      },
    },
  });
}

export async function rateLimit(
  request: NextRequest,
  options: {
    identifier?: string;
    limit?: number;
    window?: number; // in minutes
  } = {}
): Promise<RateLimitResult> {
  const { limit = 30, window = 1 } = options;

  // Get identifier from IP or custom identifier
  const identifier =
    options.identifier ||
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const windowMs = window * 60 * 1000;
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);

  try {
    // Clean up old entries occasionally (1% chance)
    if (Math.random() < 0.01) {
      cleanupOldEntries().catch(console.error);
    }

    // Count recent requests
    const recentRequests = await prisma.rateLimitEntry.count({
      where: {
        identifier,
        createdAt: {
          gte: windowStart,
        },
      },
    });

    const remaining = Math.max(0, limit - recentRequests - 1);
    const reset = new Date(now.getTime() + windowMs);

    if (recentRequests >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": reset.toISOString(),
        },
      };
    }

    // Record this request
    await prisma.rateLimitEntry.create({
      data: {
        identifier,
        createdAt: now,
      },
    });

    return {
      success: true,
      limit,
      remaining,
      reset,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toISOString(),
      },
    };
  } catch (error) {
    console.error("Rate limit error:", error);
    // Fail open - allow request if rate limiting fails
    return {
      success: true,
      limit,
      remaining: limit,
      reset: new Date(now.getTime() + windowMs),
      headers: {},
    };
  }
}

// Specific rate limiters for different endpoints
export async function authRateLimit(request: NextRequest) {
  return rateLimit(request, {
    limit: 5, // 5 requests
    window: 1, // per minute
  });
}

export async function apiRateLimit(request: NextRequest) {
  return rateLimit(request, {
    limit: 30, // 30 requests
    window: 1, // per minute
  });
}
