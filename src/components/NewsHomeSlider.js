"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import SmartImage from "./SmartImage";
import Icon from "./Icon";
import { formatDate, t } from "@/lib/format";

/** Deck flyer berita di beranda: foto utuh (4:5), berganti tiap 5 detik, berhenti saat disentuh/hover. */
export default function NewsHomeSlider({ items = [], lang = "en" }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const count = items.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => document.visibilityState === "visible" && setI((c) => (c + 1) % count), 5000);
    return () => clearInterval(timer);
  }, [count, paused]);

  if (!count) return null;
  const item = items[i % count];
  const move = (d) => setI((c) => (c + d + count) % count);

  return (
    <div className="mx-auto w-full max-w-md" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative">
        {/* Tumpukan kartu di belakang untuk kesan "deck" */}
        <div aria-hidden className="absolute inset-x-6 -bottom-3 top-3 rotate-3 rounded-3xl bg-primary/10" />
        <div aria-hidden className="absolute inset-x-3 -bottom-1.5 top-1.5 -rotate-2 rounded-3xl bg-gold/15" />
        <div className="card relative p-3 sm:p-4">
          <Link
            href="/news"
            className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-bg"
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
              setPaused(true);
            }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
            }}
          >
            {items.map((n, k) =>
              n.image ? (
                <div key={n.id} className={clsx("absolute inset-0 transition-opacity duration-700", k === i ? "opacity-100" : "opacity-0")} aria-hidden={k !== i}>
                  <SmartImage src={n.image} alt={k === i ? t(n, "title", lang) : ""} fill sizes="(min-width:640px) 420px, 90vw" className="object-contain" />
                </div>
              ) : (
                k === i && (
                  <div key={n.id} className="absolute inset-0 flex items-center justify-center text-primary">
                    <Icon name="news" size={56} />
                  </div>
                )
              ),
            )}
            <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-ink shadow-card">{t(item, "tag", lang) || "News"}</span>
          </Link>
          <div className="px-1 pb-1 pt-4">
            <h3 key={item.id} className="animate-fade-up line-clamp-2 text-lg font-bold leading-snug">
              {t(item, "title", lang)}
            </h3>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
                <Icon name="calendar" size={16} /> {formatDate(item.publishedAt || item.createdAt, lang)}
              </span>
              {count > 1 && (
                <div className="flex items-center">
                  <button type="button" onClick={() => move(-1)} className="icon-btn" aria-label={lang === "id" ? "Sebelumnya" : "Previous"}>
                    <Icon name="chevron-left" />
                  </button>
                  <span className="min-w-[3ch] text-center text-sm tabular-nums text-ink-muted">
                    {i + 1}/{count}
                  </span>
                  <button type="button" onClick={() => move(1)} className="icon-btn" aria-label={lang === "id" ? "Berikutnya" : "Next"}>
                    <Icon name="chevron-right" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
