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
  const [videoUrl, setVideoUrl] = useState("");

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

      const res = await fetch("/api/weekly-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleEn,
          titleId,
          activityDate,
          isActive,
          photos: photoPaths,
          video: videoUrl,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal menyimpan ke database");
      }

      alert("Berhasil menyimpan galeri!");

      setTitleEn("");
      setTitleId("");
      setActivityDate("");
      setSelectedPhotos([]);
      setVideoUrl("");
      setUploadProgress("");
      fetchGalleries(); // Auto-refresh tabel di bawah
    } catch (err) {
      setError(err.message);
      alert("Error: " + err.message);
      setUploadProgress("");
    } finally {
      setLoading(false);
    }
  };

  // FUNGSI MENGHAPUS GALERI
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus galeri ini? Semua foto di dalamnya akan ikut terhapus permanen.",
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/weekly-activities?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus data dari server");
      }

      alert("Galeri berhasil dihapus!");
      fetchGalleries(); // Refresh tabel setelah dihapus
    } catch (err) {
      alert("Error: " + err.message);
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
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "2rem" }}
      >
        Manage Weekly Activities
      </h1>

      {/* FORM SECTION */}
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
              fontWeight: "bold",
            }}
          >
            {loading
              ? `⏳ ${uploadProgress || "Memproses..."}`
              : "💾 Save Gallery Event"}
          </button>
        </form>
      </div>

      {/* LIST/TABLE SECTION */}
      <div
        style={{
          backgroundColor: "#0B1120",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
          Existing Galleries
        </h3>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "0.95rem",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid #1e293b",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  fontSize: "0.8rem",
                  letterSpacing: "1px",
                }}
              >
                <th style={{ padding: "1rem" }}>IMG</th>
                <th style={{ padding: "1rem" }}>Title</th>
                <th style={{ padding: "1rem" }}>Media</th>
                <th style={{ padding: "1rem" }}>Date</th>
                <th style={{ padding: "1rem", textAlign: "center" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {galleries.map((g) => (
                <tr
                  key={g.id}
                  style={{
                    borderBottom: "1px solid #1e293b",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0f172a")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {/* KOLOM GAMBAR */}
                  <td style={{ padding: "1rem" }}>
                    <div
                      style={{
                        width: "60px",
                        height: "45px",
                        backgroundColor: "#1e293b",
                        borderRadius: "6px",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {g.photos && g.photos.length > 0 ? (
                        <img
                          src={g.photos[0].image}
                          alt="Thumbnail"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                          No Img
                        </span>
                      )}
                    </div>
                  </td>

                  {/* KOLOM JUDUL */}
                  <td style={{ padding: "1rem", fontWeight: "bold" }}>
                    {g.titleEn} <br />
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#94a3b8",
                        fontWeight: "normal",
                      }}
                    >
                      {g.titleId || "-"}
                    </span>
                  </td>

                  {/* KOLOM MEDIA (Tag) */}
                  <td style={{ padding: "1rem", color: "#94a3b8" }}>
                    {g.photos?.length || 0} Photos <br />
                    {g.video ? (
                      <span style={{ color: "#ef4444", fontSize: "0.8rem" }}>
                        ▶ Video
                      </span>
                    ) : (
                      ""
                    )}
                  </td>

                  {/* KOLOM TANGGAL */}
                  <td style={{ padding: "1rem", color: "#e2e8f0" }}>
                    {new Date(g.activityDate).toLocaleDateString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  {/* KOLOM AKSI (Edit & Delete) */}
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() =>
                          alert(
                            "Fitur edit detail sedang disiapkan. Anda bisa menghapus dan membuatnya ulang jika ada kesalahan.",
                          )
                        }
                        style={{
                          padding: "0.5rem",
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          border: "1px solid rgba(59, 130, 246, 0.2)",
                          borderRadius: "6px",
                          color: "#3b82f6",
                          cursor: "pointer",
                        }}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(g.id)}
                        style={{
                          padding: "0.5rem",
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          borderRadius: "6px",
                          color: "#ef4444",
                          cursor: "pointer",
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {galleries.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    Belum ada data galeri kegiatan yang diunggah.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
