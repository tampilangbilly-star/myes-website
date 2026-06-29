"use client";
import { useState, useEffect } from "react";

export default function AdminWeeklyActivities() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState("");

  const [titleEn, setTitleEn] = useState("");
  const [titleId, setTitleId] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const res = await fetch("/api/weekly-activities");
      const data = await res.json();
      if (Array.isArray(data)) setGalleries(data);
    } catch (err) {
      console.error("Gagal mengambil data galeri:", err);
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files) setSelectedPhotos(Array.from(e.target.files));
  };

  // PERBAIKAN: Dulu submit langsung kirim FormData ke /api/weekly-activities yang melakukan
  // writeFile sendiri untuk setiap foto. Ini tidak konsisten dengan sistem upload terpusat.
  // Sekarang dipisah:
  //   1. Upload setiap foto ke /api/upload satu per satu → kumpulkan array of paths
  //   2. Kirim JSON { titleEn, titleId, activityDate, isActive, photos: [...paths] }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Langkah 1: Upload semua foto
      const photoPaths = [];

      for (let i = 0; i < selectedPhotos.length; i++) {
        const photo = selectedPhotos[i];
        setUploadProgress(
          `Mengupload foto ${i + 1} dari ${selectedPhotos.length}...`,
        );

        const fd = new FormData();
        fd.append("file", photo);
        fd.append("folder", "weekly-activities");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({}));
          throw new Error(
            `Gagal upload foto "${photo.name}": ${err.error || "Unknown error"}`,
          );
        }

        const uploadResult = await uploadRes.json();
        if (!uploadResult.path)
          throw new Error(
            `Server tidak mengembalikan path untuk foto "${photo.name}"`,
          );
        photoPaths.push(uploadResult.path);
      }

      setUploadProgress("Menyimpan data ke database...");

      // Langkah 2: Simpan data galeri + array paths ke database
      const res = await fetch("/api/weekly-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleEn,
          titleId,
          activityDate,
          isActive,
          photos: photoPaths,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal menyimpan galeri ke database");
      }

      // Reset form
      setTitleEn("");
      setTitleId("");
      setActivityDate("");
      setIsActive(true);
      setSelectedPhotos([]);
      setUploadProgress("");
      fetchGalleries();
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
      setUploadProgress("");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    color: "#fff",
  };

  return (
    <div
      style={{
        padding: "2rem",
        color: "#fff",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "2rem" }}
      >
        Manage Weekly Activities Gallery
      </h1>

      {/* FORM INPUT */}
      <div
        style={{
          backgroundColor: "#0f172a",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.05)",
          marginBottom: "3rem",
        }}
      >
        <h3
          style={{
            fontSize: "1.5rem",
            marginBottom: "1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "0.5rem",
          }}
        >
          Add New Gallery Event
        </h3>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Event Title (EN) *
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Judul Kegiatan (ID)
              </label>
              <input
                type="text"
                value={titleId}
                onChange={(e) => setTitleId(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Activity Date *
              </label>
              <input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Select Photos (bisa pilih banyak sekaligus)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                style={inputStyle}
              />
              <small
                style={{
                  color: "#94a3b8",
                  display: "block",
                  marginTop: "0.25rem",
                }}
              >
                {selectedPhotos.length > 0
                  ? `${selectedPhotos.length} foto terpilih.`
                  : "Tahan Ctrl / Shift untuk memilih beberapa foto sekaligus."}
              </small>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
            <label htmlFor="isActive" style={{ cursor: "pointer" }}>
              Tampilkan di Halaman Utama Website
            </label>
          </div>

          {uploadProgress && (
            <p style={{ color: "#60a5fa", fontSize: "0.9rem" }}>
              ⏳ {uploadProgress}
            </p>
          )}

          {error && (
            <p
              style={{
                color: "#f87171",
                background: "#450a0a",
                border: "1px solid #f87171",
                borderRadius: 8,
                padding: "0.75rem 1rem",
                fontSize: "0.9rem",
              }}
            >
              ❌ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: loading ? "#475569" : "#3b82f6",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "⏳ Uploading & Saving..." : "💾 Save Gallery Event"}
          </button>
        </form>
      </div>

      {/* LIST DATA YANG SUDAH DIUPLOAD */}
      <div>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Existing Galleries
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {galleries.map((g) => (
            <div
              key={g.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.5rem",
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.02)",
              }}
            >
              <div>
                <h4
                  style={{ fontWeight: "bold", fontSize: "1.1rem", margin: 0 }}
                >
                  {g.titleEn}
                  {g.titleId ? ` / ${g.titleId}` : ""}
                </h4>
                <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                  📅{" "}
                  {new Date(g.activityDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  | 🖼️ {g.photos?.length || 0} Photos
                </span>
              </div>
              <span
                style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  backgroundColor: g.isActive
                    ? "rgba(16, 185, 129, 0.2)"
                    : "rgba(239, 68, 68, 0.2)",
                  color: g.isActive ? "#10b981" : "#ef4444",
                }}
              >
                {g.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
          {galleries.length === 0 && (
            <p style={{ color: "#94a3b8" }}>
              Belum ada data galeri kegiatan yang diunggah.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
