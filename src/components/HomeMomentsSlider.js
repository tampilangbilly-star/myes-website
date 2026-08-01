"use client";
import { useState, useEffect, useRef } from "react";

const AUTOPLAY_MS = 4500;
const FADE_MS = 400;

export default function HomeMomentsSlider({ moments }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("in");
  const [cycle, setCycle] = useState(0);
  const [hovered, setHovered] = useState(false);
  const hoverRef = useRef(false);

  const total = moments?.length || 0;

  const goTo = (nextIdx) => {
    if (total <= 1) return;
    setPhase("out");
    setTimeout(() => {
      setIndex(((nextIdx % total) + total) % total);
      setPhase("in");
      setCycle((c) => c + 1);
    }, FADE_MS);
  };

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      if (hoverRef.current) return;
      if (document.visibilityState !== "visible") return;
      setPhase("out");
      setTimeout(() => {
        setIndex((i) => (i + 1) % total);
        setPhase("in");
        setCycle((c) => c + 1);
      }, FADE_MS);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [total]);

  if (!moments || total === 0) return null;

  const current = moments[index];
  const isOut = phase === "out";

  return (
    <div
      className="hm-slider-card"
      onMouseEnter={() => { hoverRef.current = true; setHovered(true); }}
      onMouseLeave={() => { hoverRef.current = false; setHovered(false); }}
      onClick={() => goTo(index + 1)}
      role={total > 1 ? "button" : undefined}
      aria-label={total > 1 ? "Foto kegiatan berikutnya" : undefined}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hm-slider-card {
          position: relative;
          overflow: hidden;
          width: min(240px, 45vw);
          aspect-ratio: 3 / 4;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 20px 45px -12px rgba(0, 0, 0, 0.55);
          cursor: ${total > 1 ? "pointer" : "default"};
        }
        @media (max-width: 480px) {
          /* Diperkecil ukurannya untuk HP agar muat di area BG atas */
          .hm-slider-card { width: min(150px, 35vw); border-radius: 12px; }
        }
        .hm-slider-progress {
          position: absolute; top: 0; left: 0; height: 3px; width: 100%;
          transform-origin: left;
          background: linear-gradient(90deg, #d4a941, #f0cf7e);
          animation: hmProgress ${AUTOPLAY_MS}ms linear forwards;
          animation-play-state: ${hovered ? "paused" : "running"};
          z-index: 2;
        }
        @keyframes hmProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .hm-slider-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          opacity: ${isOut ? 0 : 1};
          transform: ${isOut ? "scale(1.03)" : "scale(1)"};
          transition: opacity ${FADE_MS}ms ease, transform ${FADE_MS + 300}ms cubic-bezier(0.22,1,0.36,1);
        }
        .hm-slider-dots {
          position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 5px; z-index: 2;
        }
        .hm-slider-dot {
          height: 5px; border-radius: 99px;
          background: rgba(255,255,255,0.35);
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .hm-slider-dot.active { background: #fff; width: 16px; }
        .hm-slider-dot:not(.active) { width: 5px; }
        @media (prefers-reduced-motion: reduce) {
          .hm-slider-progress { animation: none !important; }
          .hm-slider-img { transition: none !important; }
        }
      `,
        }}
      />
      {total > 1 && <span key={cycle} className="hm-slider-progress" aria-hidden="true" />}
      <img className="hm-slider-img" src={current.image} alt="" />
      {total > 1 && (
        <div className="hm-slider-dots" aria-hidden="true">
          {moments.map((_, i) => (
            <span key={i} className={`hm-slider-dot ${i === index ? "active" : ""}`} />
          ))}
        </div>
      )}
    </div>
  );
}