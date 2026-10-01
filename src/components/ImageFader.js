"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import SmartImage from "./SmartImage";

/** Beberapa foto berganti dengan fade (bisa di-swipe). Dipakai kartu program & mission trip. */
export default function ImageFader({ images = [], alt = "", fit = "cover", interval = 4000, sizes = "(min-width:1024px) 33vw, 100vw", className = "", dots = true, priority = false }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const count = images.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => document.visibilityState === "visible" && setI((c) => (c + 1) % count), interval);
    return () => clearInterval(t);
  }, [count, paused, interval]);

  if (!count) return null;
  return (
    <div
      className={clsx("relative overflow-hidden", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) setI((c) => (c + (dx < 0 ? 1 : -1) + count) % count);
      }}
    >
      {images.map((src, k) => (
        <div key={src + k} className={clsx("absolute inset-0 transition-opacity duration-700", k === i ? "opacity-100" : "opacity-0")} aria-hidden={k !== i}>
          <SmartImage src={src} alt={k === i ? `${alt} ${k + 1}` : ""} fill sizes={sizes} priority={priority && k === 0} className={fit === "contain" ? "object-contain" : "object-cover"} />
        </div>
      ))}
      {dots && count > 1 && (
        <div className="absolute inset-x-0 bottom-2 flex justify-center">
          <div className="flex items-center gap-1 rounded-full bg-ink/40 px-2 py-1 backdrop-blur">
            {images.map((_, k) => (
              <button key={k} type="button" onClick={() => setI(k)} aria-label={`${alt} ${k + 1}`} className="flex h-5 w-4 items-center justify-center">
                <span className={clsx("block h-1.5 rounded-full transition-all", k === i ? "w-3.5 bg-white" : "w-1.5 bg-white/60")} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
