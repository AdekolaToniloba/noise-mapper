// app/api/auth/reset-password/route.ts - Updated for existing schema
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { hashPassword, validatePasswordStrength } from "@/utils/auth-helpers";
import { authRateLimit } from "@/lib/rate-limit";
import { withApiMiddleware } from "@/lib/api-logger";
import { addLog } from "@/lib/logger";

const prisma = new PrismaClient();

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
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

async function resetPasswordHandler(
  request: NextRequest
): Promise<NextResponse> {
  const ip = getClientIP(request);

  try {
    const { success, headers } = await authRateLimit(request);

    if (!success) {
      addLog("warn", "Reset password rate limit exceeded", { ip });
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers }
      );
    }

    const body = await request.json();
    const validationResult = resetPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      addLog("warn", "Reset password validation failed", {
        ip,
        errors: validationResult.error.flatten(),
      });
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400, headers }
      );
    }

    const { token, password } = validationResult.data;

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      addLog("warn", "Weak password in reset attempt", { ip });
      return NextResponse.json(
        { error: "Weak password", details: passwordValidation.errors },
        { status: 400, headers }
      );
    }

    // Find valid reset token
    const resetTokenRecord = await prisma.passwordResetToken.findUnique({
      where: {
        token: token,
      },
    });

    if (!resetTokenRecord || resetTokenRecord.expires < new Date()) {
      addLog("warn", "Invalid or expired reset token used", {
        ip,
        token: token.substring(0, 8) + "...",
        expired: resetTokenRecord
          ? resetTokenRecord.expires < new Date()
          : "not_found",
      });
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400, headers }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: resetTokenRecord.email },
    });

    if (!user) {
      addLog("error", "Reset token exists but user not found", {
        ip,
        email: resetTokenRecord.email,
      });
      return NextResponse.json(
        { error: "User not found" },
        { status: 400, headers }
      );
    }

    // Hash new password and update user
    const hashedPassword = await hashPassword(password);

    await prisma.$transaction([
      // Update user password
      prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
        },
      }),
      // Delete the used reset token
      prisma.passwordResetToken.delete({
        where: { token: token },
      }),
      // Delete any other reset tokens for this email
      prisma.passwordResetToken.deleteMany({
        where: {
          email: resetTokenRecord.email,
          id: { not: resetTokenRecord.id }, // Don't try to delete the one we just deleted
        },
      }),
    ]);

    addLog("info", "Password reset successful", {
      ip,
      email: user.email,
      userId: user.id,
    });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200, headers }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    addLog("error", "Reset password error", { ip, error: errorMessage });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withApiMiddleware(resetPasswordHandler);
