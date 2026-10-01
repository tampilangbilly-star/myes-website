"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import SmartImage from "./SmartImage";
import Icon from "./Icon";

const SEEN_KEY = "myes-popup-seen";

/**
 * Popup sambutan: berita, M-YES Care, dan mission trip terbaru (yang punya gambar).
 * Muncul sekali per sesi browser. HP: bottom sheet; desktop: modal di tengah.
 */
export default function WelcomePopup({ news = [], missions = [], cares = [], lang = "en" }) {
  const id = lang === "id";
  const items = [];
  const latestNews = news.find((n) => n.image);
  if (latestNews)
    items.push({ key: "news-" + latestNews.id, image: latestNews.image, title: (id && latestNews.titleId) || latestNews.titleEn, tag: id ? latestNews.tagId || "Berita Terbaru" : latestNews.tagEn || "Latest News", href: "/news", cta: id ? "Lihat Detail Berita" : "View News Details" });
  const latestCare = cares.find((c) => c.media?.some((m) => m.type === "IMAGE"));
  if (latestCare)
    items.push({ key: "care-" + latestCare.id, image: latestCare.media.find((m) => m.type === "IMAGE").url, title: (id && latestCare.titleId) || latestCare.titleEn, tag: id ? "Aksi Nyata" : "M-YES Care", href: "/care", cta: id ? "Lihat M-YES Care" : "View M-YES Care" });
  const latestMission = missions.find((m) => m.image);
  if (latestMission)
    items.push({ key: "mission-" + latestMission.id, image: latestMission.image, title: (id && latestMission.titleId) || latestMission.titleEn, tag: id ? "Perjalanan Misi" : "Mission Trip", href: "/mission", cta: id ? "Masuk ke Mission Trip" : "Enter Mission Trip" });

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const closeRef = useRef(null);
  const count = items.length;

  useEffect(() => {
    if (!count) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (seen) return;
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, [count]);

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const f = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(f);
    };
  }, [open, close]);

  useEffect(() => {
    if (!open || count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(t);
  }, [open, count, paused]);

  if (!open || !count) return null;
  const item = items[index % count];

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <button type="button" aria-label={id ? "Tutup" : "Close"} tabIndex={-1} onClick={close} className="animate-fade-in absolute inset-0 cursor-default bg-ink/55 backdrop-blur-sm" />
      <div
        className="animate-sheet-up relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-surface shadow-lift sm:max-w-md sm:animate-fade-up sm:rounded-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        {/* Pegangan bottom sheet (HP) */}
        <div aria-hidden className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-ink/15 sm:hidden" />

        <div className="flex items-center justify-between gap-3 px-5 pb-2 pt-3 sm:pt-5">
          <p className="text-sm font-semibold text-ink-muted">{id ? "Selamat datang di M-YES 👋" : "Welcome to M-YES 👋"}</p>
          <button ref={closeRef} type="button" onClick={close} className="icon-btn -mr-2" aria-label={id ? "Tutup" : "Close"}>
            <Icon name="close" />
          </button>
        </div>

        <div className="relative mx-5 aspect-[4/5] max-h-[52dvh] shrink overflow-hidden rounded-2xl bg-bg">
          {items.map((it, i) => (
            <div key={it.key} className={clsx("absolute inset-0 transition-opacity duration-500", i === index ? "opacity-100" : "opacity-0")} aria-hidden={i !== index}>
              <SmartImage src={it.image} alt={i === index ? it.title : ""} fill sizes="(min-width:640px) 420px, 92vw" className="object-contain" />
            </div>
          ))}
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-ink shadow-card">{item.tag}</span>
        </div>

        <div className="px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4">
          <h2 id="welcome-title" key={item.key} className="animate-fade-up line-clamp-2 text-xl font-bold leading-snug">
            {item.title}
          </h2>
          {count > 1 && (
            <div className="mt-2 flex items-center" role="tablist" aria-label={id ? "Pilih info" : "Choose item"}>
              {items.map((it, i) => (
                <button key={it.key} type="button" role="tab" aria-selected={i === index} aria-label={it.tag} onClick={() => setIndex(i)} className="flex h-9 w-6 items-center justify-center">
                  <span className={clsx("block h-1.5 rounded-full transition-all", i === index ? "w-5 bg-primary" : "w-1.5 bg-ink/20")} />
                </button>
              ))}
            </div>
          )}
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <Link href={item.href} onClick={close} className="btn-primary">
              {item.cta} <Icon name="arrow-right" size={18} />
            </Link>
            <button type="button" onClick={close} className="btn-ghost">
              {id ? "Nanti saja" : "Later"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
