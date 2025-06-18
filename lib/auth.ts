// lib/auth.ts - Enhanced with built-in logging (ESLint errors fixed)
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { addLog } from "./logger";

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Custom user type with onboarded property
interface ExtendedUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  onboarded?: boolean;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          addLog("info", "Credentials login attempt", {
            email: credentials?.email || "unknown",
          });

          const { email, password } = loginSchema.parse(credentials);

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              password: true,
              onboarded: true,
            },
          });

          if (!user || !user.password) {
            addLog("warn", "Login failed: User not found or no password", {
              email,
            });
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            addLog("warn", "Login failed: Invalid password", {
              email,
              userId: user.id,
            });
            return null;
          }

          addLog("info", "Credentials login successful", {
            email,
            userId: user.id,
            onboarded: user.onboarded,
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            onboarded: user.onboarded,
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown auth error";
          addLog("error", "Credentials authorization error", {
            error: errorMessage,
            email: credentials?.email || "unknown",
          });
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        addLog("info", "NextAuth signIn callback", {
          provider: account?.provider,
          userEmail: user?.email,
          userId: user?.id,
        });

        // Your existing signIn logic here if any
        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "SignIn callback error";
        addLog("error", "NextAuth signIn callback error", {
          error: errorMessage,
          provider: account?.provider,
          userEmail: user?.email,
        });
        return false;
      }
    },

    async jwt({ token, user, account, trigger, session }) {
      try {
        if (user) {
          token.id = user.id;
          token.onboarded = (user as ExtendedUser).onboarded || false;

          addLog("info", "JWT token created", {
            userId: user.id,
            email: user.email,
            provider: account?.provider,
          });
        }

        // Handle session updates
        if (trigger === "update" && session) {
          token.onboarded = session.user.onboarded || token.onboarded;
          addLog("info", "JWT token updated", {
            userId: token.id,
            onboarded: token.onboarded,
          });
        }

        if (account?.provider === "google") {
          // Mark Google users as onboarded since they don't set passwords
          await prisma.user.update({
            where: { id: user?.id },
            data: { onboarded: true },
          });
          token.onboarded = true;

          addLog("info", "Google user marked as onboarded", {
            userId: user?.id,
            email: user?.email,
          });
        }

        // Refresh onboarding status from database
        if (token.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { onboarded: true },
          });
          if (dbUser) {
            token.onboarded = dbUser.onboarded;
          }
        }

        return token;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "JWT callback error";
        addLog("error", "NextAuth JWT callback error", {
          error: errorMessage,
          userId: user?.id || token?.id,
          trigger,
        });
        return token;
      }
    },

    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.onboarded = token.onboarded as boolean;
        }

        addLog("info", "Session created", {
          userId: session.user?.id,
          email: session.user?.email,
          onboarded: session.user?.onboarded,
        });

        return session;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Session callback error";
        addLog("error", "NextAuth session callback error", {
          error: errorMessage,
          userId: token?.id,
        });
        return session;
      }
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      addLog("info", "NextAuth signIn event", {
        userId: user?.id,
        email: user?.email,
        provider: account?.provider,
        isNewUser,
      });
    },
    async signOut({ token, session }) {
      addLog("info", "NextAuth signOut event", {
        userId: token?.id || session?.user?.id,
        email: token?.email || session?.user?.email,
      });
    },
    async createUser({ user }) {
      addLog("info", "NextAuth createUser event", {
        userId: user.id,
        email: user.email,
      });
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
