"use client";
import { useState } from "react";

// Fungsi khusus untuk mengubah link YouTube standar menjadi link embed otomatis
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  let videoId = "";
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("youtube.com/watch")) {
    const urlParams = new URLSearchParams(new URL(url).search);
    videoId = urlParams.get("v");
  } else if (url.includes("youtube.com/embed/")) {
    return url;
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

export default function WeeklyGallery({ galleries, lang }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const closeModal = () => setSelectedImage(null);

  return (
    <>
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

            {/* --- BAGIAN PLAYER YOUTUBE --- */}
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
                {/* Desain container khusus agar video YouTube tetap 16:9 saat dibuka di HP */}
                <div
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backgroundColor: "#000",
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                  }}
                >
                  <iframe
                    src={getYouTubeEmbedUrl(gallery.video)}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Highlight Video"
                  />
                </div>
              </div>
            )}

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
            )}
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
