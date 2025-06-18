// app/api/health/endpoints/route.ts - Fixed to avoid validation noise
import { NextResponse } from "next/server";
import { addLog } from "@/lib/logger";

interface EndpointCheck {
  endpoint: string;
  method: string;
  status: number;
  responseTime: number;
  healthy: boolean;
  error?: string;
}

// Updated endpoints list - removed POST routes that require specific data
const ENDPOINTS_TO_CHECK = [
  { path: "/api/auth/providers", method: "GET" },
  { path: "/api/auth/session", method: "GET" },
  { path: "/api/health", method: "GET" },
  { path: "/api/logs", method: "GET" },
  // Removed signup POST check since it requires valid data and creates noise
];

async function checkEndpoint(endpoint: {
  path: string;
  method: string;
}): Promise<EndpointCheck> {
  const start = Date.now();
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}${endpoint.path}`, {
      method: endpoint.method,
      headers: {
        "User-Agent": "Health-Check/1.0",
        "Content-Type": "application/json",
      },
      // Only add body for POST requests, and only for endpoints that don't require auth
      body: endpoint.method === "POST" ? JSON.stringify({}) : undefined,
    });

    return {
      endpoint: endpoint.path,
      method: endpoint.method,
      status: response.status,
      responseTime: Date.now() - start,
      healthy: response.status < 500, // Consider 4xx as healthy (client errors, not server errors)
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      endpoint: endpoint.path,
      method: endpoint.method,
      status: 0,
      responseTime: Date.now() - start,
      healthy: false,
      error: errorMessage,
    };
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    addLog("info", "Endpoint health check initiated");

    const checks = await Promise.all(
      ENDPOINTS_TO_CHECK.map((endpoint) => checkEndpoint(endpoint))
    );

    const healthyCount = checks.filter((check) => check.healthy).length;
    const totalCount = checks.length;
    const healthPercentage = (healthyCount / totalCount) * 100;

    const result = {
      summary: {
        total: totalCount,
        healthy: healthyCount,
        unhealthy: totalCount - healthyCount,
        healthPercentage: Math.round(healthPercentage),
      },
      checks,
      timestamp: new Date().toISOString(),
    };

    addLog(
      "info",
      `Endpoint check completed: ${healthyCount}/${totalCount} healthy`
    );

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    addLog("error", "Endpoint health check failed", { error: errorMessage });

    return NextResponse.json(
      {
        error: "Failed to check endpoints",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
