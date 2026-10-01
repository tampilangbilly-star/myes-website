"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Icon from "../Icon";
import { AdminTitle } from "./ResourceList";
import { ImageField } from "./ImageFields";
import { api } from "./api";
import { useUI } from "./UIProvider";
import { ACCENTS, ACCENT_STORAGE_KEY } from "@/lib/theme";

const TABS = [
  { id: "about", label: "Tentang", icon: "book" },
  { id: "social", label: "Media sosial", icon: "globe" },
  { id: "contact", label: "Kontak & peta", icon: "pin" },
  { id: "appearance", label: "Tampilan", icon: "palette" },
];

// bilingual: isian EN & ID terpisah. Lainnya: satu nilai (disimpan sama untuk EN & ID).
const FIELDS = {
  about: [
    { key: "about_description", label: "Cerita kami", bilingual: true, textarea: 6, hint: "Pisahkan paragraf dengan baris baru. Kosongkan untuk memakai teks bawaan." },
    { key: "vision", label: "Visi", bilingual: true, textarea: 3 },
    { key: "mission", label: "Misi", bilingual: true, textarea: 6, hint: "Satu poin misi per baris." },
  ],
  social: [
    { key: "social_instagram", label: "Instagram", url: true, placeholder: "https://www.instagram.com/…" },
    { key: "social_whatsapp", label: "Link grup WhatsApp", url: true, placeholder: "https://chat.whatsapp.com/…" },
    { key: "social_tiktok", label: "TikTok", url: true, placeholder: "https://www.tiktok.com/@…" },
    { key: "social_facebook", label: "Facebook", url: true, placeholder: "https://facebook.com/…" },
    { key: "social_youtube", label: "YouTube", url: true, placeholder: "https://youtube.com/@…" },
  ],
  contact: [
    { key: "contact_phone", label: "Nomor WhatsApp admin", hint: "Dipakai tombol WhatsApp mengambang. Contoh: +62 822 9065 8336", phone: true },
    { key: "contact_admin_name", label: "Nama admin (sapaan di pesan WhatsApp)", hint: "Pesan otomatis: “Halo kak {nama}, …”" },
    { key: "contact_email", label: "Email", email: true },
    { key: "contact_address", label: "Alamat", bilingual: true, textarea: 2 },
    { key: "contact_area", label: "Label area (di atas nama basecamp)", placeholder: "KEL. MARU - KIMBAL" },
    { key: "contact_schedule", label: "Jadwal ibadah", bilingual: true },
    { key: "contact_map_url", label: "Link Google Maps", url: true, hint: "Tombol “Buka di Google Maps”." },
    { key: "contact_map_embed", label: "Embed peta Google Maps", embed: true, textarea: 3, hint: "Google Maps → Bagikan → Sematkan peta → Salin HTML, lalu tempel di sini (kode <iframe> atau link-nya saja)." },
  ],
};

