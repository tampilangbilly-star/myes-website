"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer({ lang = "en" }) {
  const pathname = usePathname();

  // Logika penyembunyi: Jika rute berawalan /admin, jangan tampilkan footer
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="footer-modern">
      {/* ========================================== */}
      {/* BAGIAN ATAS: READY TO GROW (Flex 1 agar mengisi ruang tengah) */}
      {/* ========================================== */}
      <div className="footer-cta">
        <div className="container footer-cta-inner">
          <h2 className="footer-cta-title">
            {lang === "id"
              ? "Siap Bertumbuh Bersama?"
              : "Ready to Grow With Us?"}
          </h2>
          <p className="footer-cta-desc">
            {lang === "id"
              ? "Mari bergabung dengan komunitas anak muda M-YES. Kita belajar bahasa Inggris, membangun relasi, dan memperdalam iman bersama-sama dalam suasana yang menyenangkan!"
              : "Join the M-YES youth community. We learn English, build relationships, and deepen our faith together in a fun and welcoming environment!"}
          </p>
          <Link href="/contact" className="cta-button">
            {lang === "id" ? "Bergabung Sekarang" : "Join Us Now"}
          </Link>
        </div>
      </div>

      {/* ========================================== */}
      {/* BAGIAN BAWAH: MENU & COPYRIGHT             */}
      {/* ========================================== */}
      <div className="container footer-bottom-container">
        <div className="footer-grid">
          {/* Kolom 1: Identitas Brand */}
          <div>
            <h2 className="footer-brand-title">M-YES</h2>
            <p className="footer-brand-desc">
              {lang === "id"
                ? "Manado Youth English Service. Belajar Bahasa Inggris, Bertumbuh dalam Iman."
                : "Manado Youth English Service. Learning English, Growing in Faith."}
            </p>
          </div>

          {/* Kolom 2: Quick Links */}
          <div>
            <h3 className="footer-col-title">
              {lang === "id" ? "Tautan Cepat" : "Quick Links"}
            </h3>
            <ul className="footer-col-list">
              <li>
                <Link href="/about" className="footer-link">
                  {lang === "id" ? "Tentang" : "About"}
                </Link>
              </li>
              <li>
                <Link href="/program" className="footer-link">
                  Program
                </Link>
              </li>
              <li>
                <Link href="/activities" className="footer-link">
                  {lang === "id" ? "Kegiatan" : "Activities"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Explore */}
          <div>
            <h3 className="footer-col-title">
              {lang === "id" ? "Jelajahi" : "Explore"}
            </h3>
            <ul className="footer-col-list">
              <li>
                <Link href="/mission" className="footer-link">
                  {lang === "id" ? "Misi" : "Mission"}
                </Link>
              </li>
              <li>
                <Link href="/news" className="footer-link">
                  {lang === "id" ? "Berita" : "News"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  {lang === "id" ? "Kontak" : "Contact"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT & DEVELOPER CREDIT */}
        <div className="footer-bottom-row">
          <p>
            © {new Date().getFullYear()} Manado Youth English Service (M-YES).
            All rights reserved.
          </p>

          <div>
            <Link href="/admin" className="footer-admin-link">
              Admin <span className="footer-admin-sep">~bt~</span> Billy
              Tampilang
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
