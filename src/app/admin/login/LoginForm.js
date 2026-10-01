"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import Icon from "@/components/Icon";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Hanya izinkan redirect ke halaman admin internal (cegah open redirect)
  const raw = params.get("callbackUrl") || "/admin";
  const callbackUrl = raw.startsWith("/admin") && !raw.startsWith("/admin/login") ? raw : "/admin";

  async function onSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) return setError("Email dan password wajib diisi.");
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email: email.trim(), password, redirect: false });
    if (!res || res.error) {
      setLoading(false);
      setError(res?.error === "RATE_LIMITED" ? "Terlalu banyak percobaan login. Tunggu 15 menit lalu coba lagi." : "Email atau password salah.");
      return;
    }
    router.replace(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger/10 px-3.5 py-3 text-sm font-medium text-danger">
          <Icon name="alert" size={18} className="mt-0.5 shrink-0" /> {error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input id="email" type="email" autoComplete="username" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} className={clsx("field", error && "field-error")} placeholder="admin@myes.com" autoFocus />
      </div>
      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <div className="relative">
          <input id="password" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={clsx("field pr-12", error && "field-error")} placeholder="••••••••" />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-ink-soft hover:text-ink" aria-label={show ? "Sembunyikan password" : "Tampilkan password"}>
            <Icon name={show ? "eye-off" : "eye"} size={19} />
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Memeriksa…" : "Masuk"} {!loading && <Icon name="arrow-right" size={18} />}
      </button>
    </form>
  );
}
