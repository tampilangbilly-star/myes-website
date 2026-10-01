import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-bg px-4 py-10">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
      <div className="relative w-full max-w-sm">
        <div className="mb-6 text-center">
          <Image src="/logo-myes.png" alt="Logo M-YES" width={72} height={72} priority className="mx-auto h-16 w-16" />
          <h1 className="mt-4 text-2xl font-extrabold">M-YES Admin</h1>
          <p className="mt-1 text-sm text-ink-muted">Masuk untuk mengelola konten website</p>
        </div>
        <div className="card p-5 sm:p-7">
          <Suspense fallback={<div className="skeleton h-64" />}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="font-semibold text-ink-muted hover:text-primary">
            ← Kembali ke website
          </Link>
        </p>
      </div>
    </div>
  );
}
