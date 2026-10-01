"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import clsx from "clsx";
import Icon from "../Icon";
import ThemeSwitcher from "../ThemeSwitcher";
import { UIProvider } from "./UIProvider";

export const NAV = [
  { group: "Utama", items: [{ href: "/admin", label: "Dashboard", icon: "grid" }] },
  {
    group: "Beranda",
    items: [
      { href: "/admin/slides", label: "Hero Slider", icon: "image" },
      { href: "/admin/guest-speakers", label: "Guest Speaker", icon: "mic" },
      { href: "/admin/home-moments", label: "Momen Beranda", icon: "camera" },
    ],
  },
  {
    group: "Konten",
    items: [
      { href: "/admin/personnel", label: "Personalia", icon: "users" },
      { href: "/admin/programs", label: "Program", icon: "book" },
      { href: "/admin/activities", label: "Jadwal Jumat", icon: "clock" },
      { href: "/admin/weekly-activities", label: "Galeri Mingguan", icon: "video" },
      { href: "/admin/missions", label: "Mission Trip", icon: "plane" },
      { href: "/admin/care", label: "M-YES Care", icon: "heart" },
      { href: "/admin/news", label: "Berita", icon: "news" },
    ],
  },
  {
    group: "Lainnya",
    items: [
      { href: "/admin/messages", label: "Pesan Masuk", icon: "inbox", badge: "unread" },
      { href: "/admin/settings", label: "Pengaturan", icon: "settings" },
      { href: "/admin/account", label: "Akun & Password", icon: "lock" },
    ],
  },
];

const BOTTOM = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/slides", label: "Slider", icon: "image" },
  { href: "/admin/news", label: "Berita", icon: "news" },
  { href: "/admin/messages", label: "Pesan", icon: "inbox", badge: "unread" },
];

const COLLAPSE_KEY = "myes-admin-sidebar";