export default function SettingsForm({ values, fallback, initialTab }) {
  const router = useRouter();
  const { toast } = useUI();
  const [tab, setTab] = useState(TABS.some((t) => t.id === initialTab) ? initialTab : "about");
  const [v, setV] = useState(() => {
    const init = {};
    for (const [k, val] of Object.entries(values)) init[k] = { ...val };
    return init;
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const get = (key, lang = "en") => v[key]?.[lang] ?? "";
  const set = (key, lang, val) => {
    setV((x) => ({ ...x, [key]: { ...(x[key] || { en: "", id: "" }), [lang]: val } }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const switchTab = (id) => {
    setTab(id);
    window.history.replaceState(null, "", `?tab=${id}`);
  };

  function collect() {
    const errs = {};
    const out = [];
    if (tab === "appearance") {
      out.push({ key: "theme_accent", valueEn: get("theme_accent") || "blue", valueId: get("theme_accent") || "blue" });
      out.push({ key: "main_background", valueEn: get("main_background"), valueId: get("main_background") });
      return { errs, out };
    }
    for (const f of FIELDS[tab]) {
      let en = get(f.key, "en").trim();
      let id = f.bilingual ? get(f.key, "id").trim() : en;
      if (f.embed && en) {
        const m = en.match(/src=["']([^"']+)["']/);
        if (m) en = id = m[1];
        if (!/^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed/.test(en)) errs[f.key] = "Harus link embed Google Maps (https://www.google.com/maps/embed?…).";
      }
      if (f.url && en && !/^https:\/\//.test(en)) errs[f.key] = "Link harus diawali https://";
      if (f.email && en && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(en)) errs[f.key] = "Format email tidak valid.";
      if (f.phone && en && en.replace(/\D/g, "").length < 9) errs[f.key] = "Nomor terlalu pendek.";
      out.push({ key: f.key, valueEn: en, valueId: id });
    }
    return { errs, out };
  }

  async function save(e) {
    e.preventDefault();
    const { errs, out } = collect();
    setErrors(errs);
    if (Object.keys(errs).length) return toast("Periksa kembali isian yang ditandai merah.", "error");
    setSaving(true);
    try {
      await api("/api/settings", { method: "POST", body: out });
      if (tab === "appearance") document.documentElement.setAttribute("data-default-accent", get("theme_accent") || "blue");
      toast("Pengaturan disimpan.");
      router.refresh();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  const accent = get("theme_accent") || "blue";

  return (
    <>
      <AdminTitle title="Pengaturan" subtitle="Teks, link, dan tampilan yang dipakai di seluruh website." />

      <div className="-mx-4 mb-5 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Kategori pengaturan">
        <div className="flex w-max gap-1 rounded-2xl bg-ink/5 p-1">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => switchTab(t.id)} className={clsx("flex min-h-10 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-sm font-semibold transition", tab === t.id ? "bg-surface text-primary-strong shadow-sm" : "text-ink-muted hover:text-ink")}>
              <Icon name={t.icon} size={17} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={save} noValidate className="card space-y-5 p-4 sm:p-6">
        {tab === "appearance" ? (
          <>
            <fieldset>
              <legend className="label">Warna aksen default website</legend>
              <p className="hint -mt-1 mb-3">Pengunjung tetap bisa memilih warna sendiri lewat ikon palet; pilihan ini dipakai bila mereka belum memilih.</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {ACCENTS.map((a) => (
                  <label key={a.id} className={clsx("flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 px-3 transition", accent === a.id ? "border-ink" : "border-line hover:border-ink/30")}>
                    <input type="radio" name="accent" value={a.id} checked={accent === a.id} onChange={() => set("theme_accent", "en", a.id)} className="sr-only" />
                    <span className="h-7 w-7 shrink-0 rounded-full" style={{ background: a.hex }} />
                    <span className="text-sm font-semibold">{a.label}</span>
                    {accent === a.id && <Icon name="check" size={18} className="ml-auto" />}
                  </label>
                ))}
              </div>
              <button
                type="button"
                className="btn-ghost btn-sm mt-2"
                onClick={() => {
                  try {
                    localStorage.removeItem(ACCENT_STORAGE_KEY);
                  } catch {}
                  document.documentElement.setAttribute("data-accent", accent);
                  toast("Pratinjau warna diterapkan di browser ini.");
                }}
              >
                <Icon name="eye" size={16} /> Pratinjau di browser ini
              </button>
            </fieldset>
            <div>
              <p className="label">Foto latar utama (cadangan hero & halaman Tentang)</p>
              <ImageField id="s-main_background" value={get("main_background")} onChange={(url) => set("main_background", "en", url)} folder="settings" onBusy={setUploading} />
            </div>
          </>
        ) : (
          FIELDS[tab].map((f) => {
            const err = errors[f.key];
            const input = (lang) => {
              const common = {
                id: `s-${f.key}-${lang}`,
                value: get(f.key, lang),
                onChange: (e) => set(f.key, lang, e.target.value),
                placeholder: f.placeholder || (lang === "en" ? fallback[f.key] : "") || "",
                "aria-invalid": Boolean(err),
                className: clsx("field", f.textarea && "resize-y", err && "field-error"),
              };
              return f.textarea ? <textarea rows={f.textarea} {...common} /> : <input type={f.email ? "email" : f.url ? "url" : "text"} inputMode={f.phone ? "tel" : undefined} {...common} />;
            };
            return (
              <div key={f.key}>
                {f.bilingual ? (
                  <>
                    <p className="label">{f.label}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor={`s-${f.key}-en`} className="mb-1 block text-xs font-bold text-ink-soft">
                          English (utama)
                        </label>
                        {input("en")}
                      </div>
                      <div>
                        <label htmlFor={`s-${f.key}-id`} className="mb-1 block text-xs font-bold text-ink-soft">
                          Indonesia
                        </label>
                        {input("id")}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <label htmlFor={`s-${f.key}-en`} className="label">
                      {f.label}
                    </label>
                    {input("en")}
                  </>
                )}
                {err ? (
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-danger">
                    <Icon name="alert" size={14} /> {err}
                  </p>
                ) : (
                  f.hint && <p className="hint">{f.hint}</p>
                )}
              </div>
            );
          })
        )}
        <div className="flex items-center gap-3 border-t border-line pt-4">
          <button type="submit" disabled={saving || uploading} className="btn-primary px-8">
            <Icon name="check" size={18} /> {saving ? "Menyimpan…" : "Simpan"}
          </button>
          <p className="text-xs text-ink-soft">Kosong = memakai nilai bawaan (terlihat samar di kotak isian).</p>
        </div>
      </form>
    </>
  );
}
