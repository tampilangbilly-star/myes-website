"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function WelcomePopup({ news, missions, lang }) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rasio asli tiap gambar (lebar / tinggi), diisi saat gambar selesai dimuat.
  // Dipakai agar kotak gambar mengikuti bentuk poster, bukan sebaliknya.
  const [ratios, setRatios] = useState({});

  // 1. Ambil SATU berita terbaru (yang memiliki gambar)
  const latestNews = news?.find((n) => n.image);

  // 2. Ambil SATU misi terbaru (yang memiliki gambar)
  const latestMission = missions?.find((m) => m.image);

  // 3. Gabungkan keduanya ke dalam satu array untuk slider
  const popupItems = [];

  if (latestNews) {
    popupItems.push({
      id: "news-" + latestNews.id,
      image: latestNews.image,
      titleId: latestNews.titleId || latestNews.titleEn,
      titleEn: latestNews.titleEn,
      tagId: latestNews.tagId || "Berita Terbaru",
      tagEn: latestNews.tagEn || "Latest News",
      link: "/news", // Link menuju halaman berita
      btnId: "Lihat Detail Berita",
      btnEn: "View News Details",
    });
  }

  if (latestMission) {
    popupItems.push({
      id: "mission-" + latestMission.id,
      image: latestMission.image,
      titleId: latestMission.titleId || latestMission.titleEn,
      titleEn: latestMission.titleEn,
      tagId: "Perjalanan Misi",
      tagEn: "Mission Trip",
      link: "/missions", // Pastikan link ini mengarah ke halaman misi Anda
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

  // Jika ditutup atau tidak ada item yang punya gambar, jangan tampilkan apa-apa
  if (!isOpen || popupItems.length === 0) return null;

  const currentItem = popupItems[currentIndex];

  // Menentukan teks bahasa untuk elemen yang sedang aktif
  const tTitle = lang === "id" ? currentItem.titleId : currentItem.titleEn;
  const tTag = lang === "id" ? currentItem.tagId : currentItem.tagEn;
  const tBtnText = lang === "id" ? currentItem.btnId : currentItem.btnEn;

  // Rasio kotak gambar mengikuti gambar yang sedang aktif.
  // 4/5 hanya dipakai sementara sebelum gambar selesai dimuat.
  const rasioAktif = ratios[currentItem.id] || 4 / 5;

  const catatRasio = (id) => (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (!w || !h) return;
    setRatios((prev) => (prev[id] ? prev : { ...prev, [id]: w / h }));
  };

  return (
    <div className="welcome-popup-overlay">
      <div className="welcome-popup-modal">
        {/* Tombol Close (X) */}
        <button className="welcome-close-btn" onClick={() => setIsOpen(false)}>
          ✕
        </button>

        {/* Kontainer Gambar Slider — tingginya menyesuaikan bentuk poster */}
        <div className="welcome-image-container" style={{ aspectRatio: rasioAktif }}>
          {popupItems.map((item, idx) => (
            <div
              key={item.id}
              className={`welcome-slide ${idx === currentIndex ? "active" : ""}`}
            >
              {/* Lapisan buram: mengisi sisa ruang bila bentuk poster tidak
                  sama dengan kotaknya, sehingga tidak ada bidang kosong. */}
              <img src={item.image} alt="" aria-hidden="true" className="welcome-image-blur" />

              {/* Gambar utama: contain, jadi poster tampil UTUH tanpa terpotong */}
              <img
                src={item.image}
                alt={item.titleEn}
                className="welcome-image"
                onLoad={catatRasio(item.id)}
              />
            </div>
          ))}

          {/* Tag Info di pojok gambar (Berubah sesuai slide) */}
          <span className="welcome-tag">{tTag}</span>
        </div>

        {/* Info & Tombol Aksi */}
        <div className="welcome-content">
          <h3>{tTitle}</h3>

          {/* Navigasi Titik (Dots) */}
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
            {/* Tombol dengan link dinamis berdasarkan slide yang sedang aktif */}
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
          max-height: 92vh;          /* modal tidak melebihi layar ... */
          overflow-y: auto;          /* ... sisanya bisa digulir */
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

        /* Tinggi kotak ditentukan aspectRatio dari gambar yang sedang aktif,
           lalu dibatasi agar judul dan tombol tetap kelihatan tanpa menggulir. */
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
          object-fit: contain;   /* KUNCI: poster tampil utuh, tidak dipotong */
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

        /* Layar pendek (HP mendatar / jendela kecil): beri ruang lebih
           untuk teks agar tombol tidak terdorong keluar layar. */
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