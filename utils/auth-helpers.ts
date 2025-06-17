// utils/auth-helpers.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireOnboarding() {
  const session = await requireAuth();

  if (session.user && !session.user.onboarded) {
    redirect("/onboarding");
  }

  return session;
}

export const passwordSchema = {
  min: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
};

export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < passwordSchema.min) {
    errors.push(`Password must be at least ${passwordSchema.min} characters`);
  }

  if (passwordSchema.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (passwordSchema.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (passwordSchema.requireNumbers && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (passwordSchema.requireSpecialChars && !/[!@#$%^&*]/.test(password)) {
    errors.push(
      "Password must contain at least one special character (!@#$%^&*)"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
