// app/api/health/route.ts - Optimized OAuth health check
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { addLog } from "@/lib/logger";

const prisma = new PrismaClient();

interface HealthCheck {
  service: string;
  status: "healthy" | "unhealthy" | "degraded";
  responseTime: number;
  error?: string;
  details?: Record<string, unknown>;
}

interface HealthReport {
  overall: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  uptime: number;
  checks: HealthCheck[];
  system: {
    nodeVersion: string;
    platform: string;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      service: "database",
      status: "healthy",
      responseTime: Date.now() - start,
      details: { connection: "active" },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";
    addLog("error", "Database health check failed", { error: errorMessage });
    return {
      service: "database",
      status: "unhealthy",
      responseTime: Date.now() - start,
      error: errorMessage,
    };
  }
}

async function checkAuth(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/auth/providers`,
      {
        method: "GET",
        headers: {
          "User-Agent": "Health-Check/1.0",
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000), // 5 second timeout
      }
    );

    if (response.ok) {
      return {
        service: "auth",
        status: "healthy",
        responseTime: Date.now() - start,
        details: { providers: "available" },
      };
    } else {
      return {
        service: "auth",
        status: "degraded",
        responseTime: Date.now() - start,
        error: `HTTP ${response.status}`,
      };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Auth service unreachable";
    addLog("error", "Auth health check failed", { error: errorMessage });
    return {
      service: "auth",
      status: "unhealthy",
      responseTime: Date.now() - start,
      error: errorMessage,
    };
  }
}

// Alternative: Check Google OAuth by validating client credentials (even faster)
async function checkGoogleOAuthCredentials(): Promise<HealthCheck> {
  const start = Date.now();

  try {
    // Quick validation - just check if credentials are properly formatted
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return {
        service: "google-oauth",
        status: "unhealthy",
        responseTime: Date.now() - start,
        error: "Missing Google OAuth credentials",
      };
    }

    // Basic format validation (Google Client IDs end with .googleusercontent.com)
    if (!clientId.includes("googleusercontent.com")) {
      return {
        service: "google-oauth",
        status: "degraded",
        responseTime: Date.now() - start,
        error: "Invalid Google Client ID format",
      };
    }

    return {
      service: "google-oauth",
      status: "healthy",
      responseTime: Date.now() - start,
      details: {
        credentials: "configured",
        validation: "format_check",
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Google OAuth check failed";
    return {
      service: "google-oauth",
      status: "unhealthy",
      responseTime: Date.now() - start,
      error: errorMessage,
    };
  }
}

function getSystemInfo() {
  const memUsage = process.memoryUsage();
  return {
    nodeVersion: process.version,
    platform: process.platform,
    memory: {
      used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
    },
  };
}

export async function GET(): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    addLog("info", "Health check initiated");

    // Use credential validation instead (much faster - no HTTP request)
    const [dbCheck, authCheck, googleCheck] = await Promise.all([
      checkDatabase(),
      checkAuth(),
      checkGoogleOAuthCredentials(),
    ]);

    const allChecks = [dbCheck, authCheck, googleCheck];

    const hasUnhealthy = allChecks.some(
      (check) => check.status === "unhealthy"
    );
    const hasDegraded = allChecks.some((check) => check.status === "degraded");

    let overall: "healthy" | "unhealthy" | "degraded" = "healthy";
    if (hasUnhealthy) overall = "unhealthy";
    else if (hasDegraded) overall = "degraded";

    const report: HealthReport = {
      overall,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: allChecks,
      system: getSystemInfo(),
    };

    const statusCode =
      overall === "healthy" ? 200 : overall === "degraded" ? 200 : 503;

    addLog(
      overall === "healthy" ? "info" : "warn",
      `Health check completed: ${overall}`,
      {
        overall,
        responseTime: Date.now() - startTime,
      }
    );

    return NextResponse.json(report, { status: statusCode });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Health check failed";
    addLog("error", "Health check failed", {
      error: errorMessage,
      responseTime: Date.now() - startTime,
    });

    return NextResponse.json(
      {
        overall: "unhealthy",
        timestamp: new Date().toISOString(),
        error: errorMessage,
        uptime: process.uptime(),
        responseTime: Date.now() - startTime,
      },
      { status: 503 }
    );
  }
}
