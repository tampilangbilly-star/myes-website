"use client";
import { useState, useEffect } from "react";

export default function HomeMomentsAdmin() {
  const [moments, setMoments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchMoments = async () => {
    try {
      const res = await fetch("/api/home-moments");
      if (res.ok) setMoments(await res.json());
    } catch (err) {
      console.error("Gagal fetch home moments:", err);
    }
  };

  useEffect(() => {
    fetchMoments();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Pola sama seperti Guest Speakers: upload foto dulu ke /api/upload,
  // baru simpan path-nya via JSON ke /api/home-moments.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Pilih foto terlebih dahulu");
      return;
    }
    setIsUploading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("file", imageFile);
      fd.append("folder", "home-moments");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err.error || "Gagal upload foto");
      }

      const { path: imagePath } = await uploadRes.json();
      if (!imagePath) throw new Error("Server tidak mengembalikan path foto");

      const res = await fetch("/api/home-moments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imagePath, isActive: true }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal menyimpan foto");
      }

      setImageFile(null);
      setImagePreview(null);
      fetchMoments();
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus foto ini dari homepage?")) return;
    try {
      const res = await fetch(`/api/home-moments?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      fetchMoments();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    backgroundColor: "#0f172a",
    border: "1px solid #334155",
    color: "#fff",
  };

  return (
    <div>
      <h2 style={{ marginBottom: "0.5rem" }}>Momen Beranda (Home Moments)</h2>
      <p style={{ color: "#94a3b8", marginBottom: "2rem", maxWidth: 640 }}>
        Foto kegiatan mingguan yang tampil sebagai slider di atas foto latar
        Homepage — tanpa nama atau keterangan, murni visual. Gunakan foto{" "}
        <b>landscape (mendatar)</b> untuk hasil terbaik. Foto akan langsung
        hilang dari Homepage begitu dihapus di sini.
      </p>

      {/* FORM UPLOAD */}
      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "2rem",
          borderRadius: "12px",
          marginBottom: "3rem",
          maxWidth: 480,
        }}
      >
        <h3 style={{ marginBottom: "1.5rem", color: "#3b82f6" }}>
          Tambah Foto Baru
        </h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "1.25rem" }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Foto Kegiatan (Landscape) *
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 10,
                  display: "block",
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={inputStyle}
            />
          </div>

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
            disabled={isUploading}
            style={{
              padding: "1rem",
              backgroundColor: isUploading ? "#475569" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: isUploading ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {isUploading ? "⏳ Mengunggah…" : "💾 Simpan Foto"}
          </button>
        </form>
      </div>

      {/* DAFTAR FOTO */}
      <h3 style={{ marginBottom: "1.5rem" }}>
        Daftar Foto ({moments.length})
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {moments.map((m) => (
          <div
            key={m.id}
            style={{
              backgroundColor: "#1e293b",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #334155",
            }}
          >
            <img
              src={m.image}
              alt=""
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/320x180?text=No+Image";
              }}
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div style={{ padding: "0.9rem 1rem" }}>
              <button
                onClick={() => handleDelete(m.id)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                🗑️ Hapus
              </button>
            </div>
          </div>
        ))}
        {moments.length === 0 && (
          <p style={{ color: "#94a3b8" }}>
            Belum ada foto. Tambahkan foto pertama di atas.
          </p>
        )}
      </div>
    </div>
  );
}