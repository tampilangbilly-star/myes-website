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
  const [videoUrl, setVideoUrl] = useState(""); // State diubah untuk menampung teks link YouTube

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Upload Semua Foto (Tetap utuh dan aman)
      const photoPaths = [];
      for (let i = 0; i < selectedPhotos.length; i++) {
        setUploadProgress(
          `Mengupload foto ${i + 1} dari ${selectedPhotos.length}...`,
        );
        const fd = new FormData();
        fd.append("file", selectedPhotos[i]);
        fd.append("folder", "weekly-activities");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          throw new Error(`Gagal upload foto ${i + 1}: ${errText}`);
        }

        const uploadResult = await uploadRes.json();
        photoPaths.push(uploadResult.path);
      }

      setUploadProgress("Menyimpan ke database...");

      // 2. Simpan ke Database
      const res = await fetch("/api/weekly-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleEn,
          titleId,
          activityDate,
          isActive,
          photos: photoPaths,
          video: videoUrl, // Langsung mengirimkan teks link YouTube
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal menyimpan ke database");
      }

      alert("Berhasil menyimpan galeri!");

      // Reset Form
      setTitleEn("");
      setTitleId("");
      setActivityDate("");
      setSelectedPhotos([]);
      setVideoUrl("");
      setUploadProgress("");
      fetchGalleries();
    } catch (err) {
      console.error("Submit Error:", err);
      setError(err.message);
      alert("Error: " + err.message);
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
        Manage Weekly Activities
      </h1>

      <div
        style={{
          backgroundColor: "#0f172a",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.05)",
          marginBottom: "3rem",
        }}
      >
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
              <label>Event Title (EN) *</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label>Judul Kegiatan (ID)</label>
              <input
                type="text"
                value={titleId}
                onChange={(e) => setTitleId(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label>Activity Date *</label>
            <input
              type="date"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* INPUT VIDEO SEKARANG BERUPA TEKS LINK YOUTUBE */}
          <div>
            <label>Video URL (Link YouTube) - Opsional</label>
            <input
              type="text"
              placeholder="Contoh: https://youtu.be/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* INPUT FOTO */}
          <div>
            <label>Select Photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "1rem",
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {loading ? "⏳ Memproses..." : "💾 Save Gallery Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
