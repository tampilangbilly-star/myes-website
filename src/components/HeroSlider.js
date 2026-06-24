"use client";
import { useState, useEffect, useCallback } from "react";

export default function HeroSlider({ slides, socials, lang = "en" }) {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const t = (item, field) => {
    if (!item) return "";
    const idF = field + "Id";
    const enF = field + "En";
    return lang === "id" ? item[idF] || item[enF] || "" : item[enF] || "";
  };

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = () => setCurrent((c) => (c - 1 + total) % total);

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

  // Di dalam src/components/HeroSlider.js
  // ... (pertahankan logika interval dan state Anda)

  return (
    <section
      className="hero-slider"
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 1.2s ease-in-out",
            zIndex: i === current ? 1 : 0,
          }}
        >
          {/* 1. BACKGROUND IMAGE (Full Screen di belakang) */}
          {slide.backgroundImage ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                backgroundImage: `url(/uploads/${slide.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: i === current ? "scale(1.05)" : "scale(1)",
                transition: "transform 8s ease-out",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                background: `linear-gradient(135deg, ${slide.backgroundColor || "#0a1628"}, #030812)`,
              }}
            />
          )}

          {/* 2. CINEMATIC BLUE OVERLAY (Kaca gelap agar teks terbaca) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              background:
                "linear-gradient(to right, rgba(3,8,18,0.95) 0%, rgba(3,8,18,0.7) 40%, rgba(3,8,18,0.3) 100%)",
            }}
          />

          {/* 3. KONTEN UTAMA (Teks di Kiri, Slide Image di Kanan) */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              height: "100%",
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "4rem",
            }}
          >
            {/* Bagian Teks (Kiri) */}
            <div style={{ flex: 1, maxWidth: "600px" }}>
              {t(slide, "overline") && (
                <div
                  style={{
                    color: "var(--accent-gold)",
                    letterSpacing: "4px",
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    marginBottom: "1.2rem",
                    animation: "fadeInUp 1s ease forwards",
                  }}
                >
                  {t(slide, "overline")}
                </div>
              )}

              <h2
                style={{
                  fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                  color: "#fff",
                  marginBottom: "1.5rem",
                  textShadow: "0 10px 30px rgba(0,0,0,0.8)",
                  animation: "fadeInUp 1.2s ease forwards",
                }}
              >
                {t(slide, "title")}
              </h2>

              {t(slide, "description") && (
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    marginBottom: "2.5rem",
                    animation: "fadeInUp 1.4s ease forwards",
                  }}
                >
                  {t(slide, "description")}
                </p>
              )}

              {t(slide, "buttonText") && (
                <a
                  href={slide.buttonLink || "#"}
                  style={{
                    display: "inline-block",
                    padding: "14px 36px",
                    background: "var(--accent-gold)",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    boxShadow: "0 8px 25px var(--accent-gold-glow)",
                    animation: "fadeInUp 1.6s ease forwards",
                  }}
                >
                  {t(slide, "buttonText")}
                </a>
              )}
            </div>

            {/* Bagian Slide Image (Kanan) */}
            {slide.image && (
              <div
                style={{
                  flex: "0 0 auto",
                  maxWidth: "45%",
                  animation: "fadeInUp 1.5s ease forwards",
                }}
              >
                <img
                  src={`/uploads/${slide.image}`}
                  style={{
                    width: "100%",
                    maxHeight: "500px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transform:
                      "rotate(-2deg)" /* Sedikit miring agar lebih dinamis */,
                  }}
                  alt={slide.titleEn}
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Navigasi Dots & Arrows (tetap dipertahankan) */}
      {total > 1 && (
        <>
          <div className="slider-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === current ? "active" : ""}`}
                onClick={() => setCurrent(i)}
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
