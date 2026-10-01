"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import SmartImage from "./SmartImage";
import Icon from "./Icon";
import { formatDate } from "@/lib/format";

/**
 * Kartu guest speaker.
 * - HP/tablet: kartu besar (branding), karena posisinya DI BAWAH foto hero.
 * - Laptop: kartu ringkas & transparan (efek kaca), karena MENUMPUK di atas foto hero
 *   sehingga tidak menutupi gambar terlalu banyak.
 * Berganti tiap 5 detik; setelah disentuh/diklik, ditahan 8 detik lalu jalan lagi.
 */
export default function GuestSpeakerSlider({ speakers = [], lang = "en" }) {
  const [i, setI] = useState(0);
  const touchX = useRef(null);
  const holdUntil = useRef(0);
  const total = speakers.length;
  const id = lang === "id";

  const hold = useCallback(() => {
    holdUntil.current = Date.now() + 8000;
  }, []);

  useEffect(() => {
    if (total < 2) return;
    const t = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() < holdUntil.current) return;
      setI((c) => (c + 1) % total);
    }, 5000);
    return () => clearInterval(t);
  }, [total]);

  if (!total) return null;
  const s = speakers[i % total];
  const move = (d) => {
    hold();
    setI((c) => (c + d + total) % total);
  };

  return (
    <div
      className="card relative overflow-hidden p-4 sm:p-5 lg:border-white/40 lg:bg-surface/80 lg:p-4 lg:shadow-lift lg:backdrop-blur-md"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
        hold();
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
      }}
    >
      {/* Aksen warna tipis di atas kartu */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-strong via-primary to-primary-strong" />

      <div className="flex items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary-strong sm:text-[13px] lg:text-[11px]">
          <Icon name="mic" size={14} /> {id ? "Pembicara Tamu" : "Guest Speaker"}
        </p>
        {total > 1 && (
          <div className="flex items-center" role="tablist" aria-label={id ? "Pilih pembicara" : "Choose speaker"}>
            {speakers.map((sp, k) => (
              <button
                key={sp.id}
                type="button"
                role="tab"
                aria-selected={k === i}
                aria-label={sp.name}
                onClick={() => {
                  hold();
                  setI(k);
                }}
                className="flex h-8 w-5 items-center justify-center lg:w-4"
              >
                <span className={clsx("block h-1.5 rounded-full transition-all", k === i ? "w-4 bg-primary lg:w-3" : "w-1.5 bg-ink/20")} />
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => total > 1 && move(1)}
        className="mt-4 flex w-full items-center gap-4 text-left sm:gap-5 lg:mt-3 lg:gap-4"
        aria-label={total > 1 ? (id ? "Pembicara berikutnya" : "Next guest speaker") : s.name}
        disabled={total < 2}
      >
        {/* Foto potret 4:5; disejajarkan ke atas agar wajah tidak terpotong */}
        <span
          key={s.id}
          className="animate-fade-in relative h-40 w-32 shrink-0 overflow-hidden rounded-2xl bg-line shadow-card ring-2 ring-primary/15 sm:h-[11.25rem] sm:w-36 lg:h-[8.125rem] lg:w-[6.5rem] lg:rounded-xl"
        >
          <SmartImage src={s.image} alt={s.name} fill sizes="(min-width: 1024px) 104px, (min-width: 640px) 144px, 128px" className="object-cover object-top" />
        </span>
        <span key={`t-${s.id}`} className="animate-fade-up min-w-0 flex-1">
          <span className="line-clamp-3 font-display text-lg font-bold leading-snug text-ink sm:text-xl lg:text-base">{s.name}</span>
          {s.origin && <span className="mt-1.5 line-clamp-3 block text-sm leading-relaxed text-ink-muted sm:text-[15px] lg:mt-1 lg:line-clamp-2 lg:text-[13px] lg:leading-snug">{s.origin}</span>}
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-strong sm:text-[13px] lg:mt-2 lg:px-2.5 lg:text-xs">
            <Icon name="calendar" size={13} /> {formatDate(s.dateServed, lang)}
          </span>
        </span>
      </button>
    </div>
  );
}