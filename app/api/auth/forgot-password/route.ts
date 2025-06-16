// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { generateToken } from "@/utils/auth-helpers";
import { authRateLimiter, rateLimit } from "@/lib/rate-limit";
import { sendPasswordResetEmail } from "@/lib/email";

const prisma = new PrismaClient();

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - stricter for password reset
    const { success, headers } = await rateLimit(request, authRateLimiter);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers }
      );
    }

    const body = await request.json();
    const validationResult = forgotPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400, headers }
      );
    }

    const { email } = validationResult.data;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: "If an account exists, a password reset link has been sent.",
        },
        { headers }
      );
    }

    // Check for existing token
    const existingToken = await prisma.passwordResetToken.findFirst({
      where: {
        email,
        expires: { gt: new Date() },
      },
    });

    if (existingToken) {
      // Token already sent recently
      return NextResponse.json(
        {
          success: true,
          message:
            "A password reset link has already been sent. Please check your email.",
        },
        { headers }
      );
    }

    // Generate token
    const token = generateToken();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Save token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // Send email
    await sendPasswordResetEmail(email, token);

    return NextResponse.json(
      {
        success: true,
        message: "If an account exists, a password reset link has been sent.",
      },
      { headers }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
