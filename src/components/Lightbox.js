"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import SmartImage from "./SmartImage";
import Icon from "./Icon";

/** Grid foto rapat (3 kolom di HP) + lightbox: swipe, panah keyboard, Esc, unduh. */
export default function Lightbox({ images = [], lang = "en", alt = "Photo", cols = "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5", limit }) {
  const [index, setIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const touchX = useRef(null);
  const close = useCallback(() => setIndex(null), []);
  const move = useCallback((d) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (index === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, move]);

  if (!images.length) return null;
  const visible = limit && !showAll ? images.slice(0, limit) : images;

  return (
    <>
      <ul className={`grid gap-1.5 sm:gap-2.5 ${cols}`}>
        {visible.map((src, i) => (
          <li key={src + i}>
            <button type="button" onClick={() => setIndex(i)} className="group relative block aspect-square w-full overflow-hidden rounded-lg bg-line/50 sm:rounded-xl" aria-label={`${lang === "id" ? "Perbesar foto" : "Enlarge photo"} ${i + 1}`}>
              <SmartImage src={src} alt={`${alt} ${i + 1}`} fill sizes="(min-width:1024px) 20vw, (min-width:640px) 25vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
            </button>
          </li>
        ))}
      </ul>
      {limit && images.length > limit && !showAll && (
        <button type="button" onClick={() => setShowAll(true)} className="btn-soft btn-sm mt-3">
          {lang === "id" ? `Lihat semua (${images.length})` : `Show all (${images.length})`}
        </button>
      )}

      {index !== null && (
        <div
          className="animate-fade-in fixed inset-0 z-[80] flex flex-col bg-ink/95 text-white"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between p-2 pt-[max(8px,env(safe-area-inset-top))]">
            <span className="px-3 text-sm tabular-nums opacity-80">
              {index + 1} / {images.length}
            </span>
            <div className="flex gap-1">
              <a href={images[index]} download target="_blank" rel="noopener noreferrer" className="icon-btn text-white hover:bg-white/10 hover:text-white" aria-label={lang === "id" ? "Unduh foto" : "Download photo"}>
                <Icon name="download" />
              </a>
              <button type="button" className="icon-btn text-white hover:bg-white/10 hover:text-white" aria-label={lang === "id" ? "Tutup" : "Close"} onClick={close} autoFocus>
                <Icon name="close" size={24} />
              </button>
            </div>
          </div>
          <div className="relative flex-1" onClick={close}>
            <SmartImage key={images[index]} src={images[index]} alt={`${alt} ${index + 1}`} fill sizes="100vw" className="animate-fade-in object-contain" onClick={(e) => e.stopPropagation()} />
          </div>
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-6 p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
              <button type="button" className="icon-btn text-white hover:bg-white/10 hover:text-white" aria-label={lang === "id" ? "Sebelumnya" : "Previous"} onClick={() => move(-1)}>
                <Icon name="chevron-left" size={26} />
              </button>
              <button type="button" className="icon-btn text-white hover:bg-white/10 hover:text-white" aria-label={lang === "id" ? "Berikutnya" : "Next"} onClick={() => move(1)}>
                <Icon name="chevron-right" size={26} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
