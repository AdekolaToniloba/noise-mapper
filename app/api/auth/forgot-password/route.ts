// app/api/auth/forgot-password/route.ts - Updated for existing schema
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { generateToken } from "@/utils/auth-helpers";
import { authRateLimit } from "@/lib/rate-limit";
import { sendPasswordResetEmail } from "@/lib/email";
import { withApiMiddleware } from "@/lib/api-logger";
import { addLog } from "@/lib/logger";

const prisma = new PrismaClient();

const forgotPasswordSchema = z.object({
  email: z.string().email(),
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

async function forgotPasswordHandler(
  request: NextRequest
): Promise<NextResponse> {
  const ip = getClientIP(request);

  try {
    const { success, headers } = await authRateLimit(request);

    if (!success) {
      addLog("warn", "Forgot password rate limit exceeded", { ip });
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers }
      );
    }

    const body = await request.json();
    const validationResult = forgotPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      addLog("warn", "Forgot password validation failed", {
        ip,
        errors: validationResult.error.flatten(),
      });
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400, headers }
      );
    }

    const { email } = validationResult.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      addLog("warn", "Password reset requested for non-existent user", {
        ip,
        email,
      });
      return NextResponse.json(
        {
          message:
            "If an account with this email exists, you will receive a password reset link.",
        },
        { status: 200, headers }
      );
    }

    // Generate reset token
    const resetToken = generateToken();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token: resetToken,
        expires,
      },
    });

    addLog("info", "Password reset token generated", {
      ip,
      email,
      userId: user.id,
    });

    // Send reset email
    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json(
      {
        message:
          "If an account with this email exists, you will receive a password reset link.",
      },
      { status: 200, headers }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    addLog("error", "Forgot password error", { ip, error: errorMessage });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withApiMiddleware(forgotPasswordHandler);
