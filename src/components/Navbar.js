"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import Icon from "./Icon";
import ThemeSwitcher from "./ThemeSwitcher";

const LINKS = [
  { href: "/about", en: "About Us", id: "Tentang Kami", icon: "users" },
  { href: "/personnel", en: "Personnel", id: "Personalia", icon: "user" },
  { href: "/program", en: "Program", id: "Program", icon: "book" },
  { href: "/activities", en: "Weekly Activities", id: "Kegiatan Mingguan", icon: "calendar" },
  { href: "/mission", en: "Mission Trip", id: "Misi Perjalanan", icon: "plane" },
  { href: "/care", en: "M-YES Care", id: "M-YES Care", icon: "heart" },
  { href: "/news", en: "News", id: "Berita", icon: "news" },
  { href: "/contact", en: "Contact Us", id: "Hubungi Kami", icon: "mail" },
];

const SOCIAL_ORDER = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "youtube", label: "YouTube" },
  { key: "facebook", label: "Facebook" },
];

function setLangCookie(l) {
  document.cookie = `lang=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

/**
 * Navbar v2.1
 * - Strip info berwarna di atas (jadwal, lokasi, sosial media) → navbar tidak lagi polos.
 *   Strip mengecil otomatis saat halaman di-scroll.
 * - Bar utama: logo dalam lingkaran aksen, garis gradasi di bawah, menu aktif bergaris bawah,
 *   tombol "Join Us" di desktop.
 * - HP: strip jadwal ringkas + bar logo, menu drawer dengan ikon, jadwal & sosial media.
 * Semua warna memakai warna tema (ikut pemilih warna 🎨).
 */
export default function Navbar({ lang = "en", info = {} }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const id = lang === "id";

  const schedule = info.schedule || (id ? "Setiap Jumat, 17:30 WITA" : "Every Friday, 17:30 WITA");
  const area = info.area || "Manado";
  const socials = SOCIAL_ORDER.filter((s) => info.socials?.[s.key]).map((s) => ({ ...s, href: info.socials[s.key] }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tutup drawer saat pindah halaman
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Kunci scroll body saat drawer terbuka + tutup dengan Esc
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchLang = (l) => {
    setLangCookie(l);
    router.refresh();
  };

  const isActive = (href) => pathname === href || pathname?.startsWith(`${href}/`);

  const langToggle = (className) => (
    <div className={clsx("flex items-center rounded-xl border border-line bg-surface p-1", className)} role="group" aria-label="Language">
      {["en", "id"].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchLang(l)}
          aria-pressed={lang === l}
          className={clsx("min-h-8 min-w-9 rounded-lg px-2 text-xs font-bold uppercase transition", lang === l ? "bg-primary text-primary-ink shadow-sm" : "text-ink-muted hover:text-ink")}
        >
          {l}
        </button>
      ))}
    </div>
  );

  const socialIcons = (className, iconClass) => (
    <div className={clsx("flex items-center", className)}>
      {socials.map((s) => (
        <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className={iconClass}>
          <Icon name={s.key} size={15} />
        </a>
      ))}
    </div>
  );

  return (
    <>
      <header className={clsx("sticky top-0 z-50 transition-shadow duration-300", scrolled && "shadow-[0_8px_24px_-16px_rgb(15_23_42/0.35)]")}>
        {/* ===== STRIP INFO (berwarna) ===== */}
        <div
          className={clsx(
            "overflow-hidden bg-gradient-to-r from-primary-strong via-primary to-primary-strong text-primary-ink transition-[max-height,opacity] duration-300",
            scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100",
          )}
        >
          <div className="mx-auto flex h-9 w-full max-w-7xl items-center justify-center gap-5 px-4 text-[11.5px] font-medium sm:justify-between sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-5">
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Icon name="clock" size={14} className="shrink-0 opacity-90" />
                <span className="truncate">{schedule}</span>
              </span>
              <span className="hidden items-center gap-1.5 md:inline-flex">
                <Icon name="pin" size={14} className="shrink-0 opacity-90" />
                {area}
              </span>
              <span className="hidden items-center gap-1.5 lg:inline-flex">
                <Icon name="sparkle" size={14} className="shrink-0 opacity-90" />
                {id ? "Gratis & terbuka untuk semua anak muda" : "Free & open to all young people"}
              </span>
            </div>
            {socials.length > 0 &&
              socialIcons("hidden gap-1 sm:flex", "flex h-7 w-7 items-center justify-center rounded-full text-primary-ink/90 transition hover:bg-white/15 hover:text-primary-ink")}
          </div>
        </div>

        {/* ===== BAR UTAMA ===== */}
        <div className="relative border-b border-line/70 bg-surface/90 backdrop-blur-md">
          {/* Garis aksen gradasi di bawah navbar */}
          <span aria-hidden className="absolute inset-x-0 -bottom-px h-[2px] bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

          <nav className="mx-auto flex h-[var(--nav-h)] w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8" aria-label={id ? "Menu utama" : "Main menu"}>
            <Link href="/" className="group flex min-w-0 items-center gap-2.5" aria-label="M-YES — Home">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft ring-2 ring-primary/25 transition group-hover:ring-primary/60 sm:h-12 sm:w-12">
                <Image src="/logo-myes.png" alt="Logo M-YES" width={44} height={44} priority className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block font-display text-lg font-extrabold tracking-tight text-ink">
                  M-<span className="text-primary">YES</span>
                </span>
                <span className="block truncate text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft xl:hidden 2xl:block">
                  Manado Youth English Service
                </span>
              </span>
            </Link>

            {/* Menu desktop */}
            <ul className="ml-auto hidden items-center xl:flex">
              {LINKS.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "group relative flex min-h-11 items-center whitespace-nowrap px-2.5 text-[13.5px] font-semibold transition-colors",
                        active ? "text-primary-strong" : "text-ink-muted hover:text-ink",
                      )}
                    >
                      {id ? l.id : l.en}
                      {/* Garis bawah: penuh untuk menu aktif, muncul saat hover untuk lainnya */}
                      <span
                        aria-hidden
                        className={clsx(
                          "absolute inset-x-2.5 bottom-1 h-[3px] origin-center rounded-full bg-primary transition-transform duration-300",
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-hover:bg-primary/40",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="ml-auto flex items-center gap-1.5 xl:ml-3">
              {langToggle("hidden sm:flex")}
              <ThemeSwitcher lang={lang} />
              <Link href="/contact" className="btn-primary ml-1 hidden min-h-10 px-4 text-sm xl:inline-flex">
                {id ? "Gabung" : "Join Us"} <Icon name="arrow-right" size={16} />
              </Link>
              <button
                type="button"
                className="ml-0.5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-strong transition hover:bg-primary hover:text-primary-ink xl:hidden"
                aria-label={id ? "Buka menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen(true)}
              >
                <Icon name="menu" size={22} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ===== DRAWER HP ===== */}
      {open && (
        <div className="fixed inset-0 z-[60] xl:hidden" role="dialog" aria-modal="true" aria-label="Menu" id="mobile-menu">
          <button type="button" aria-label={id ? "Tutup menu" : "Close menu"} className="animate-fade-in absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div className="animate-slide-in-right absolute inset-y-0 right-0 flex w-[min(88vw,370px)] flex-col bg-surface shadow-lift pb-safe">
            {/* Kepala drawer berwarna */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-strong to-primary px-4 pb-5 pt-4 text-primary-ink">
              <span aria-hidden className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
              <span aria-hidden className="absolute -bottom-12 right-16 h-24 w-24 rounded-full bg-white/10" />
              <div className="relative flex items-center justify-between">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95">
                    <Image src="/logo-myes.png" alt="" width={40} height={40} className="h-9 w-9 object-contain" />
                  </span>
                  <span className="leading-tight">
                    <span className="block font-display text-lg font-extrabold">M-YES</span>
                    <span className="block text-[11px] font-medium opacity-90">Manado Youth English Service</span>
                  </span>
                </span>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
                  aria-label={id ? "Tutup menu" : "Close menu"}
                  onClick={() => setOpen(false)}
                  autoFocus
                >
                  <Icon name="close" size={22} />
                </button>
              </div>
              <p className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
                <Icon name="clock" size={14} /> {schedule}
              </p>
            </div>

            <ul className="flex-1 space-y-1 overflow-y-auto p-3">
              {[{ href: "/", en: "Home", id: "Beranda", icon: "home" }, ...LINKS].map((l, i) => {
                const active = l.href === "/" ? pathname === "/" : isActive(l.href);
                return (
                  <li key={l.href} className="animate-fade-up" style={{ animationDelay: `${40 + i * 35}ms` }}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "flex min-h-12 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold transition",
                        active ? "bg-primary-soft text-primary-strong" : "text-ink hover:bg-ink/5",
                      )}
                    >
                      <span className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", active ? "bg-primary text-primary-ink" : "bg-ink/5 text-ink-muted")}>
                        <Icon name={l.icon} size={18} />
                      </span>
                      <span className="flex-1">{id ? l.id : l.en}</span>
                      <Icon name="chevron-right" size={18} className="text-ink-soft" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-3 border-t border-line p-4">
              {socials.length > 0 &&
                socialIcons(
                  "gap-2",
                  "flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-muted transition hover:border-primary hover:bg-primary-soft hover:text-primary-strong",
                )}
              <div className="flex items-center justify-between gap-3">
                {langToggle()}
                <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary">
                  {id ? "Gabung" : "Join Us"} <Icon name="arrow-right" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}