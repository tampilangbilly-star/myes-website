"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ lang = "en" }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Efek transparan/blur saat di-scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/about", en: "About Us", id: "Tentang Kami" },
    { href: "/personnel", en: "Personnel", id: "Personalia" },
    { href: "/program", en: "Program", id: "Program" },
    { href: "/activities", en: "Weekly Activities", id: "Kegiatan Mingguan" },
    { href: "/mission", en: "Mission Trip", id: "Misi Perjalanan" },
    { href: "/news", en: "News", id: "Berita" },
    { href: "/contact", en: "Contact Us", id: "Hubungi Kami" },
  ];

  // Fungsi pengganti bahasa dan penyimpan cookie
  const switchLang = (l) => {
    document.cookie = `lang=${l}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.location.reload();
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        {/* LOGO M-YES */}
        <Link href="/" className="nav-logo">
          {/* Ganti kotak M-Y dengan tag img ini. 
            Pastikan src-nya sesuai dengan nama file di folder public Anda 
          */}
          <img src="/icon1.png" alt="Logo M-YES" className="nav-logo-image" />

          <div className="nav-logo-text">
            M-YES<small>Manado Youth English Service</small>
          </div>
        </Link>

        {/* MENU TENGAH */}
        <div className={`nav-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {lang === "id" ? l.id : l.en}
            </Link>
          ))}
        </div>

        {/* KONTROL BAHASA & HAMBURGER MENU (MOBILE) */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div className="lang-toggle">
            <button
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => switchLang("en")}
            >
              EN
            </button>
            <button
              className={`lang-btn ${lang === "id" ? "active" : ""}`}
              onClick={() => switchLang("id")}
            >
              ID
            </button>
          </div>

          <button
            className={`hamburger ${open ? "open" : ""}`}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}
