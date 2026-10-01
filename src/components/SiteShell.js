"use client";
import { usePathname } from "next/navigation";

/**
 * Kerangka situs publik (navbar, footer, tombol WhatsApp).
 * Di halaman /admin kerangka ini disembunyikan karena admin punya layout sendiri.
 */
export default function SiteShell({ children, navbar, footer, floating }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname?.startsWith("/admin/")) return children;
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:shadow-lift">
        Skip to content
      </a>
      {navbar}
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      {footer}
      {floating}
    </>
  );
}
