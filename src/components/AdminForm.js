"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminForm({
  title,
  apiUrl,
  redirectUrl,
  fields,
  initialData = null,
}) {
  const router = useRouter();
  const isEdit = Boolean(initialData?.id);

  const defaults = {};
  fields.forEach((f) => {
    // Jika tipe multiple file, set default ke array kosong
    defaults[f.name] = f.multiple ? [] : "";
  });

  const [form, setForm] = useState(initialData || defaults);
  const [mediaFiles, setMediaFiles] = useState({}); // Menyimpan file gambar atau video
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm({ ...form, [k]: v });

  // === Fungsi Hapus Preview (Untuk Multiple Upload) ===
  const removeExisting = (fieldName, index) => {
    setForm((prev) => {
      const current = prev[fieldName];
      if (Array.isArray(current)) {
        return { ...prev, [fieldName]: current.filter((_, i) => i !== index) };
      }
      return { ...prev, [fieldName]: "" };
    });
  };

  const removeNew = (fieldName, index) => {
    setMediaFiles((prev) => {
      const current = prev[fieldName];
      if (Array.isArray(current)) {
        return { ...prev, [fieldName]: current.filter((_, i) => i !== index) };
      }
      return { ...prev, [fieldName]: null };
    });
  };
  // ===================================================

  const uploadFile = async (file, folder) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Upload gagal");
    }
    const result = await res.json();
    if (!result.path) throw new Error("Server tidak mengembalikan path file.");
    return result.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const data = { ...form };
      if (data.sortOrder !== undefined && data.sortOrder !== "")
        data.sortOrder = parseInt(data.sortOrder) || 0;
      if (data.isActive !== undefined) data.isActive = !!data.isActive;

      // Proses upload Media Files (Single & Multiple)
      for (const [key, value] of Object.entries(mediaFiles)) {
        if (Array.isArray(value)) {
          // JIKA MULTIPLE FILES (Array)
          const folder = key === "photo" ? "personnel" : key === "backgroundImage" ? "slides/backgrounds" : "uploads";
          const uploadedUrls = [];
          
          for (const file of value) {
            const url = await uploadFile(file, folder);
            uploadedUrls.push(url);
          }
          
          // Gabungkan gambar yang sudah ada dengan yang baru di-upload
          const existing = Array.isArray(data[key]) ? data[key] : (data[key] ? [data[key]] : []);
          data[key] = [...existing, ...uploadedUrls]; // API Anda sudah diatur menerima array

        } else if (value) {
          // JIKA SINGLE FILE (Object File Biasa)
          data[key] = await uploadFile(
            value,
            key === "photo"
              ? "personnel"
              : key === "backgroundImage"
                ? "slides/backgrounds"
                : key === "video" // Folder khusus video
                  ? "activities/videos"
                  : "uploads"
          );
        }
      }

      const url = isEdit ? `${apiUrl}/${initialData.id}` : apiUrl;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal menyimpan data.");
      }

      router.push(redirectUrl);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2 style={{ color: "#fff" }}>{title}</h2>
      {error && (
        <p
          style={{
            color: "#f87171",
            background: "#450a0a",
            border: "1px solid #f87171",
            borderRadius: 8,
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
          }}
        >
          ❌ {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        {fields.map((f) => (
          <div key={f.name} className="admin-field">
            <label>{f.label}</label>

            {/* TEXT / NUMBER / DATE / DEFAULT */}
            {(!f.type ||
              f.type === "text" ||
              f.type === "number" ||
              f.type === "date") && (
              <input
                type={f.type || "text"}
                value={form[f.name] ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
                required={f.required}
                placeholder={f.placeholder || ""}
              />
            )}

            {/* TEXTAREA */}
            {f.type === "textarea" && (
              <textarea
                value={form[f.name] ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
                rows={4}
                required={f.required}
                placeholder={f.placeholder || ""}
              />
            )}

            {/* SELECT */}
            {f.type === "select" && (
              <select
                value={form[f.name] ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
              >
                {f.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {/* CHECKBOX */}
            {f.type === "checkbox" && (
              <input
                type="checkbox"
                checked={!!form[f.name]}
                onChange={(e) => set(f.name, e.target.checked)}
              />
            )}

            {/* IMAGE FILE */}
            {f.type === "file" && (
              <>
                {f.multiple ? (
                  // ==============================
                  // TAMPILAN KHUSUS MULTIPLE GAMBAR
                  // ==============================
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                    {/* Render Gambar Lama (Sudah di database) */}
                    {Array.isArray(form[f.name]) && form[f.name].map((src, idx) => (
                      <div key={`old-${idx}`} style={{ position: "relative" }}>
                        <img
                          src={src}
                          style={{ maxHeight: 100, display: "block", borderRadius: 6 }}
                          alt="Old Preview"
                        />
                        <button
                          type="button"
                          onClick={() => removeExisting(f.name, idx)}
                          style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: "bold" }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {/* Render Gambar Baru (Baru di-select, belum diupload) */}
                    {Array.isArray(mediaFiles[f.name]) && mediaFiles[f.name].map((file, idx) => (
                      <div key={`new-${idx}`} style={{ position: "relative" }}>
                        <img
                          src={URL.createObjectURL(file)}
                          style={{ maxHeight: 100, display: "block", borderRadius: 6 }}
                          alt="New Preview"
                        />
                        <button
                          type="button"
                          onClick={() => removeNew(f.name, idx)}
                          style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: "bold" }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  // ==============================
                  // TAMPILAN SINGLE GAMBAR (LAMA)
                  // ==============================
                  <>
                    {form[f.name] && !mediaFiles[f.name] && (
                      <img
                        src={form[f.name]}
                        style={{
                          maxHeight: 100,
                          display: "block",
                          marginBottom: 8,
                          borderRadius: 6,
                        }}
                        alt="Preview"
                      />
                    )}
                    {mediaFiles[f.name] && (
                      <img
                        src={URL.createObjectURL(mediaFiles[f.name])}
                        style={{
                          maxHeight: 100,
                          display: "block",
                          marginBottom: 8,
                          borderRadius: 6,
                        }}
                        alt="Preview baru"
                      />
                    )}
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  multiple={f.multiple} // Mengizinkan blokir banyak file sekaligus
                  onChange={(e) => {
                    if (f.multiple) {
                      const newFiles = Array.from(e.target.files);
                      setMediaFiles((prev) => ({
                        ...prev,
                        // Append (tambahkan) file baru ke array file sebelumnya
                        [f.name]: prev[f.name] ? [...prev[f.name], ...newFiles] : newFiles,
                      }));
                    } else {
                      setMediaFiles({
                        ...mediaFiles,
                        [f.name]: e.target.files[0],
                      });
                    }
                    // Me-reset value input agar bisa mengupload file yang sama jika tak sengaja terhapus
                    e.target.value = null; 
                  }}
                />
              </>
            )}

            {/* VIDEO FILE */}
            {f.type === "video" && (
              <>
                {form[f.name] && !mediaFiles[f.name] && (
                  <video
                    src={form[f.name]}
                    controls
                    style={{
                      maxHeight: 180,
                      display: "block",
                      marginBottom: 8,
                      borderRadius: 6,
                      backgroundColor: "#000",
                    }}
                  />
                )}
                {mediaFiles[f.name] && (
                  <video
                    src={URL.createObjectURL(mediaFiles[f.name])}
                    controls
                    style={{
                      maxHeight: 180,
                      display: "block",
                      marginBottom: 8,
                      borderRadius: 6,
                      backgroundColor: "#000",
                    }}
                  />
                )}
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={(e) =>
                    setMediaFiles({
                      ...mediaFiles,
                      [f.name]: e.target.files[0],
                    })
                  }
                />
                <small
                  style={{
                    color: "#94a3b8",
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  *Format: MP4/WEBM. Direkomendasikan 20-30 detik agar upload
                  lancar.
                </small>
              </>
            )}
          </div>
        ))}
        <button type="submit" disabled={isSubmitting} className="save-btn">
          {isSubmitting ? "⏳ Menyimpan..." : "💾 Save"}
        </button>
      </form>
    </div>
  );
}