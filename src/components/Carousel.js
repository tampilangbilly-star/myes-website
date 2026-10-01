"use client";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Icon from "./Icon";

/**
 * Carousel scroll-snap: swipe native (mulus di Android), titik indikator mengikuti posisi,
 * tombol panah di desktop, opsional autoplay (berhenti saat disentuh/hover).
 */
export default function Carousel({ children, itemClassName = "w-[82%] sm:w-[48%] lg:w-[32%]", autoplay = 0, labels = {}, className = "", dots = true }) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = Children.count(children);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el || !el.children.length) return;
    const w = el.children[0].getBoundingClientRect().width + 16;
    setActive(Math.min(count - 1, Math.round(el.scrollLeft / w)));
  }, [count]);

  const go = useCallback(
    (i) => {
      const el = ref.current;
      const target = el?.children[((i % count) + count) % count];
      if (el && target) el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: "smooth" });
    },
    [count],
  );

  useEffect(() => {
    if (!autoplay || paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => document.visibilityState === "visible" && go(active + 1), autoplay);
    return () => clearInterval(t);
  }, [autoplay, paused, count, active, go]);

  return (
    <div className={clsx("relative", className)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)}>
      <div ref={ref} onScroll={onScroll} className="snap-row pb-2">
        {Children.map(children, (child, i) => (
          <div className={itemClassName} aria-roledescription="slide" aria-label={`${i + 1} / ${count}`}>
            {child}
          </div>
        ))}
      </div>
      {count > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3">
          {dots ? (
            <div className="flex items-center gap-1" role="tablist" aria-label={labels.dots || "Slides"}>
              {Array.from({ length: count }).map((_, i) => (
                <button key={i} type="button" role="tab" aria-selected={i === active} aria-label={`${labels.goTo || "Go to slide"} ${i + 1}`} onClick={() => go(i)} className="flex h-11 w-6 items-center justify-center">
                  <span className={clsx("block h-2 rounded-full transition-all duration-300", i === active ? "w-6 bg-primary" : "w-2 bg-ink/20")} />
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          <div className="hidden gap-2 sm:flex">
            <button type="button" className="icon-btn border border-line bg-surface" aria-label={labels.prev || "Previous"} onClick={() => go(active - 1)}>
              <Icon name="chevron-left" />
            </button>
            <button type="button" className="icon-btn border border-line bg-surface" aria-label={labels.next || "Next"} onClick={() => go(active + 1)}>
              <Icon name="chevron-right" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
