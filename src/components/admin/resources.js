/**
 * Konfigurasi semua data yang dikelola admin: field form, kolom daftar, dan filter.
 * Dipakai oleh ResourceForm & ResourceList (komponen client).
 */
import { youtubeId } from "@/lib/youtube";

const dateOnly = (v) => (v ? new Date(v).toISOString().slice(0, 10) : "");
const fmt = (v) => (v ? new Date(v).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Makassar" }) : "—");
const today = () => new Date().toISOString().slice(0, 10);
const activeFilter = { key: "isActive", label: "Status", options: [{ value: "true", label: "Aktif" }, { value: "false", label: "Nonaktif" }] };

// Pasangan field EN / ID
const pair = (name, label, type = "text", opts = {}) => [
  { name: name + "En", label: `${label} (EN)`, type, ...opts },
  { name: name + "Id", label: `${label} (ID)`, type, ...opts, required: false },
];

export const RESOURCES = {
  slides: {
    title: "Hero Slider",
    singular: "Slide",
    api: "/api/slides",
    base: "/admin/slides",
    folder: "slides",
    defaults: { type: "custom", sortOrder: 0, isActive: true, backgroundColor: "#0a1628" },
    fields: [
      { name: "backgroundImage", label: "Foto utama slide", type: "image", hint: "Foto lebar (landscape) min. 1600px. Tampil penuh di desktop, di atas teks di HP." },
      { name: "type", label: "Jenis", type: "select", options: [["custom", "Custom"], ["activities", "Kegiatan"], ["social_media", "Media sosial"], ["news", "Berita"], ["mission_trip", "Mission trip"]], half: true },
      { name: "sortOrder", label: "Urutan", type: "number", half: true, hint: "Bisa juga diatur dengan seret di daftar." },
      ...pair("overline", "Teks kecil di atas judul"),
      ...pair("title", "Judul", "text", { required: true }),
      ...pair("description", "Deskripsi", "textarea"),
      ...pair("buttonText", "Teks tombol"),
      { name: "buttonLink", label: "Link tombol", type: "text", placeholder: "/contact atau https://…", hint: "Diawali / (halaman website) atau https://" },
      { name: "image", label: "Foto cadangan (opsional)", type: "image", hint: "Dipakai bila foto utama kosong." },
      { name: "isActive", label: "Tampilkan di website", type: "toggle" },
    ],
    thumb: (r) => r.backgroundImage || r.image,
    primary: (r) => r.titleEn,
    secondary: (r) => r.overlineEn || r.type,
  },

  personnel: {
    title: "Personalia",
    singular: "Personel",
    api: "/api/personnel",
    base: "/admin/personnel",
    folder: "personnel",
    defaults: { category: "Pengurus Inti", sortOrder: 0, isActive: true },
    fields: [
      { name: "photo", label: "Foto", type: "image", hint: "Foto potret, wajah terlihat jelas." },
      { name: "name", label: "Nama lengkap", type: "text", required: true },
      { name: "category", label: "Kategori", type: "select", options: [["Pembina", "Pembina"], ["Pengurus Inti", "Pengurus Inti"], ["Bidang-Bidang", "Bidang-Bidang"], ["Lainnya", "Lainnya"]], half: true, hint: "Pembina dengan jabatan Ketua/Sekretaris tampil sebagai kartu besar." },
      { name: "sortOrder", label: "Urutan", type: "number", half: true },
      ...pair("role", "Jabatan", "text", { required: true }),
      ...pair("bio", "Bio singkat", "textarea"),
      { name: "isActive", label: "Tampilkan di website", type: "toggle" },
    ],
    thumb: (r) => r.photo,
    round: true,
    primary: (r) => r.name,
    secondary: (r) => `${r.roleId || r.roleEn} · ${r.category}`,
    filters: [{ key: "category", label: "Kategori", options: ["Pembina", "Pengurus Inti", "Bidang-Bidang", "Lainnya"].map((v) => ({ value: v, label: v })) }, activeFilter],
  },

  programs: {
    title: "Program",
    singular: "Program",
    api: "/api/programs",
    base: "/admin/programs",
    folder: "programs",
    defaults: { emoji: "📖", sortOrder: 0, isActive: true, images: [] },
    fields: [
      { name: "images", label: "Foto program", type: "images", hint: "Bisa lebih dari satu — tampil bergantian. Foto pertama = foto utama." },
      ...pair("title", "Judul", "text", { required: true }),
      { name: "emoji", label: "Emoji", type: "text", half: true, hint: "Tampil bila belum ada foto." },
      { name: "sortOrder", label: "Urutan", type: "number", half: true },
      ...pair("description", "Deskripsi", "textarea"),
      { name: "isActive", label: "Tampilkan di website", type: "toggle" },
    ],
    fromItem: (it) => ({ ...it, images: it.images?.length ? it.images : it.image ? [it.image] : [] }),
    toApi: (v) => ({ ...v, image: v.images[0] || null }),
    thumb: (r) => r.images?.[0] || r.image,
    primary: (r) => `${r.emoji} ${r.titleEn}`,
    secondary: (r) => `${r.images?.length || 0} foto`,
    filters: [activeFilter],
  },

  activities: {
    title: "Jadwal Jumat",
    singular: "Jadwal",
    api: "/api/activities",
    base: "/admin/activities",
    defaults: { type: "learning", sortOrder: 0 },
    fields: [
      { name: "type", label: "Sesi", type: "select", options: [["learning", "English Learning"], ["worship", "Worship Together"]], half: true },
      { name: "time", label: "Waktu", type: "text", required: true, half: true, placeholder: "17:30 - 18:00" },
      ...pair("activity", "Nama kegiatan", "text", { required: true }),
      ...pair("description", "Keterangan", "textarea"),
      { name: "sortOrder", label: "Urutan", type: "number" },
    ],
    primary: (r) => r.activityEn,
    secondary: (r) => `${r.time} · ${r.type === "learning" ? "English Learning" : "Worship"}`,
    icon: "clock",
    filters: [{ key: "type", label: "Sesi", options: [{ value: "learning", label: "English Learning" }, { value: "worship", label: "Worship" }] }],
  },

  missions: {
    title: "Mission Trip",
    singular: "Mission Trip",
    api: "/api/missions",
    base: "/admin/missions",
    folder: "missions",
    defaults: { sortOrder: 0, isActive: true },
    fields: [
      { name: "image", label: "Foto", type: "image", hint: "Beberapa foto untuk satu perjalanan? Buat beberapa data dengan judul (EN) yang sama — otomatis digabung jadi satu slider." },
      ...pair("title", "Judul / lokasi", "text", { required: true }),
      ...pair("dateLabel", "Label tanggal", "text", { placeholder: "Juli 2026" }),
      ...pair("description", "Cerita", "textarea"),
      { name: "sortOrder", label: "Urutan", type: "number" },
      { name: "isActive", label: "Tampilkan di website", type: "toggle" },
    ],
    thumb: (r) => r.image,
    primary: (r) => r.titleEn,
    secondary: (r) => r.dateLabelEn || "",
    filters: [activeFilter],
  },

  news: {
    title: "Berita",
    singular: "Berita",
    api: "/api/news",
    base: "/admin/news",
    folder: "news",
    defaults: { tagEn: "News", tagId: "Berita", isActive: true, publishedAt: today() },
    fields: [
      { name: "image", label: "Flyer / foto", type: "image", hint: "Flyer tampil utuh (tidak terpotong). Rasio 4:5 paling pas." },
      ...pair("title", "Judul", "text", { required: true }),
      ...pair("tag", "Label"),
      { name: "publishedAt", label: "Tanggal terbit", type: "date" },
      ...pair("content", "Isi berita", "textarea", { rows: 6 }),
      { name: "isActive", label: "Tampilkan di website", type: "toggle" },
    ],
    fromItem: (it) => ({ ...it, publishedAt: dateOnly(it.publishedAt) }),
    thumb: (r) => r.image,
    primary: (r) => r.titleEn,
    secondary: (r) => `${r.tagEn} · ${fmt(r.publishedAt)}`,
    filters: [activeFilter],
  },

  guestSpeakers: {
    title: "Guest Speaker",
    singular: "Guest Speaker",
    api: "/api/guest-speakers",
    folder: "speakers",
    defaults: { isActive: true, dateServed: today() },
    fields: [
      { name: "image", label: "Foto", type: "image", required: true },
      { name: "name", label: "Nama", type: "text", required: true },
      { name: "origin", label: "Asal / gereja", type: "text" },
      { name: "dateServed", label: "Tanggal melayani", type: "date", required: true },
      { name: "isActive", label: "Tampilkan di beranda", type: "toggle" },
    ],
    fromItem: (it) => ({ ...it, dateServed: dateOnly(it.dateServed) }),
    thumb: (r) => r.image,
    round: true,
    primary: (r) => r.name,
    secondary: (r) => `${r.origin || "—"} · ${fmt(r.dateServed)}`,
    filters: [activeFilter],
  },

  weeklyActivities: {
    title: "Galeri Mingguan",
    singular: "Galeri",
    api: "/api/weekly-activities",
    folder: "weekly",
    defaults: { isActive: true, activityDate: today(), photos: [] },
    fields: [
      ...pair("title", "Judul acara", "text", { required: true }),
      { name: "activityDate", label: "Tanggal", type: "date", required: true, half: true },
      { name: "video", label: "Link video YouTube (opsional)", type: "text", placeholder: "https://youtu.be/…", half: true },
      { name: "photos", label: "Foto kegiatan", type: "images", max: 60 },
      { name: "isActive", label: "Tampilkan di website", type: "toggle" },
    ],
    fromItem: (it) => ({ ...it, activityDate: dateOnly(it.activityDate), photos: (it.photos || []).map((p) => p.image) }),
    thumb: (r) => r.photos?.[0]?.image || r.photos?.[0],
    primary: (r) => r.titleEn,
    secondary: (r) => `${fmt(r.activityDate)} · ${r.photos?.length || 0} foto${r.video ? " · video" : ""}`,
    filters: [activeFilter],
  },

  care: {
    title: "M-YES Care",
    singular: "Kegiatan Care",
    api: "/api/care",
    base: "/admin/care",
    folder: "care",
    defaults: { isActive: true, activityDate: today(), photos: [], videos: "" },
    fields: [
      ...pair("title", "Judul kegiatan", "text", { required: true }),
      { name: "activityDate", label: "Tanggal", type: "date", required: true },
      ...pair("description", "Deskripsi", "textarea", { rows: 5 }),
      { name: "photos", label: "Foto kegiatan", type: "images", max: 60 },
      { name: "videos", label: "Link video YouTube", type: "textarea", rows: 3, placeholder: "Satu link per baris", hint: "Satu link per baris, contoh: https://youtu.be/abc123" },
      { name: "isActive", label: "Tampilkan di website", type: "toggle" },
    ],
    fromItem: (it) => ({
      ...it,
      activityDate: dateOnly(it.activityDate),
      photos: (it.media || []).filter((m) => m.type === "IMAGE").map((m) => m.url),
      videos: (it.media || []).filter((m) => m.type === "YOUTUBE").map((m) => `https://youtu.be/${m.url}`).join("\n"),
    }),
    toApi: ({ photos, videos, ...v }) => ({
      ...v,
      media: [...photos.map((url) => ({ type: "IMAGE", url })), ...String(videos || "").split(/\s+/).filter(Boolean).map((url) => ({ type: "YOUTUBE", url }))],
    }),
    validate: (v) => {
      const bad = String(v.videos || "").split(/\s+/).filter(Boolean).find((u) => !youtubeId(u));
      return bad ? { videos: `Link YouTube tidak dikenali: ${bad}` } : {};
    },
    thumb: (r) => r.media?.find((m) => m.type === "IMAGE")?.url,
    primary: (r) => r.titleEn,
    secondary: (r) => `${fmt(r.activityDate)} · ${r.media?.length || 0} media`,
    filters: [activeFilter],
  },
};
