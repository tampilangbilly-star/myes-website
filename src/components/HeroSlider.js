"use client";
import { useState, useEffect, useCallback, useRef } from "react";

export default function HeroSlider({ slides, socials, lang = "en" }) {
  const [current, setCurrent] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const total = slides.length;

  const t = (item, field) => {
    if (!item) return "";
    const idF = field + "Id";
    const enF = field + "En";
    return lang === "id" ? item[idF] || item[enF] || "" : item[enF] || "";
  };

  const next = useCallback(() => {
    setPrevIndex(current);
    setCurrent((c) => (c + 1) % total);
  }, [current, total]);

  const prev = useCallback(() => {
    setPrevIndex(current);
    setCurrent((c) => (c - 1 + total) % total);
  }, [current, total]);

  /* ── Swipe gesture (mobile UX — panah disembunyikan di layar kecil) ── */
  const touchX = useRef(null);
  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(delta) < 45) return; // abaikan tap/geser kecil
    if (delta < 0) next();
    else prev();
  };

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      // Hemat baterai & hindari lompatan slide saat tab tidak terlihat
      if (document.visibilityState === "visible") next();
    }, 5000);
    return () => clearInterval(timer);
  }, [next, total]);

  /* ── Fallback jika belum ada slide di database ─────────────────── */
  if (total === 0) {
    return (
      <section className="hero-slider">
        <div className="slide active">
          <div
            className="slide-bg"
            style={{ background: "linear-gradient(135deg,#0a1628,#1a5276)" }}
          />
          <div className="slide-overlay" />
          <div className="slide-content">
            <div
              className="slide-text"
              style={{ textAlign: "center", maxWidth: "100%" }}
            >
              <h2 className="slide-title">
                Manado Youth
                <br />
                <span style={{ color: "var(--gold-light)" }}>
                  English Service
                </span>
              </h2>
              <p className="slide-desc">
                {lang === "id"
                  ? "Belajar Bahasa Inggris melalui ibadah dan komunitas."
                  : "Learn English through worship and community."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="hero-slider"
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        backgroundColor: "#030812",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((slide, i) => {
        const isActive = i === current;
        const isPrev = i === prevIndex;

        return (
          <div
            key={slide.id}
            className={`hs-slide ${isActive ? "is-active" : ""} ${
              !isActive && isPrev ? "is-prev" : ""
            }`}
          >
            {/* ZONA MEDIA — desktop: background cover seperti biasa;
                mobile: <img> foto UTUH dalam alur dokumen + ambient blur.
                Struktur flow membuat teks TIDAK MUNGKIN menimpa foto. */}
            <div
              className={`hs-media ${slide.backgroundImage ? "has-photo" : ""}`}
            >
              {slide.backgroundImage ? (
                <>
                  <div
                    className="hs-bg-blur"
                    aria-hidden="true"
                    style={{ backgroundImage: `url(${slide.backgroundImage})` }}
                  />
                  <img
                    className="hs-photo"
                    src={slide.backgroundImage}
                    alt={t(slide, "title") || "M-YES"}
                  />
                  <div
                    className="hs-bg"
                    style={{ backgroundImage: `url(${slide.backgroundImage})` }}
                  />
                </>
              ) : (
                <div
                  className="hs-bg"
                  style={{
                    background: `linear-gradient(135deg, ${
                      slide.backgroundColor || "#0a1628"
                    }, #030812)`,
                  }}
                />
              )}
            </div>

            {/* CINEMATIC OVERLAY */}
            <div className="hs-overlay" />

            {/* KONTEN UTAMA */}
            <div className="hs-inner">
              <div className="hs-text" key={isActive ? `txt-${i}` : `off-${i}`}>
                {t(slide, "overline") && (
                  <div className="hs-overline hs-anim hs-anim-1">
                    {t(slide, "overline")}
                  </div>
                )}
                <h2 className="hs-title hs-anim hs-anim-2">
                  {t(slide, "title")}
                </h2>
                {t(slide, "description") && (
                  <p className="hs-desc hs-anim hs-anim-3">
                    {t(slide, "description")}
                  </p>
                )}
                {t(slide, "buttonText") && (
                  <div className="hs-anim hs-anim-4">
                    <a href={slide.buttonLink || "#"} className="hs-btn">
                      {t(slide, "buttonText")}
                    </a>
                  </div>
                )}
              </div>

              {/* Bagian Slide Image (Kanan) */}
              {slide.image && (
                <div className="hs-image hs-anim hs-anim-3">
                  <img src={slide.image} alt={t(slide, "title")} />
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Scroll cue elegan */}
      <div className="hs-scroll-cue" aria-hidden="true" />

      {total > 1 && (
        <>
          <div className="slider-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                className={`dot ${i === current ? "active" : ""}`}
                onClick={() => {
                  setPrevIndex(current);
                  setCurrent(i);
                }}
              />
            ))}
          </div>
          <button
            className="slider-arrow arrow-left"
            aria-label="Previous slide"
            onClick={prev}
          >
            {"<"}
          </button>
          <button
            className="slider-arrow arrow-right"
            aria-label="Next slide"
            onClick={next}
          >
            {">"}
          </button>
        </>
      )}
    </section>
  );
}
