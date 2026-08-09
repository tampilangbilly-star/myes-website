"use client";
import { useState, useEffect } from "react";

export default function ProgramCardSlider({ images, emoji }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Jika gambar kurang dari 2, tidak perlu jalankan interval
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Gambar berpindah otomatis setiap 4 detik

    return () => clearInterval(timer);
  }, [images]);

  // Jika tidak ada gambar, tampilkan emoji fallback
  if (!images || images.length === 0) {
    return <span className="emoji-hero">{emoji}</span>;
  }

  return (
    <>
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Program image ${idx + 1}`}
          style={{
            position: idx === 0 ? "relative" : "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: idx === currentIndex ? 1 : 0,
            transition: "opacity 1s ease-in-out, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
            zIndex: idx === currentIndex ? 1 : 0,
          }}
        />
      ))}
    </>
  );
}