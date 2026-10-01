"use client";
import Icon from "@/components/Icon";

export default function Error({ reset }) {
  return (
    <section className="container-x flex min-h-[60svh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
        <Icon name="alert" size={26} />
      </span>
      <h1 className="mt-4 text-2xl font-extrabold">Something went wrong · Terjadi kesalahan</h1>
      <p className="mt-2 max-w-md text-ink-muted">Please try again in a moment. Silakan coba lagi sebentar lagi.</p>
      <button type="button" onClick={() => reset()} className="btn-primary mt-6">
        Try again · Coba lagi
      </button>
    </section>
  );
}
