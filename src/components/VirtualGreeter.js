"use client";
import { useState, useEffect } from "react";

export default function VirtualGreeter({ lang = "en" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Muncul perlahan setelah 2 detik website dimuat
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsOpen(true); // Langsung membuka pesan panggilan
    }, 2000);

    // Otomatis menutup chat bubble setelah 12 detik agar tidak mengganggu bacaan
    const closeTimer = setTimeout(() => {
      setIsOpen(false);
    }, 12000);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        left: "30px",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        gap: "15px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Efek Lambaian Tangan */
        @keyframes waveHand {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60%, 100% { transform: rotate(0deg); }
        }
        
        .waving-hand {
          display: inline-block;
          animation: waveHand 2.5s infinite;
          transform-origin: 70% 70%;
        }

        /* Avatar AI Glowing */
        .ai-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #2563eb, #d6249f);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          position: relative;
          transition: transform 0.3s ease;
          border: 3px solid #050b14;
        }

        .ai-avatar:hover {
          transform: scale(1.1);
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.8);
        }

        /* Lingkaran Pingping Online */
        .online-dot {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          background-color: #22c55e;
          border-radius: 50%;
          border: 2px solid #050b14;
        }

        /* Chat Bubble Ala UI Modern */
        .chat-bubble {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 20px 20px 20px 0;
          padding: 1.2rem;
          width: 260px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.5);
          transform-origin: bottom left;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          opacity: 0;
          transform: scale(0.1);
          pointer-events: none;
        }

        .chat-bubble.open {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }

        /* Tombol Aksi di Dalam Bubble */
        .join-btn-ai {
          display: inline-block;
          margin-top: 12px;
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: bold;
          transition: background 0.3s;
        }

        .join-btn-ai:hover {
          background: #2563eb;
        }

        .close-chat {
          position: absolute;
          top: 8px;
          right: 12px;
          color: #94a3b8;
          cursor: pointer;
          font-size: 1.2rem;
          background: none;
          border: none;
          padding: 0;
        }
        .close-chat:hover { color: #ef4444; }
        
        @media (max-width: 768px) {
          .chat-bubble { width: 220px; }
        }
      `,
        }}
      />

      {/* Avatar Bulat yang bisa diklik */}
      <div className="ai-avatar" onClick={() => setIsOpen(!isOpen)}>
        <span className="waving-hand">👋</span>
        <div className="online-dot"></div>
      </div>

      {/* Balon Pesan yang muncul (Pop-up) */}
      <div className={`chat-bubble ${isOpen ? "open" : ""}`}>
        <button className="close-chat" onClick={() => setIsOpen(false)}>
          &times;
        </button>
        <p
          style={{
            margin: "0 0 5px 0",
            color: "#60a5fa",
            fontSize: "0.8rem",
            fontWeight: "bold",
          }}
        >
          M-YES Virtual Buddy
        </p>
        <p
          style={{
            margin: 0,
            color: "#f8fafc",
            fontSize: "0.95rem",
            lineHeight: "1.5",
          }}
        >
          {lang === "id"
            ? "Halo! Selamat datang di M-YES. Ayo bertumbuh dalam iman dan bahasa Inggris bersama kami minggu ini!"
            : "Hi there! Welcome to M-YES. Let's grow in faith and English together this week!"}
        </p>
        <a
          href="https://chat.whatsapp.com/Fialpt9jLrCL0oLagStRTc"
          target="_blank"
          rel="noopener noreferrer"
          className="join-btn-ai"
        >
          {lang === "id" ? "👉 Gabung Sekarang" : "👉 Join Us Now"}
        </a>
      </div>
    </div>
  );
}
