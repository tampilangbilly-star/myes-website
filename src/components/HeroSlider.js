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
            <div className="slide-text text-center-full">
              <h2 className="slide-title">
                Manado Youth
                <br />
                <span className="slide-title-accent">English Service</span>
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
    <section className="hero-slider">
      {slides.map((slide, i) => {
        const isActive = i === current;
        const isPrev = i === prevIndex;

        return (
          <div
            key={slide.id}
            className={`slide ${isActive ? "active" : ""}`}
            style={{
              zIndex: isActive ? 2 : isPrev ? 1 : 0,
              opacity: isActive || isPrev ? 1 : 0,
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            {/* BACKGROUND IMAGE */}
            {slide.backgroundImage ? (
              <div
                className="slide-bg"
                style={{
                  backgroundImage: `url(${slide.backgroundImage})`,
                }}
              />
            ) : (
              <div
                className="slide-bg"
                style={{
                  background: `linear-gradient(135deg, ${slide.backgroundColor || "#0a1628"}, #030812)`,
                }}
              />
            )}

            {/* CINEMATIC OVERLAY */}
            <div className="slide-overlay" />

            {/* KONTEN UTAMA */}
            <div className="slide-content">
              <div className="slide-text">
                {t(slide, "overline") && (
                  <div className="slide-overline">{t(slide, "overline")}</div>
                )}
                <h2 className="slide-title">{t(slide, "title")}</h2>
                {t(slide, "description") && (
                  <p className="slide-desc">{t(slide, "description")}</p>
                )}
                {t(slide, "buttonText") && (
                  <a href={slide.buttonLink || "#"} className="slide-btn">
                    {t(slide, "buttonText")}
                  </a>
                )}
              </div>

              {/* Bagian Slide Image (Kanan) */}
              {slide.image && (
                <div className="slide-image">
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
                className={`dot ${i === current ? "active" : ""}`}
                onClick={() => {
                  setPrevIndex(current);
                  setCurrent(i);
                }}
              />
            ))}
          </div>
          <button className="slider-arrow arrow-left" onClick={prev}>
            {"<"}
          </button>
          <button className="slider-arrow arrow-right" onClick={next}>
            {">"}
          </button>
        </>
      )}
    </section>
  );
}
