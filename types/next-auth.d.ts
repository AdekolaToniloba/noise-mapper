// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      onboarded: boolean;
      createdAt?: Date;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    onboarded: boolean;
    createdAt?: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    onboarded: boolean;
    createdAt?: Date;
  }
}
