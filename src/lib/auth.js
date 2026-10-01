import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { rateLimit } from "./rate-limit";

/**
 * NextAuth v4 — login admin (email + password, tabel "User").
 * Keamanan: tanpa log data login, rate limit 8x / 15 menit per email,
 * NEXTAUTH_SECRET wajib dari environment (tidak ada nilai cadangan di kode).
 */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").trim().toLowerCase();
        const password = String(credentials?.password || "");
        if (!email || !password || password.length > 200) return null;
        if (!rateLimit(`login:${email}`, 8, 15 * 60_000).ok) {
          throw new Error("RATE_LIMITED");
        }
        try {
          const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: "insensitive" } } });
          if (!user) return null;
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) return null;
          return { id: String(user.id), name: user.name, email: user.email };
        } catch (error) {
          console.error("[auth] gagal memeriksa login:", error?.message);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.uid;
      return session;
    },
  },
};
