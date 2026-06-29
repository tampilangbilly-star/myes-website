"use client";
import { useState, useEffect } from "react";

export default function GuestSpeakersAdmin() {
  const [speakers, setSpeakers] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // State form dikontrol manual agar bisa di-reset dengan benar
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [dateServed, setDateServed] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchSpeakers = async () => {
    try {
      const res = await fetch("/api/guest-speakers");
      if (res.ok) setSpeakers(await res.json());
    } catch (err) {
      console.error("Gagal fetch speakers:", err);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // PERBAIKAN: Dulu submit langsung kirim FormData ke /api/guest-speakers yang melakukan
  // writeFile sendiri. Sekarang dipisah:
  //   1. Upload foto ke /api/upload → dapat path
  //   2. Kirim JSON ke /api/guest-speakers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);

    try {
      let imagePath = null;

      // Langkah 1: Upload foto jika ada
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        fd.append("folder", "guest-speakers");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({}));
          throw new Error(err.error || "Gagal upload foto");
        }

        const uploadResult = await uploadRes.json();
        if (!uploadResult.path)
          throw new Error("Server tidak mengembalikan path foto");
        imagePath = uploadResult.path;
      }

      // Langkah 2: Simpan data ke database via JSON
      const res = await fetch("/api/guest-speakers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, origin, dateServed, image: imagePath }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal menyimpan data pembicara");
      }

      // Reset form
      setName("");
      setOrigin("");
      setDateServed("");
      setImageFile(null);
      setImagePreview(null);
      fetchSpeakers();
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data pembicara ini?"))
      return;

    try {
      const res = await fetch(`/api/guest-speakers?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      fetchSpeakers();
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
      <h2 style={{ marginBottom: "2rem" }}>Manajemen Guest Speakers</h2>

      {/* FORM TAMBAH PEMBICARA */}
      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "2rem",
          borderRadius: "12px",
          marginBottom: "3rem",
        }}
      >
        <h3 style={{ marginBottom: "1.5rem", color: "#3b82f6" }}>
          Add New Guest Speaker
        </h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "1.5rem" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Nama Pembicara *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Cth: Pdt. Billy Tampilang"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Asal Pelayanan / Jabatan
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Cth: Gembala Sidang GSJA"
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Tanggal Melayani *
              </label>
              <input
                type="date"
                value={dateServed}
                onChange={(e) => setDateServed(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Foto Pembicara
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxHeight: 80,
                    borderRadius: 8,
                    marginBottom: 8,
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
              marginTop: "0.5rem",
            }}
          >
            {isUploading ? "⏳ Uploading & Saving..." : "💾 Save Guest Speaker"}
          </button>
        </form>
      </div>

      {/* DAFTAR PEMBICARA */}
      <h3 style={{ marginBottom: "1.5rem" }}>Daftar Pembicara</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {speakers.map((speaker) => (
          <div
            key={speaker.id}
            style={{
              backgroundColor: "#1e293b",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #334155",
            }}
          >
            <img
              src={
                speaker.image
                  ? `${speaker.image}`
                  : "https://via.placeholder.com/250?text=No+Image"
              }
              alt={speaker.name}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/250?text=No+Image";
              }}
              style={{ width: "100%", height: "250px", objectFit: "cover" }}
            />
            <div style={{ padding: "1.5rem" }}>
              <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>
                {speaker.name}
              </h4>
              <p
                style={{
                  margin: "0 0 0.5rem 0",
                  color: "#94a3b8",
                  fontSize: "0.9rem",
                }}
              >
                {speaker.origin}
              </p>
              <p
                style={{
                  margin: "0 0 1rem 0",
                  color: "#3b82f6",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                }}
              >
                📅{" "}
                {new Date(speaker.dateServed).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <button
                onClick={() => handleDelete(speaker.id)}
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
        {speakers.length === 0 && (
          <p style={{ color: "#94a3b8" }}>Belum ada data pembicara.</p>
        )}
      </div>
    </div>
  );
}
