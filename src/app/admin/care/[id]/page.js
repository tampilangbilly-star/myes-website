"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditCareActivity() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    titleEn: "", titleId: "",
    descriptionEn: "", descriptionId: "",
    activityDate: "",
    isActive: true,
  });
  
  const [photos, setPhotos] = useState([]);
  const [youtubeLinks, setYoutubeLinks] = useState([]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`/api/care/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            titleEn: data.titleEn || "",
            titleId: data.titleId || "",
            descriptionEn: data.descriptionEn || "",
            descriptionId: data.descriptionId || "",
            activityDate: new Date(data.activityDate).toISOString().split("T")[0],
            isActive: data.isActive,
          });

          // Pisahkan media yang ada di database menjadi foto dan youtube
          const existingPhotos = data.media.filter(m => m.type === "IMAGE").map(m => m.url);
          const existingYoutube = data.media.filter(m => m.type === "YOUTUBE").map(m => m.url);
          
          setPhotos(existingPhotos);
          setYoutubeLinks(existingYoutube.length > 0 ? existingYoutube : [""]);
        } else {
          alert("Data tidak ditemukan");
          router.push("/admin/care");
        }
      } catch (error) {
        console.error("Gagal memuat data", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchActivity();
  }, [id, router]);

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const data = new FormData();
        data.append("file", files[i]);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });

        if (res.ok) {
          const result = await res.json();
          if (result.url) uploadedUrls.push(result.url);
        }
      }
      setPhotos((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error("Gagal mengunggah foto:", error);
      alert("Terjadi kesalahan saat mengunggah foto.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const addYoutubeInput = () => setYoutubeLinks([...youtubeLinks, ""]);
  const updateYoutubeLink = (index, value) => {
    const updated = [...youtubeLinks];
    updated[index] = value;
    setYoutubeLinks(updated);
  };
  const removeYoutubeInput = (index) => {
    setYoutubeLinks(youtubeLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formattedMedia = [
        ...photos.map((url) => ({ type: "IMAGE", url })),
        ...youtubeLinks
          .filter((link) => link.trim() !== "")
          .map((url) => {
            let cleanUrl = url.trim();
            if (cleanUrl.includes("youtu.be/")) {
              cleanUrl = cleanUrl.split("youtu.be/")[1]?.split("?")[0];
            } else if (cleanUrl.includes("watch?v=")) {
              cleanUrl = cleanUrl.split("watch?v=")[1]?.split("&")[0];
            }
            return { type: "YOUTUBE", url: cleanUrl };
          }),
      ];

      const payload = { ...formData, media: formattedMedia };

      const res = await fetch(`/api/care/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/care");
      } else {
        alert("Terjadi kesalahan saat memperbarui data.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div style={{ padding: "2rem", color: "#fff" }}>Memuat data...</div>;

  return (
    <div className="admin-crud">
      <div className="admin-crud-header">
        <h2>Edit Kegiatan M-YES Care</h2>
      </div>
      
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Judul (Inggris) *</label>
          <input required type="text" value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} />
        </div>
        
        <div className="form-group">
          <label>Judul (Indonesia)</label>
          <input type="text" value={formData.titleId} onChange={e => setFormData({...formData, titleId: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Deskripsi (Inggris)</label>
          <textarea rows="4" value={formData.descriptionEn} onChange={e => setFormData({...formData, descriptionEn: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Deskripsi (Indonesia)</label>
          <textarea rows="4" value={formData.descriptionId} onChange={e => setFormData({...formData, descriptionId: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Tanggal Kegiatan *</label>
          <input required type="date" value={formData.activityDate} onChange={e => setFormData({...formData, activityDate: e.target.value})} />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
            Tampilkan di Website
          </label>
        </div>

        {/* SECTION 1: UPLOAD FOTO */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", margin: "2rem 0", paddingTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, color: "#fff", fontSize: "1.2rem" }}>Upload Foto Kegiatan</h3>
            <label className="admin-btn primary" style={{ cursor: "pointer", display: "inline-block" }}>
              {isUploading ? "Mengunggah..." : "+ Pilih Foto dari Laptop"}
              <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
            </label>
          </div>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "1rem" }}>Anda bisa memilih banyak foto sekaligus dari komputer Anda.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px" }}>
            {photos.map((url, index) => (
              <div key={index} style={{ position: "relative", height: "100px", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.2)" }}>
                <img src={url} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button type="button" onClick={() => removePhoto(index)} style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(220, 38, 38, 0.8)", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: YOUTUBE */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", margin: "2rem 0", paddingTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, color: "#fff", fontSize: "1.2rem" }}>Video YouTube (Opsional)</h3>
            <button type="button" className="admin-btn" style={{ background: "#dc2626", color: "white" }} onClick={addYoutubeInput}>
              + Tambah Link YouTube
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {youtubeLinks.map((link, index) => (
              <div key={index} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <input 
                  type="text" 
                  placeholder="Tempel link YouTube (contoh: https://www.youtube.com/watch?v=xxxxx)"
                  style={{ flex: 1, padding: "0.6rem", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white" }}
                  value={link}
                  onChange={(e) => updateYoutubeLink(index, e.target.value)}
                />
                <button type="button" onClick={() => removeYoutubeInput(index)} style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer", fontWeight: "bold" }}>
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="admin-btn secondary" onClick={() => router.back()}>Batal</button>
          <button type="submit" className="admin-btn primary" disabled={isSubmitting || isUploading}>
            {isSubmitting ? "Memperbarui..." : "Perbarui Kegiatan"}
          </button>
        </div>
      </form>
    </div>
  );
}