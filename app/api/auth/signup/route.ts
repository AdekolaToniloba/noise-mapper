// app/api/auth/signup/route.ts - Enhanced to detect health checks
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { hashPassword, validatePasswordStrength } from "@/utils/auth-helpers";
import { authRateLimit } from "@/lib/rate-limit";
import { sendWelcomeEmail } from "@/lib/email";
import { withApiMiddleware } from "@/lib/api-logger";
import { addLog } from "@/lib/logger";

const prisma = new PrismaClient();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

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

// Helper function to detect health check requests
function isHealthCheckRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get("user-agent") || "";
  // const contentType = request.headers.get("content-type") || "";

  // Check for health check user agents
  if (userAgent.includes("Health-Check")) {
    return true;
  }

  // Check for monitoring tools
  const monitoringAgents = [
    "monitoring",
    "health",
    "uptime",
    "pingdom",
    "datadog",
    "newrelic",
  ];

  if (
    monitoringAgents.some((agent) => userAgent.toLowerCase().includes(agent))
  ) {
    return true;
  }

  return false;
}

async function signupHandler(request: NextRequest): Promise<NextResponse> {
  const ip = getClientIP(request);

  // Check if this is a health check request
  if (isHealthCheckRequest(request)) {
    // Return a 200 status to indicate the endpoint is working
    // but don't log validation errors for health checks
    return NextResponse.json(
      {
        status: "endpoint_healthy",
        message: "Signup endpoint is operational",
      },
      { status: 200 }
    );
  }

  try {
    const { success, headers } = await authRateLimit(request);

    if (!success) {
      addLog("warn", "Signup rate limit exceeded", { ip });
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers }
      );
    }

    const body = await request.json();
    const validationResult = signupSchema.safeParse(body);

    if (!validationResult.success) {
      addLog("warn", "Signup validation failed", {
        ip,
        errors: validationResult.error.flatten(),
      });
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.flatten() },
        { status: 400, headers }
      );
    }

    const { email, password, name } = validationResult.data;

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      addLog("warn", "Weak password attempt", { ip, email });
      return NextResponse.json(
        { error: "Weak password", details: passwordValidation.errors },
        { status: 400, headers }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      addLog("warn", "Signup attempt with existing email", { ip, email });
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409, headers }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    addLog("info", "User signup successful", {
      ip,
      email,
      userId: user.id,
    });

    sendWelcomeEmail(email, name);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201, headers }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    addLog("error", "Signup error", { ip, error: errorMessage });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withApiMiddleware(signupHandler);
