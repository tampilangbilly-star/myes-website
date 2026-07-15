"use client";
import { useState, useEffect, useCallback } from "react";

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

  const prev = () => {
    setPrevIndex(current);
    setCurrent((c) => (c - 1 + total) % total);
  };

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, total]);

  // Dukungan geser (swipe) untuk pengguna Android / layar sentuh
  const [touchStartX, setTouchStartX] = useState(null);

  const onTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const onTouchEnd = (e) => {
    if (touchStartX === null || total <= 1) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) next();
      else prev();
    }
    setTouchStartX(null);
  };

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
      className="hero-slider hs-slider"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((slide, i) => {
        const isActive = i === current;
        const isPrev = i === prevIndex;

        return (
          <div
            key={slide.id}
            className="hs-slide"
            style={{
              zIndex: isActive ? 2 : isPrev ? 1 : 0,
              opacity: isActive || isPrev ? 1 : 0,
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            {/* BACKGROUND IMAGE */}
            {slide.backgroundImage ? (
              <div
                className="hs-bg"
                style={{
                  backgroundImage: `url(${slide.backgroundImage})`,
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
              />
            ) : (
              <div
                className="hs-bg"
                style={{
                  background: `linear-gradient(135deg, ${slide.backgroundColor || "#0a1628"}, #030812)`,
                }}
              />
            )}

            {/* CINEMATIC OVERLAY (responsif: gradasi berubah otomatis di HP via CSS) */}
            <div className="hs-overlay" />

            {/* KONTEN UTAMA */}
            <div className="hs-content">
              <div className="hs-text">
                {t(slide, "overline") && (
                  <div className="hs-overline">{t(slide, "overline")}</div>
                )}
                <h2 className="hs-title">{t(slide, "title")}</h2>
                {t(slide, "description") && (
                  <p className="hs-desc">{t(slide, "description")}</p>
                )}
                {t(slide, "buttonText") && (
                  <a href={slide.buttonLink || "#"} className="hs-btn">
                    {t(slide, "buttonText")}
                  </a>
                )}
              </div>

              {/* Bagian Slide Image (Kanan di desktop, di bawah teks saat HP) */}
              {slide.image && (
                <div className="hs-image">
                  <img src={slide.image} alt={t(slide, "title")} />
                </div>
              )}
            </div>
          </div>
        );
      })}

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
