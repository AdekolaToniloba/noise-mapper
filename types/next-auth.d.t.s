// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      onboarded: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    onboarded: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    onboarded: boolean;
  }
}