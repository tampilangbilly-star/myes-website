"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function WelcomePopup({ news, missions, cares, lang }) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rasio asli tiap gambar (lebar / tinggi), diisi saat gambar selesai dimuat.
  const [ratios, setRatios] = useState({});

  // 1. Ambil SATU berita terbaru (yang memiliki gambar)
  const latestNews = news?.find((n) => n.image);

  // 2. Ambil SATU misi terbaru (yang memiliki gambar)
  const latestMission = missions?.find((m) => m.image);

  // 3. Ambil SATU M-YES Care terbaru (yang memiliki media tipe IMAGE)
  const latestCare = cares?.find((c) => c.media?.some((m) => m.type === "IMAGE"));

  // 4. Gabungkan ketiganya ke dalam satu array untuk slider dengan URUTAN BARU
  const popupItems = [];

  // Urutan 1: NEWS
  if (latestNews) {
    popupItems.push({
      id: "news-" + latestNews.id,
      image: latestNews.image,
      titleId: latestNews.titleId || latestNews.titleEn,
      titleEn: latestNews.titleEn,
      tagId: latestNews.tagId || "Berita Terbaru",
      tagEn: latestNews.tagEn || "Latest News",
      link: "/news", 
      btnId: "Lihat Detail Berita",
      btnEn: "View News Details",
    });
  }

  // Urutan 2: M-YES CARE (Ditukar posisinya ke urutan kedua)
  if (latestCare) {
    const careImage = latestCare.media.find((m) => m.type === "IMAGE")?.url;
    if (careImage) {
      popupItems.push({
        id: "care-" + latestCare.id,
        image: careImage,
        titleId: latestCare.titleId || latestCare.titleEn,
        titleEn: latestCare.titleEn,
        tagId: "Aksi Nyata",
        tagEn: "M-YES Care",
        link: "/care",
        btnId: "Lihat M-YES Care",
        btnEn: "View M-YES Care",
      });
    }
  }

  // Urutan 3: MISSIONS (Ditukar posisinya ke urutan terakhir)
  if (latestMission) {
    popupItems.push({
      id: "mission-" + latestMission.id,
      image: latestMission.image,
      titleId: latestMission.titleId || latestMission.titleEn,
      titleEn: latestMission.titleEn,
      tagId: "Perjalanan Misi",
      tagEn: "Mission Trip",
      link: "/mission", 
      btnId: "Masuk ke Mission Trip",
      btnEn: "Enter Mission Trip",
    });
  }

  useEffect(() => {
    if (!isOpen || popupItems.length <= 1) return;

    // Ganti gambar otomatis setiap 5 detik
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % popupItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isOpen, popupItems.length]);

  if (!isOpen || popupItems.length === 0) return null;

  const currentItem = popupItems[currentIndex];

  const tTitle = lang === "id" ? currentItem.titleId : currentItem.titleEn;
  const tTag = lang === "id" ? currentItem.tagId : currentItem.tagEn;
  const tBtnText = lang === "id" ? currentItem.btnId : currentItem.btnEn;

  const rasioAktif = ratios[currentItem.id] || 4 / 5;

  const catatRasio = (id) => (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (!w || !h) return;
    setRatios((prev) => (prev[id] ? prev : { ...prev, [id]: w / h }));
  };

  return (
    <div className="welcome-popup-overlay">
      <div className="welcome-popup-modal">
        <button className="welcome-close-btn" onClick={() => setIsOpen(false)}>
          ✕
        </button>

        <div className="welcome-image-container" style={{ aspectRatio: rasioAktif }}>
          {popupItems.map((item, idx) => (
            <div
              key={item.id}
              className={`welcome-slide ${idx === currentIndex ? "active" : ""}`}
            >
              <img src={item.image} alt="" aria-hidden="true" className="welcome-image-blur" />
              <img
                src={item.image}
                alt={item.titleEn}
                className="welcome-image"
                onLoad={catatRasio(item.id)}
              />
            </div>
          ))}

          <span className="welcome-tag">{tTag}</span>
        </div>

        <div className="welcome-content">
          <h3>{tTitle}</h3>

          {popupItems.length > 1 && (
            <div className="welcome-dots">
              {popupItems.map((_, idx) => (
                <span
                  key={idx}
                  className={`welcome-dot ${idx === currentIndex ? "active" : ""}`}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>
          )}

          <div className="welcome-action">
            <Link href={currentItem.link} className="welcome-btn" onClick={() => setIsOpen(false)}>
              {tBtnText}
            </Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .welcome-popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(3, 8, 18, 0.85);
          backdrop-filter: blur(8px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.4s ease-out forwards;
        }

        .welcome-popup-modal {
          background: #0a1628;
          width: 100%;
          max-width: 480px;
          max-height: 92vh;          
          overflow-y: auto;          
          -webkit-overflow-scrolling: touch;
          border-radius: 20px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transform: translateY(20px);
          animation: slideUp 0.5s ease-out forwards;
        }

        .welcome-close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          cursor: pointer;
          z-index: 10;
          transition: background 0.3s;
        }
        .welcome-close-btn:hover {
          background: #ef4444;
        }

        .welcome-image-container {
          position: relative;
          width: 100%;
          min-height: 200px;
          max-height: 62vh;
          background: #030812;
          overflow: hidden;
          border-radius: 20px 20px 0 0;
          transition: aspect-ratio 0.45s ease;
        }

        .welcome-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
        }
        .welcome-slide.active {
          opacity: 1;
        }

        .welcome-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;   
          z-index: 1;
        }

        .welcome-image-blur {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(26px) brightness(0.5) saturate(130%);
          transform: scale(1.2);
          z-index: 0;
        }

        .welcome-tag {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: white;
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: bold;
          letter-spacing: 0.5px;
          z-index: 3;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .welcome-content {
          padding: 1.5rem;
          text-align: center;
        }

        .welcome-content h3 {
          margin: 0 0 1rem 0;
          color: #fff;
          font-size: 1.3rem;
          line-height: 1.4;
        }

        .welcome-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 1.5rem;
        }
        .welcome-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .welcome-dot.active {
          background: #3b82f6;
          width: 24px;
          border-radius: 99px;
        }

        .welcome-btn {
          display: block;
          width: 100%;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.3s;
        }
        .welcome-btn:hover {
          background: #fff;
          color: #0f172a;
        }

        @media (max-height: 700px) {
          .welcome-image-container { max-height: 52vh; }
          .welcome-content { padding: 1.1rem; }
          .welcome-content h3 { font-size: 1.15rem; margin-bottom: 0.75rem; }
          .welcome-dots { margin-bottom: 1rem; }
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes slideUp {
          to { transform: translateY(0); }
        }
      `}} />
    </div>
  );
}