import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("--- PROSES LOGIN DIMULAI ---");
          console.log("1. Coba login dengan email:", credentials?.email);

          if (!credentials?.email || !credentials?.password) {
            console.log("2. Gagal: Email atau password kosong");
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          console.log(
            "3. Cari di database, apakah user ditemukan?",
            user ? "YA" : "TIDAK",
          );

          if (!user) {
            return null;
          }

          const valid = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          console.log("4. Apakah password cocok?", valid ? "YA" : "TIDAK");

          if (!valid) {
            return null;
          }

          console.log("5. Login Berhasil!");
          return { id: user.id, name: user.name, email: user.email };
        } catch (error) {
          console.error("!!! ERROR SAAT LOGIN !!!", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET || "myes-secret-key-2026",
};
