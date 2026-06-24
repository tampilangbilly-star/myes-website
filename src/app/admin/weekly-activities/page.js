"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminWeeklyActivities() {
  const router = useRouter();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(false);

  // State Form
  const [titleEn, setTitleEn] = useState("");
  const [titleId, setTitleId] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  // Ambil data galeri yang sudah ada saat halaman dimuat
  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const res = await fetch("/api/weekly-activities");
      const data = await res.json();
      if (Array.isArray(data)) {
        setGalleries(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data galeri:", error);
    }
  };

  // Menangani perubahan saat memilih banyak foto
  const handlePhotoChange = (e) => {
    if (e.target.files) {
      setSelectedPhotos(Array.from(e.target.files));
    }
  };

  // Menangani pengiriman form (Submit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Menggunakan FormData karena mengirimkan berkas fisik (file)
    const formData = new FormData();
    formData.append("titleEn", titleEn);
    formData.append("titleId", titleId);
    formData.append("activityDate", activityDate);
    formData.append("isActive", isActive);

    // Memasukkan seluruh foto yang dipilih ke dalam FormData
    selectedPhotos.forEach((photo) => {
      formData.append("photos", photo);
    });

    try {
      const res = await fetch("/api/weekly-activities", {
        method: "POST",
        body: formData, // Jangan set Content-Type header jika menggunakan FormData
      });

      if (res.ok) {
        alert("Galeri kegiatan mingguan berhasil ditambahkan! 🎉");
        // Reset Form
        setTitleEn("");
        setTitleId("");
        setActivityDate("");
        setSelectedPhotos([]);
        // Perbarui list di bawah
        fetchGalleries();
      } else {
        const errData = await res.json();
        alert(`Gagal: ${errData.error}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengunggah data.");
    } finally {
      setLoading(false);
    }
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

      {/* FORM INPUT ADMIN */}
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
                Event Title (EN)
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  color: "#fff",
                }}
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
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  backgroundColor: "#1e293b",
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
              gap: "1rem",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Activity Date
              </label>
              <input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  color: "#fff",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Select Photos (Bisa pilih banyak sekaligus)
              </label>
              <input
                type="file"
                multiple // KUNCI UTAMA: Mengizinkan memilih lebih dari 1 file
                accept="image/*"
                onChange={handlePhotoChange}
                required
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  color: "#fff",
                }}
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
                  : "Tahan tombol Ctrl / Shift untuk memilih beberapa foto sekaligus."}
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

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: "#3b82f6",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            {loading ? "Uploading & Saving..." : "Save Gallery Event"}
          </button>
        </form>
      </div>

      {/* LIST PREVIEW DATA YANG SUDAH DIUPLOAD */}
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
                  {g.titleEn} / {g.titleId}
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
