import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/auth/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isProtected =
        pathname.startsWith("/dogs") || pathname.startsWith("/expenses");
      if (isProtected && !isLoggedIn) return false;
      return true;
    },
  },
};