export default function AdminShell({ user, unread = 0, children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);

  // Ingat posisi sidebar (dibaca setelah mount agar tidak mismatch saat hydrate)
  useEffect(() => {
    let saved = null;
    try {
      saved = localStorage.getItem(COLLAPSE_KEY);
    } catch {}
    if (saved === "1") {
      const f = requestAnimationFrame(() => setCollapsed(true));
      return () => cancelAnimationFrame(f);
    }
  }, []);
  const toggle = () =>
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      } catch {}
      return !c;
    });

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setDrawer(false);
  }

  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  const isActive = (href) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/"));
  const logout = () => signOut({ callbackUrl: "/admin/login" });

  const renderNav = (compact = false) => (
    <nav aria-label="Menu admin" className="space-y-4">
      {NAV.map((g) => (
        <div key={g.group}>
          {!compact && <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">{g.group}</p>}
          {compact && <div className="mx-3 mb-2 h-px bg-line first:hidden" />}
          <ul className="space-y-0.5">
            {g.items.map((it) => {
              const active = isActive(it.href);
              const badge = it.badge === "unread" && unread > 0 ? unread : 0;
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    title={compact ? it.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "group relative flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition",
                      compact && "justify-center px-0",
                      active ? "bg-primary text-primary-ink shadow-sm" : "text-ink-muted hover:bg-ink/5 hover:text-ink",
                    )}
                  >
                    <Icon name={it.icon} size={19} className="shrink-0" />
                    {!compact && <span className="flex-1 truncate">{it.label}</span>}
                    {badge > 0 && (
                      <span className={clsx("rounded-full px-1.5 text-[11px] font-bold leading-5", active ? "bg-white text-primary-strong" : "bg-danger text-white", compact && "absolute right-1 top-1 min-w-5 text-center")}>{badge > 99 ? "99+" : badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <UIProvider>
      <div className="min-h-dvh bg-bg lg:flex">
        {/* SIDEBAR DESKTOP */}
        <aside className={clsx("sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-300 lg:flex", collapsed ? "w-[76px]" : "w-64")}>
          <div className={clsx("flex h-16 items-center gap-2.5 border-b border-line px-4", collapsed && "justify-center px-0")}>
            <Image src="/logo-myes.png" alt="" width={36} height={36} className="h-9 w-9 shrink-0" />
            {!collapsed && (
              <span className="min-w-0 leading-tight">
                <span className="block font-display font-extrabold">M-YES Admin</span>
                <span className="block truncate text-xs text-ink-soft">{user.email}</span>
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {renderNav(collapsed)}
          </div>
          <div className="space-y-1 border-t border-line p-3">
            <button type="button" onClick={toggle} className={clsx("btn-ghost w-full justify-start", collapsed && "justify-center px-0")} aria-label={collapsed ? "Lebarkan sidebar" : "Ciutkan sidebar"}>
              <Icon name="sidebar" size={19} /> {!collapsed && "Ciutkan"}
            </button>
            <button type="button" onClick={logout} className={clsx("btn-ghost w-full justify-start text-danger hover:bg-danger/10 hover:text-danger", collapsed && "justify-center px-0")} aria-label="Keluar">
              <Icon name="logout" size={19} /> {!collapsed && "Keluar"}
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* TOPBAR */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-line bg-surface/95 px-4 backdrop-blur sm:px-6">
            <Link href="/admin" className="flex items-center gap-2 lg:hidden">
              <Image src="/logo-myes.png" alt="" width={32} height={32} className="h-8 w-8" />
              <span className="font-display font-extrabold">Admin</span>
            </Link>
            <div className="ml-auto flex items-center gap-1">
              <a href="/" target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm hidden sm:inline-flex">
                <Icon name="external" size={16} /> Lihat website
              </a>
              <ThemeSwitcher lang="id" />
              <button type="button" onClick={logout} className="icon-btn hidden sm:inline-flex lg:hidden" aria-label="Keluar">
                <Icon name="logout" />
              </button>
            </div>
          </header>

          <main id="main" className="flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>

        {/* NAVIGASI BAWAH (HP/TABLET) */}
        <nav aria-label="Navigasi cepat" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-safe backdrop-blur lg:hidden">
          <ul className="grid grid-cols-5">
            {BOTTOM.map((it) => {
              const active = isActive(it.href);
              return (
                <li key={it.href}>
                  <Link href={it.href} aria-current={active ? "page" : undefined} className={clsx("relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold", active ? "text-primary-strong" : "text-ink-soft")}>
                    <span className={clsx("flex h-8 w-12 items-center justify-center rounded-full transition", active && "bg-primary-soft")}>
                      <Icon name={it.icon} size={20} />
                    </span>
                    {it.label}
                    {it.badge === "unread" && unread > 0 && <span className="absolute right-[18%] top-2 min-w-[18px] rounded-full bg-danger px-1 text-center text-[10px] font-bold leading-[18px] text-white">{unread > 99 ? "99+" : unread}</span>}
                  </Link>
                </li>
              );
            })}
            <li>
              <button type="button" onClick={() => setDrawer(true)} aria-expanded={drawer} className="flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold text-ink-soft">
                <span className="flex h-8 w-12 items-center justify-center rounded-full">
                  <Icon name="menu" size={20} />
                </span>
                Menu
              </button>
            </li>
          </ul>
        </nav>

        {/* DRAWER MENU LENGKAP (bottom sheet) */}
        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu admin">
            <button type="button" tabIndex={-1} aria-label="Tutup menu" className="animate-fade-in absolute inset-0 bg-ink/45" onClick={() => setDrawer(false)} />
            <div className="animate-sheet-up absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-3xl bg-surface shadow-lift">
              <div aria-hidden className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-ink/15" />
              <div className="flex items-center justify-between px-5 pb-2 pt-3">
                <div className="min-w-0">
                  <p className="font-display font-extrabold">Menu Admin</p>
                  <p className="truncate text-xs text-ink-soft">{user.email}</p>
                </div>
                <button type="button" className="icon-btn" onClick={() => setDrawer(false)} aria-label="Tutup menu" autoFocus>
                  <Icon name="close" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 pb-3">
                {renderNav()}
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-line p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
                <a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <Icon name="external" size={18} /> Website
                </a>
                <button type="button" onClick={logout} className="btn-outline text-danger">
                  <Icon name="logout" size={18} /> Keluar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UIProvider>
  );
}
