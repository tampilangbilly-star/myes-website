"use client";
import { useState, useEffect } from "react";

export default function GuestSpeakersAdmin() {
  const [speakers, setSpeakers] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fungsi mengambil data
  const fetchSpeakers = async () => {
    const res = await fetch("/api/guest-speakers");
    if (res.ok) {
      const data = await res.json();
      setSpeakers(data);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  // Fungsi menambah data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData(e.target);
    const res = await fetch("/api/guest-speakers", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("✅ Pembicara berhasil ditambahkan!");
      e.target.reset();
      fetchSpeakers(); // Refresh daftar
    } else {
      alert("❌ Gagal menambahkan pembicara. Pastikan semua kolom terisi.");
    }
    setIsUploading(false);
  };

  // Fungsi menghapus data
  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data pembicara ini?"))
      return;

    const res = await fetch(`/api/guest-speakers?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("✅ Data terhapus!");
      fetchSpeakers();
    } else {
      alert("❌ Gagal menghapus data.");
    }
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
                Nama Pembicara
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Cth: Pdt. Billy Tampilang"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  color: "#fff",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Asal Pelayanan / Jabatan
              </label>
              <input
                type="text"
                name="origin"
                placeholder="Cth: Gembala Sidang GSJA, atau Dosen ITS"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  color: "#fff",
                }}
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
                Tanggal Melayani
              </label>
              <input
                type="date"
                name="dateServed"
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  color: "#fff",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Foto Pembicara (Rekomendasi: Portrait/Kotak)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  color: "#fff",
                }}
              />
            </div>
          </div>

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
              marginTop: "1rem",
            }}
          >
            {isUploading ? "Uploading & Saving..." : "Save Guest Speaker"}
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
                speaker.image?.startsWith("/")
                  ? speaker.image
                  : `/uploads/${speaker.image}`
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
                Hapus
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
