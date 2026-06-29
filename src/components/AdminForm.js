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
    defaults[f.name] = "";
  });

  const [form, setForm] = useState(initialData || defaults);
  const [imageFiles, setImageFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm({ ...form, [k]: v });

  const uploadFile = async (file, folder) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);

    const res = await fetch("/api/upload", { method: "POST", body: fd });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Upload gagal (status ${res.status})`);
    }

    const result = await res.json();

    if (!result.path) {
      throw new Error("Server tidak mengembalikan path file.");
    }

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

      for (const [key, file] of Object.entries(imageFiles)) {
        if (file) {
          data[key] = await uploadFile(
            file,
            key === "photo"
              ? "personnel"
              : key === "backgroundImage"
                ? "slides/backgrounds"
                : "uploads",
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
        throw new Error(err.error || "Gagal menyimpan data ke server.");
      }

      router.push(redirectUrl);
      router.refresh();
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Terjadi kesalahan yang tidak diketahui.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2 style={{ color: "#fff", marginBottom: "1.5rem" }}>{title}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {fields
            .filter((f) => f.type !== "file" && f.type !== "checkbox")
            .map((f) => (
              <div key={f.name} className="admin-field">
                <label>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    value={form[f.name] || ""}
                    onChange={(e) => set(f.name, e.target.value)}
                    rows={3}
                    placeholder={f.placeholder}
                  />
                ) : f.type === "select" ? (
                  <select
                    value={form[f.name] || ""}
                    onChange={(e) => set(f.name, e.target.value)}
                  >
                    {f.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type || "text"}
                    value={form[f.name] || ""}
                    onChange={(e) => set(f.name, e.target.value)}
                    placeholder={f.placeholder}
                    required={f.required}
                  />
                )}
              </div>
            ))}
        </div>

        {fields
          .filter((f) => f.type === "file")
          .map((f) => (
            <div key={f.name} className="admin-field">
              <label>{f.label}</label>
              {/* PERBAIKAN: Cek imageFiles[f.name] untuk preview file baru yang dipilih,
                  atau form[f.name] untuk gambar yang sudah tersimpan di DB */}
              {imageFiles[f.name] ? (
                <img
                  src={URL.createObjectURL(imageFiles[f.name])}
                  style={{
                    maxHeight: 100,
                    borderRadius: 8,
                    marginBottom: 8,
                    display: "block",
                  }}
                  alt="Preview"
                />
              ) : form[f.name] ? (
                <img
                  src={`/uploads/${form[f.name]}`}
                  style={{
                    maxHeight: 100,
                    borderRadius: 8,
                    marginBottom: 8,
                    display: "block",
                  }}
                  alt="Gambar saat ini"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : null}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFiles({ ...imageFiles, [f.name]: e.target.files[0] })
                }
              />
            </div>
          ))}

        {fields
          .filter((f) => f.type === "checkbox")
          .map((f) => (
            <div key={f.name} className="admin-field">
              <label>
                <input
                  type="checkbox"
                  checked={!!form[f.name]}
                  onChange={(e) => set(f.name, e.target.checked)}
                />{" "}
                {f.label}
              </label>
            </div>
          ))}

        {error && (
          <p
            style={{
              color: "#f87171",
              background: "#450a0a",
              border: "1px solid #f87171",
              borderRadius: 8,
              padding: "0.75rem 1rem",
              marginTop: "1rem",
              fontSize: "0.9rem",
            }}
          >
            ❌ {error}
          </p>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => router.push(redirectUrl)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={isSubmitting}>
            {isSubmitting ? "⏳ Menyimpan..." : "💾 Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
