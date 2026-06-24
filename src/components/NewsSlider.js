"use client";
import { useState, useEffect } from "react";

export default function NewsSlider({ items, lang }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const t = (item, f) =>
    lang === "id" ? item[f + "Id"] || item[f + "En"] : item[f + "En"];

  useEffect(() => {
    if (!items || items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) {
    return (
      <p style={{ color: "#cbd5e1" }}>Slider: Data berita tidak ditemukan.</p>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "700px",
        margin: "0 auto",
        overflow: "hidden",
        borderRadius: "16px",
        backgroundColor: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          transition: "transform 0.6s ease-in-out",
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {items.map((n, index) => (
          <div
            key={n.id || index}
            style={{ minWidth: "100%", boxSizing: "border-box" }}
          >
            {/* BAGIAN GAMBAR PORTRAIT DENGAN EFEK BLUR */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "550px", // Tinggi ekstra untuk slider
                backgroundColor: "#050B14",
                overflow: "hidden",
              }}
            >
              {n.image ? (
                <>
                  {/* 1. Background Blur */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-10%",
                      left: "-10%",
                      right: "-10%",
                      bottom: "-10%",
                      backgroundImage: `url(/uploads/${n.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(25px)",
                      opacity: 0.4,
                      zIndex: 0,
                    }}
                  />
                  {/* 2. Gambar Utama Utuh */}
                  <img
                    src={`/uploads/${n.image}`}
                    alt={t(n, "title")}
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      objectFit: "contain", // Tidak terpotong sama sekali
                      zIndex: 1,
                    }}
                  />
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <span style={{ fontSize: "5rem" }}>📢</span>
                </div>
              )}
            </div>

            {/* BAGIAN TEKS BERITA */}
            <div style={{ padding: "2rem", textAlign: "left" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "0.4rem 1rem",
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  color: "#3b82f6",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                  border: "1px solid rgba(59, 130, 246, 0.5)",
                }}
              >
                {t(n, "tag")}
              </span>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#fff",
                  marginBottom: "1rem",
                  lineHeight: "1.4",
                }}
              >
                {t(n, "title")}
              </h3>
              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {t(n, "content")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* INDIKATOR TITIK (DOTS) DI BAWAH SLIDER */}
      {items.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            padding: "1.5rem",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                backgroundColor:
                  currentIndex === idx ? "#3b82f6" : "rgba(255,255,255,0.2)",
                transition: "background-color 0.3s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
