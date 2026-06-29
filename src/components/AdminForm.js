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
    if (!res.ok) throw new Error("Upload gagal");
    const result = await res.json();
    return result.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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

      if (!res.ok) throw new Error("Gagal menyimpan data.");
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
      <form onSubmit={handleSubmit}>
        {/* ... (Fields rendering tetap sama) ... */}
        {fields
          .filter((f) => f.type === "file")
          .map((f) => (
            <div key={f.name} className="admin-field">
              <label>{f.label}</label>
              {form[f.name] && (
                <img
                  src={form[f.name]}
                  style={{ maxHeight: 100 }}
                  alt="Preview"
                />
              )}
              <input
                type="file"
                onChange={(e) =>
                  setImageFiles({ ...imageFiles, [f.name]: e.target.files[0] })
                }
              />
            </div>
          ))}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "⏳ Menyimpan..." : "💾 Save"}
        </button>
      </form>
    </div>
  );
}
