"use client";
import { useState } from "react";

export default function WeeklyGallery({ galleries, lang }) {
  // State untuk menyimpan nama file foto yang sedang diklik
  const [selectedImage, setSelectedImage] = useState(null);

  // Fungsi untuk menutup popup gambar
  const closeModal = () => setSelectedImage(null);

  return (
    <>
      {/* 1. BAGIAN GRID GALERI UTAMA */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
        {galleries.map((gallery) => (
          <div
            key={gallery.id}
            style={{
              backgroundColor: "rgba(255,255,255,0.02)",
              padding: "2rem",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* HEADER: JUDUL & TANGGAL */}
            <div
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "1rem",
                marginBottom: "2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.5rem",
                  color: "#fff",
                  margin: "0 0 0.5rem 0",
                }}
              >
                {lang === "id"
                  ? gallery.titleId || gallery.titleEn
                  : gallery.titleEn}
              </h3>
              <span
                style={{
                  color: "#3b82f6",
                  fontSize: "0.95rem",
                  fontWeight: "bold",
                }}
              >
                📅{" "}
                {new Date(gallery.activityDate).toLocaleDateString(
                  lang === "id" ? "id-ID" : "en-US",
                  { day: "numeric", month: "long", year: "numeric" },
                )}
              </span>
            </div>

            {/* --- BAGIAN BARU: PEMUTAR VIDEO --- */}
            {gallery.video && (
              <div style={{ marginBottom: "3rem" }}>
                <h4
                  style={{
                    color: "#e2e8f0",
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  🎥 {lang === "id" ? "Video Sorotan" : "Highlight Video"}
                </h4>
                <div
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backgroundColor: "#000",
                  }}
                >
                  <video
                    src={gallery.video}
                    controls
                    preload="metadata"
                    style={{
                      width: "100%",
                      maxHeight: "450px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            )}
            {/* --------------------------------- */}

            {/* --- BAGIAN GALERI FOTO --- */}
            {gallery.photos && gallery.photos.length > 0 && (
              <div>
                <h4
                  style={{
                    color: "#e2e8f0",
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  📸 {lang === "id" ? "Galeri Foto" : "Photo Gallery"}
                </h4>
                <div className="gallery-grid">
                  {gallery.photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="gallery-img-wrapper"
                      onClick={() => setSelectedImage(photo.image)} // Buka modal saat diklik
                    >
                      <img src={`${photo.image}`} alt={`Moment ${index + 1}`} />
                      {/* Efek kaca pembesar saat di-hover */}
                      <div className="zoom-overlay">
                        <span>🔍</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* --------------------------- */}
          </div>
        ))}

        {galleries.length === 0 && (
          <div
            style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}
          >
            <p>
              {lang === "id"
                ? "Belum ada momen yang dibagikan."
                : "No moments shared yet."}
            </p>
          </div>
        )}
      </div>

      {/* 2. BAGIAN MODAL POPUP (FULL SCREEN) */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(5, 11, 20, 0.95)", // Background gelap transparan
            zIndex: 9999, // Memastikan selalu berada paling depan
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            backdropFilter: "blur(5px)",
          }}
          onClick={closeModal} // Tutup modal jika area gelap di luar gambar diklik
        >
          {/* Tombol Silang (Close) */}
          <button
            onClick={closeModal}
            style={{
              position: "absolute",
              top: "20px",
              right: "30px",
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "4rem",
              cursor: "pointer",
              zIndex: 10000,
              lineHeight: "1",
            }}
          >
            &times;
          </button>

          {/* Menampilkan Gambar Ukuran Asli */}
          <img
            src={`${selectedImage}`}
            alt="Full size"
            style={{
              maxWidth: "95%",
              maxHeight: "75vh",
              objectFit: "contain", // KUNCI: Menjamin foto portrait atau landscape tidak terpotong sama sekali
              borderRadius: "8px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup kalau gambarnya yang diklik
          />

          {/* Tombol Download */}
          <a
            href={`${selectedImage}`}
            download // Atribut HTML bawaan untuk memaksa unduhan file
            onClick={(e) => e.stopPropagation()}
            style={{
              marginTop: "2rem",
              padding: "1rem 2.5rem",
              backgroundColor: "#3b82f6",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "30px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.3s ease",
              boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
            }}
            onMouseOver={(e) => (e.target.style.transform = "translateY(-3px)")}
            onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
          >
            📥 {lang === "id" ? "Unduh Gambar Asli" : "Download Original Image"}
          </a>
        </div>
      )}
    </>
  );
}
