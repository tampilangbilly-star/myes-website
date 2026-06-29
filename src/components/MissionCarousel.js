"use client";
import { useState, useEffect } from "react";

export default function MissionCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Efek untuk mengganti gambar otomatis setiap 3 detik
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "400px", // Tinggi tetap agar rapi
        overflow: "hidden",
        borderRadius: "12px",
        backgroundColor: "#000", // Latar hitam agar foto ukuran apapun menyatu
        marginTop: "1.5rem",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
      }}
    >
      {images.map((img, index) => (
        <img
          key={index}
          src={`${img}`}
          alt={`Mission Trip ${index + 1}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain" /* KUNCI: Gambar tidak akan terpotong */,
            opacity: index === currentIndex ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
          }}
        />
      ))}

      {/* Titik Indikator di bawah gambar (hanya muncul jika gambar > 1) */}
      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "15px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            zIndex: 10,
          }}
        >
          {images.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor:
                  idx === currentIndex ? "#3b82f6" : "rgba(255,255,255,0.4)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
