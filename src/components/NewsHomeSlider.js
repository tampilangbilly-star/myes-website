"use client";
import { useState, useEffect } from "react";

export default function NewsHomeSlider({ items = [], lang = "en" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Jalankan rotasi otomatis setiap 5 detik, HENTIKAN jika isHovered true
  useEffect(() => {
    if (!items || items.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000); // 5000ms = 5 Detik

    return () => clearInterval(interval);
  }, [items, isHovered]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];

  const t = (item, field) => {
    if (!item) return "";
    return lang === "id"
      ? item[field + "Id"] || item[field + "En"] || ""
      : item[field + "En"] || "";
  };

  return (
    <div style={{ width: "100%", maxWidth: "450px", margin: "0 auto" }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .flyer-card {
          background: #050b14;
          border: 1px solid rgba(59, 130, 246, 0.1);
          border-radius: 20px;
          padding: 1rem;
          box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.7), 0 0 30px -5px rgba(59, 130, 246, 0.15);
          transition: all 0.4s ease;
          position: relative;
          cursor: pointer; /* Memberi sinyal ke user bahwa ini interaktif */
        }

        .flyer-card:hover {
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 40px -5px rgba(59, 130, 246, 0.3);
          transform: translateY(-5px);
        }

        .flyer-viewport {
          width: 100%;
          aspect-ratio: 4 / 5;
          background-color: #000;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .flyer-img {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: contain;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
        }

        .flyer-img.active {
          opacity: 1;
        }

        .flyer-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: #3b82f6;
          color: #fff;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          z-index: 10;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .flyer-info-text {
          margin-top: 1rem;
          text-align: left;
          padding: 0 0.5rem;
        }

        .flyer-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 1rem;
        }

        .flyer-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }

        .flyer-dot.active {
          background: #3b82f6;
          width: 18px;
          border-radius: 4px;
        }
      `,
        }}
      />

      {/* Menambahkan onMouseEnter dan onMouseLeave untuk menahan slide */}
      <div
        className="flyer-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flyer-viewport">
          <span className="flyer-badge">{t(currentItem, "tag") || "NEWS"}</span>

          {items.map((n, index) => (
            <img
              key={n.id}
              src={
                n.image
                  ? `${n.image}`
                  : "data:image/svg+xml;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              }
              alt=""
              className={`flyer-img ${index === currentIndex ? "active" : ""}`}
            />
          ))}
        </div>

        <div className="flyer-info-text">
          <h4
            style={{
              color: "#fff",
              margin: "0 0 4px 0",
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            {t(currentItem, "title")}
          </h4>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.85rem" }}>
            {currentItem.publishedAt
              ? new Date(currentItem.publishedAt).toLocaleDateString(
                  lang === "id" ? "id-ID" : "en-US",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )
              : ""}
          </p>
        </div>

        {items.length > 1 && (
          <div className="flyer-dots">
            {items.map((_, idx) => (
              <div
                key={idx}
                className={`flyer-dot ${idx === currentIndex ? "active" : ""}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
