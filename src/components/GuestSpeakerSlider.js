"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * GuestSpeakerSlider v2 — kartu kaca pembicara tamu di atas Hero.
 *
 * Perbaikan bug autoplay versi lama:
 * • Dulu: onTouchStart => pause, dan HANYA onTouchEnd yang resume.
 *   Di Android, scroll yang dimulai dari kartu memicu `touchcancel`
 *   (bukan touchend) → isPaused terkunci true → slider mati permanen.
 * • Kini: interval berjalan TERUS; tick hanya dilewati saat hover
 *   desktop atau tab tersembunyi. Sentuhan di HP tidak pernah bisa
 *   mematikan autoplay — tap justru memajukan slide secara manual.
 *
 * Upgrade desain: progress bar autoplay di header, crossfade halus
 * (fade + lift, tanpa lemparan 120% yang kasar), dots pil aktif.
 * Props tidak berubah: { speakers, lang }.
 */
const AUTOPLAY_MS = 6000;
const FADE_MS = 450;

export default function GuestSpeakerSlider({ speakers, lang }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("in"); // "in" | "out"
  const [cycle, setCycle] = useState(0); // restart animasi progress bar
  const [hovered, setHovered] = useState(false); // pause visual progress bar
  const hoverRef = useRef(false); // pause hanya untuk hover desktop

  const total = speakers?.length || 0;

  const goTo = useCallback(
    (nextIdx) => {
      if (total <= 1) return;
      setPhase("out");
      setTimeout(() => {
        setCurrentIndex(((nextIdx % total) + total) % total);
        setPhase("in");
        setCycle((c) => c + 1);
      }, FADE_MS);
    },
    [total],
  );

  /* Autoplay yang tidak bisa macet: interval hidup terus, tick di-skip
     saat hover desktop / tab hidden — tidak ada state pause yang bisa
     tertinggal true. */
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      if (hoverRef.current) return; // hover desktop
      if (document.visibilityState !== "visible") return; // tab tersembunyi
      setPhase("out");
      setTimeout(() => {
        setCurrentIndex((idx) => (idx + 1) % total);
        setPhase("in");
        setCycle((c) => c + 1);
      }, FADE_MS);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [total]);

  if (!speakers || total === 0) return null;

  const current = speakers[currentIndex];
  const isOut = phase === "out";

  return (
    <div
      className="speaker-glass-card"
      onMouseEnter={() => {
        hoverRef.current = true;
        setHovered(true);
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
        setHovered(false);
      }}
      onClick={() => goTo(currentIndex + 1)}
      role={total > 1 ? "button" : undefined}
      aria-label={total > 1 ? "Next guest speaker" : undefined}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        borderRadius: "20px",
        padding: "1.2rem 1.5rem",
        width: "min(360px, calc(100vw - 2.5rem))",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        color: "white",
        cursor: total > 1 ? "pointer" : "default",
      }}
    >
      {/* PROGRESS BAR AUTOPLAY (restart tiap pergantian slide) */}
      {total > 1 && (
        <span
          key={cycle}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "3px",
            width: "100%",
            transformOrigin: "left",
            background: "linear-gradient(90deg, #3b82f6, #93c5fd)",
            animation: `gsProgress ${AUTOPLAY_MS}ms linear forwards`,
            animationPlayState: hovered ? "paused" : "running",
          }}
        />
      )}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes gsProgress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .speaker-glass-card [style*="gsProgress"] { animation: none !important; }
        }
      `,
        }}
      />

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <span
          style={{
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            color: "#3b82f6",
            padding: "0.3rem 0.8rem",
            borderRadius: "30px",
            fontSize: "0.8rem",
            fontWeight: "bold",
          }}
        >
          🎤 {lang === "id" ? "Pembicara Tamu" : "Guest Speaker"}
        </span>

        <div style={{ display: "flex", gap: "5px" }}>
          {speakers.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === currentIndex ? "18px" : "6px",
                height: "6px",
                borderRadius: "99px",
                backgroundColor:
                  i === currentIndex ? "#3b82f6" : "rgba(255,255,255,0.25)",
                transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          ))}
        </div>
      </div>

      {/* KONTEN — crossfade halus (fade + lift) */}
      <div
        style={{
          opacity: isOut ? 0 : 1,
          transform: isOut ? "translateY(10px) scale(0.985)" : "none",
          transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        {/* FOTO PEMBICARA */}
        <div
          style={{
            width: "100%",
            height: "clamp(210px, 60vw, 280px)",
            borderRadius: "12px",
            overflow: "hidden",
            marginBottom: "1rem",
            border: "2px solid rgba(255,255,255,0.05)",
          }}
        >
          <img
            src={`${current.image}`}
            alt={current.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        </div>

        {/* DETAIL PEMBICARA */}
        <h4
          style={{
            fontSize: "1.15rem",
            fontWeight: "bold",
            margin: "0 0 0.3rem 0",
            color: "#fff",
            lineHeight: "1.3",
          }}
        >
          {current.name}
        </h4>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "0.85rem",
            margin: "0 0 0.8rem 0",
            lineHeight: "1.4",
          }}
        >
          {current.origin}
        </p>
        <p
          style={{
            color: "#e2e8f0",
            fontSize: "0.8rem",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          📅{" "}
          {new Date(current.dateServed).toLocaleDateString(
            lang === "id" ? "id-ID" : "en-US",
            { day: "numeric", month: "long", year: "numeric" },
          )}
        </p>
      </div>
    </div>
  );
}
