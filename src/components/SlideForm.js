"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SlideForm({ initialData = null }) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [form, setForm] = useState(
    initialData || {
      type: "custom",
      titleEn: "",
      titleId: "",
      descriptionEn: "",
      descriptionId: "",
      overlineEn: "",
      overlineId: "",
      buttonTextEn: "",
      buttonTextId: "",
      buttonLink: "",
      backgroundColor: "#0a1628",
      sortOrder: 0,
      isActive: true,
    },
  );
  const [imageFile, setImageFile] = useState(null);
  const [bgFile, setBgFile] = useState(null);
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
      const data = { ...form, sortOrder: parseInt(form.sortOrder) || 0 };

      if (imageFile) data.image = await uploadFile(imageFile, "slides");
      if (bgFile)
        data.backgroundImage = await uploadFile(bgFile, "slides/backgrounds");

      const url = isEdit ? `/api/slides/${initialData.id}` : "/api/slides";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal menyimpan slide ke server.");
      }

      router.push("/admin/slides");
      router.refresh();
    } catch (err) {
      console.error("SlideForm submit error:", err);
      setError(err.message || "Terjadi kesalahan yang tidak diketahui.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <h3 style={{ color: "#fff", marginBottom: "1rem" }}>
          📋 Slide content
        </h3>
        <div className="form-grid">
          <div className="admin-field">
            <label>Type *</label>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
            >
              <option value="activities">Activities</option>
              <option value="social_media">Social Media</option>
              <option value="news">News</option>
              <option value="mission_trip">Mission Trip</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="admin-field">
            <label>Sort Order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => set("sortOrder", e.target.value)}
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="admin-field">
            <label>Overline (EN)</label>
            <input
              value={form.overlineEn || ""}
              onChange={(e) => set("overlineEn", e.target.value)}
              placeholder="OUR ACTIVITIES"
            />
          </div>
          <div className="admin-field">
            <label>Overline (ID)</label>
            <input
              value={form.overlineId || ""}
              onChange={(e) => set("overlineId", e.target.value)}
              placeholder="KEGIATAN KAMI"
            />
          </div>
        </div>
        <div className="form-grid">
          <div className="admin-field">
            <label>Title (EN) *</label>
            <input
              value={form.titleEn}
              onChange={(e) => set("titleEn", e.target.value)}
              required
            />
          </div>
          <div className="admin-field">
            <label>Title (ID)</label>
            <input
              value={form.titleId || ""}
              onChange={(e) => set("titleId", e.target.value)}
            />
          </div>
        </div>
        <div className="form-grid">
          <div className="admin-field">
            <label>Description (EN)</label>
            <textarea
              value={form.descriptionEn || ""}
              onChange={(e) => set("descriptionEn", e.target.value)}
              rows={2}
            />
          </div>
          <div className="admin-field">
            <label>Description (ID)</label>
            <textarea
              value={form.descriptionId || ""}
              onChange={(e) => set("descriptionId", e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <div className="form-grid">
          <div className="admin-field">
            <label>Button Text (EN)</label>
            <input
              value={form.buttonTextEn || ""}
              onChange={(e) => set("buttonTextEn", e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label>Button Text (ID)</label>
            <input
              value={form.buttonTextId || ""}
              onChange={(e) => set("buttonTextId", e.target.value)}
            />
          </div>
        </div>
        <div className="admin-field">
          <label>Button Link</label>
          <input
            value={form.buttonLink || ""}
            onChange={(e) => set("buttonLink", e.target.value)}
            placeholder="/contact"
          />
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #243049",
            margin: "1.5rem 0",
          }}
        />
        <h3 style={{ color: "#fff", marginBottom: "1rem" }}>
          🖼️ Images & background
        </h3>

        <div className="form-grid">
          {/* Slide Image */}
          <div className="admin-field">
            <label>Slide Image</label>
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                style={{
                  maxHeight: 80,
                  borderRadius: 8,
                  marginBottom: 8,
                  display: "block",
                }}
                alt="Preview"
              />
            ) : form.image ? (
              <img
                src={form.image}
                style={{
                  maxHeight: 80,
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
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>

          {/* Background Image */}
          <div className="admin-field">
            <label>Background Image</label>
            {bgFile ? (
              <img
                src={URL.createObjectURL(bgFile)}
                style={{
                  maxHeight: 80,
                  borderRadius: 8,
                  marginBottom: 8,
                  display: "block",
                }}
                alt="Preview"
              />
            ) : form.backgroundImage ? (
              <img
                src={form.image}
                style={{
                  maxHeight: 80,
                  borderRadius: 8,
                  marginBottom: 8,
                  display: "block",
                }}
                alt="Background saat ini"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : null}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBgFile(e.target.files[0])}
            />
          </div>
        </div>

        <div className="admin-field">
          <label>Background Color</label>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
              type="color"
              value={form.backgroundColor}
              onChange={(e) => set("backgroundColor", e.target.value)}
              style={{
                width: 50,
                height: 40,
                borderRadius: 8,
                cursor: "pointer",
                border: "none",
              }}
            />
            <span style={{ color: "#94a3b8", fontSize: ".85rem" }}>
              {form.backgroundColor}
            </span>
          </div>
        </div>

        <div className="admin-field">
          <label>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
            />{" "}
            Active
          </label>
        </div>

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
            onClick={() => router.push("/admin/slides")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={isSubmitting}>
            {isSubmitting ? "⏳ Menyimpan..." : "💾 Save Slide"}
          </button>
        </div>
      </form>
    </div>
  );
}
