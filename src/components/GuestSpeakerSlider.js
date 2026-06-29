"use client";
import { useState, useEffect } from "react";

export default function GuestSpeakerSlider({ speakers, lang }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animState, setAnimState] = useState("idle");
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!speakers || speakers.length <= 1) return;

    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setAnimState("out");

        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % speakers.length);
          setAnimState("in");

          setTimeout(() => {
            setAnimState("idle");
          }, 50);
        }, 1500);
      }, 7000);
    }

    return () => clearInterval(interval);
  }, [speakers, isPaused]);

  if (!speakers || speakers.length === 0) return null;

  const current = speakers[currentIndex];

  let cardTransform = "translateX(0) scale(1)";
  let cardOpacity = 1;
  let cardTransition =
    "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease";

  if (animState === "out") {
    cardTransform = "translateX(120%) scale(0.95)";
    cardOpacity = 0;
  } else if (animState === "in") {
    cardTransform = "translateX(120%) scale(0.95)";
    cardOpacity = 0;
    cardTransition = "none";
  }

  return (
    <div
      className="speaker-glass-card"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      style={{
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        borderRadius: "20px",
        padding: "1.2rem 1.5rem", // Padding atas-bawah sedikit dikurangi agar lebih proporsional
        width: "360px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        color: "white",
        transform: cardTransform,
        opacity: cardOpacity,
        transition: cardTransition,
        cursor: "pointer",
      }}
    >
      {/* HEADER GUEST SPEAKER */}
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
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor:
                  i === currentIndex ? "#3b82f6" : "rgba(255,255,255,0.2)",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* FOTO PEMBICARA */}
      <div
        style={{
          width: "100%",
          height: "280px", // KUNCI: Gambar dibesarkan kembali agar porsinya dominan di dalam kartu
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

      {/* TEKS DETAIL PEMBICARA */}
      <div>
        {/* KUNCI: Ukuran font diperkecil (1.15rem) dan baris dirapatkan agar teks panjang tidak makan tempat */}
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
        {/* KUNCI: Deskripsi/Asal juga diperkecil ukurannya menjadi 0.85rem */}
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
