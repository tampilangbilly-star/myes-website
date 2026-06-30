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

            {/* FILE */}
            {f.type === "file" && (
              <>
                {form[f.name] && !imageFiles[f.name] && (
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
                {imageFiles[f.name] && (
                  <img
                    src={URL.createObjectURL(imageFiles[f.name])}
                    style={{
                      maxHeight: 100,
                      display: "block",
                      marginBottom: 8,
                      borderRadius: 6,
                    }}
                    alt="Preview baru"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImageFiles({
                      ...imageFiles,
                      [f.name]: e.target.files[0],
                    })
                  }
                />
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
