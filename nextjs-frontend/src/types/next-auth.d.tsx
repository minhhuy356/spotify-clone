import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { IRole } from "./data";

interface IUser {
  _id: string;
  username: string;
  email: string;
  address: string;
  isVerify: boolean;
  type: string;
  name: string;
  roles: IRole[];
  gender: string;
  age: number;
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    access_token: string;
    refresh_token: string;
    user: IUser;
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: IUser;
    access_token: string;
    refresh_token: string;
  }
}
