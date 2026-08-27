"use client";
import { useState } from "react";

export default function CareGallery({ activities = [], lang = "en" }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!activities || activities.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0", color: "#94a3b8" }}>
        <p>{lang === "id" ? "Belum ada kegiatan M-YES Care." : "No M-YES Care activities yet."}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {activities.map((item) => {
        const images = item.media?.filter((m) => m.type === "IMAGE") || [];
        const youtubeVideos = item.media?.filter((m) => m.type === "YOUTUBE") || [];

        return (
          <div 
            key={item.id} 
            className="panel"
            style={{
              background: "#050B14",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "clamp(1.5rem, 3vw, 2.5rem)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}
          >
            {/* JUDUL & TANGGAL KEGIATAN */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.5rem", color: "#fff", marginBottom: "0.4rem", fontFamily: '"Playfair Display", serif' }}>
                {lang === "id" ? item.titleId || item.titleEn : item.titleEn}
              </h3>
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#93c5fd", fontSize: "0.9rem", fontWeight: "500" }}>
                <span>📅</span>
                <span>
                  {new Date(item.activityDate).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* DESKRIPSI (JIKA ADA) */}
            {(item.descriptionEn || item.descriptionId) && (
              <p style={{ color: "#cbd5e1", lineHeight: "1.7", marginBottom: "1.5rem", fontSize: "0.98rem" }}>
                {lang === "id" ? item.descriptionId || item.descriptionEn : item.descriptionEn}
              </p>
            )}

            {/* GALERI FOTO DALAM GRID RAPI */}
            {images.length > 0 && (
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: "bold", color: "#94a3b8", marginBottom: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {lang === "id" ? "Galeri Foto" : "Photo Gallery"}
                </div>
                <div className="gallery-grid">
                  {images.map((media, idx) => (
                    <div
                      key={idx}
                      className="gallery-img-wrapper"
                      onClick={() => setSelectedImage(media.url)}
                    >
                      <img src={media.url} alt="Care Activity" loading="lazy" />
                      <div className="zoom-overlay">
                        <span>🔍</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIDEO YOUTUBE (JIKA ADA) */}
            {youtubeVideos.length > 0 && (
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: "bold", color: "#94a3b8", marginBottom: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {lang === "id" ? "Video Kegiatan" : "Activity Videos"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: "1rem" }}>
                  {youtubeVideos.map((vid, idx) => (
                    <div key={idx} style={{ position: "relative", aspectRatio: "16/9", borderRadius: "12px", overflow: "hidden", background: "#000" }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${vid.url}`}
                        title="YouTube video player"
                        style={{ width: "100%", height: "100%", border: "none" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* MODAL / LIGHTBOX KETIKA FOTO DIKLIK (BISA DILIHAT BESAR & DIUNDUH) */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(3, 7, 18, 0.9)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{ position: "relative", maxWidth: "90vw", maxHeight: "80vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged view"
              style={{
                maxWidth: "100%",
                maxHeight: "75vh",
                borderRadius: "12px",
                objectFit: "contain",
                boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
              }}
            />
            
            {/* TOMBOL AKSI DI DALAM MODAL */}
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.2rem" }}>
              <a
                href={selectedImage}
                target="_blank"
                download
                className="admin-btn primary"
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                📥 {lang === "id" ? "Unduh Foto" : "Download Photo"}
              </a>
              <button
                onClick={() => setSelectedImage(null)}
                className="admin-btn secondary"
                style={{ cursor: "pointer" }}
              >
                ✕ {lang === "id" ? "Tutup" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}