"use client";
import { useState } from "react";

export default function WeeklyGallery({ galleries, lang }) {
  const [selectedImage, setSelectedImage] = useState(null);
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
            <div
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ fontSize: "1.5rem", color: "#fff", margin: "0" }}>
                {lang === "id"
                  ? gallery.titleId || gallery.titleEn
                  : gallery.titleEn}
              </h3>
              <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                📅{" "}
                {new Date(gallery.activityDate).toLocaleDateString(
                  lang === "id" ? "id-ID" : "en-US",
                  { day: "numeric", month: "long", year: "numeric" },
                )}
              </span>
            </div>

            {/* PEMUTAR VIDEO (HANYA MUNCUL JIKA ADA VIDEO DI DATABASE) */}
            {gallery.video && (
              <div
                style={{
                  marginBottom: "2rem",
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
                    maxHeight: "500px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
            )}

            <div className="gallery-grid">
              {gallery.photos &&
                gallery.photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="gallery-img-wrapper"
                    onClick={() => setSelectedImage(photo.image)}
                  >
                    <img src={`${photo.image}`} alt={`Moment ${index + 1}`} />
                    <div className="zoom-overlay">
                      <span>🔍</span>
                    </div>
                  </div>
                ))}
            </div>
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

      {/* 2. BAGIAN MODAL POPUP (FULL SCREEN) UNTUK FOTO */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(5, 11, 20, 0.95)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            backdropFilter: "blur(5px)",
          }}
          onClick={closeModal}
        >
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

          <img
            src={`${selectedImage}`}
            alt="Full size"
            style={{
              maxWidth: "95%",
              maxHeight: "75vh",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          />

          <a
            href={`${selectedImage}`}
            download
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
