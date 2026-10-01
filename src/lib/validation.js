import { z } from "zod";
import { youtubeId } from "./youtube";

/**
 * Validasi input semua API admin (whitelist field — field lain diabaikan,
 * sehingga tidak ada "mass assignment" ke Prisma).
 */

// Teks opsional: string kosong disimpan sebagai null.
const opt = (max = 500) =>
  z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => (typeof v === "string" ? v.trim() : ""))
    .refine((v) => v.length <= max, `Maksimal ${max} karakter`)
    .transform((v) => (v ? v : null));

const req = (max = 300, label = "Wajib diisi") => z.string({ error: label }).trim().min(1, label).max(max, `Maksimal ${max} karakter`);

// URL gambar: https://... atau path lokal /...
const imageUrl = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === "" || /^https:\/\//.test(v) || v.startsWith("/"), "URL gambar tidak valid");
const optImage = z
  .union([imageUrl, z.null(), z.undefined()])
  .transform((v) => (v ? v : null));

const link = z
  .union([z.string().trim().max(500), z.null(), z.undefined()])
  .transform((v) => (v ? v : null))
  .refine((v) => !v || /^(https?:\/\/|\/|#|mailto:|tel:)/.test(v), "Link harus diawali https://, / atau #");

const intish = z.coerce.number().int().min(0).max(100000).catch(0);
const bool = z.union([z.boolean(), z.string(), z.number(), z.null(), z.undefined()]).transform((v) => v === true || v === "true" || v === "on" || v === 1);
const dateish = z.coerce.date({ error: "Tanggal tidak valid" });

export const slideSchema = z.object({
  type: z.enum(["activities", "social_media", "news", "mission_trip", "custom"]).catch("custom"),
  titleEn: req(200, "Judul (EN) wajib diisi"),
  titleId: opt(200),
  descriptionEn: opt(1000),
  descriptionId: opt(1000),
  overlineEn: opt(120),
  overlineId: opt(120),
  buttonTextEn: opt(60),
  buttonTextId: opt(60),
  buttonLink: link,
  image: optImage,
  backgroundImage: optImage,
  backgroundColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Warna harus format #RRGGBB")
    .catch("#0a1628"),
  sortOrder: intish,
  isActive: bool,
});

export const personnelSchema = z.object({
  name: req(120, "Nama wajib diisi"),
  category: z.enum(["Pembina", "Pengurus Inti", "Bidang-Bidang", "Lainnya"]).catch("Lainnya"),
  roleEn: req(120, "Jabatan (EN) wajib diisi"),
  roleId: opt(120),
  bioEn: opt(2000),
  bioId: opt(2000),
  photo: optImage,
  sortOrder: intish,
  isActive: bool,
});

export const programSchema = z.object({
  titleEn: req(150, "Judul (EN) wajib diisi"),
  titleId: opt(150),
  descriptionEn: opt(3000),
  descriptionId: opt(3000),
  emoji: z.string().trim().max(8).catch("📖").transform((v) => v || "📖"),
  image: optImage,
  images: z.array(imageUrl).max(20, "Maksimal 20 foto").catch([]),
  sortOrder: intish,
  isActive: bool,
});

export const activitySchema = z.object({
  type: z.enum(["worship", "learning"]).catch("worship"),
  time: req(40, "Waktu wajib diisi"),
  activityEn: req(150, "Nama kegiatan (EN) wajib diisi"),
  activityId: opt(150),
  descriptionEn: opt(1000),
  descriptionId: opt(1000),
  sortOrder: intish,
});

export const missionSchema = z.object({
  titleEn: req(150, "Judul (EN) wajib diisi"),
  titleId: opt(150),
  dateLabelEn: opt(80),
  dateLabelId: opt(80),
  descriptionEn: opt(3000),
  descriptionId: opt(3000),
  image: optImage,
  sortOrder: intish,
  isActive: bool,
});

export const newsSchema = z.object({
  titleEn: req(200, "Judul (EN) wajib diisi"),
  titleId: opt(200),
  tagEn: z.string().trim().max(40).catch("News").transform((v) => v || "News"),
  tagId: z.string().trim().max(40).catch("Berita").transform((v) => v || "Berita"),
  contentEn: opt(10000),
  contentId: opt(10000),
  image: optImage,
  publishedAt: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => (v ? new Date(v) : null))
    .refine((v) => v === null || !Number.isNaN(v.getTime()), "Tanggal tidak valid"),
  isActive: bool,
});

export const guestSpeakerSchema = z.object({
  name: req(120, "Nama wajib diisi"),
  origin: opt(150),
  image: imageUrl.refine((v) => v.length > 0, "Foto wajib diunggah"),
  dateServed: dateish,
  isActive: bool.default(true),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Nama terlalu pendek").max(100),
  email: z.string().trim().email("Email tidak valid").max(150),
  message: z.string().trim().min(5, "Pesan terlalu pendek").max(3000, "Pesan terlalu panjang"),
});

const youtube = z.string().trim().max(300);

export const weeklyGallerySchema = z.object({
  titleEn: req(200, "Judul (EN) wajib diisi"),
  titleId: opt(200),
  activityDate: dateish,
  isActive: bool,
  video: z
    .union([youtube, z.null(), z.undefined()])
    .transform((v) => (v ? v : null))
    .refine((v) => !v || /^https:\/\//.test(v), "Link video harus diawali https://"),
  photos: z.array(imageUrl).max(60, "Maksimal 60 foto").catch([]),
});

export const careSchema = z.object({
  titleEn: req(200, "Judul (EN) wajib diisi"),
  titleId: opt(200),
  descriptionEn: opt(5000),
  descriptionId: opt(5000),
  activityDate: dateish,
  isActive: bool.default(true),
  media: z
    .array(
      z.object({
        type: z.enum(["IMAGE", "YOUTUBE"]),
        url: z.string().trim().min(1).max(1000),
      }),
    )
    .max(60)
    .catch([])
    .transform((list) =>
      list
        .map((m) => (m.type === "YOUTUBE" ? { type: "YOUTUBE", url: youtubeId(m.url) } : m))
        .filter((m) => m.url && (m.type === "YOUTUBE" || /^https:\/\//.test(m.url) || m.url.startsWith("/"))),
    ),
});

export const homeMomentSchema = z.object({
  image: imageUrl.refine((v) => v.length > 0, "Foto wajib diunggah"),
  sortOrder: intish,
  isActive: bool.default(true),
});

// Pengaturan: hanya key yang dikenal yang boleh ditulis.
export const SETTING_KEYS = {
  about: ["about_description", "vision", "mission"],
  social: ["social_instagram", "social_facebook", "social_tiktok", "social_whatsapp", "social_youtube"],
  contact: ["contact_email", "contact_phone", "contact_address", "contact_schedule", "contact_map_url", "contact_map_embed", "contact_area", "contact_admin_name"],
  general: ["main_background"],
  theme: ["theme_accent"],
};

export const settingSchema = z
  .object({
    key: z.string().trim(),
    valueEn: z.union([z.string().max(5000), z.null(), z.undefined()]).transform((v) => v ?? ""),
    valueId: z.union([z.string().max(5000), z.null(), z.undefined()]).transform((v) => v ?? ""),
    group: z.string().trim().optional(),
  })
  .transform((s, ctx) => {
    const group = Object.keys(SETTING_KEYS).find((g) => SETTING_KEYS[g].includes(s.key));
    if (!group) {
      ctx.addIssue({ code: "custom", message: `Pengaturan "${s.key}" tidak dikenal`, path: ["key"] });
      return z.NEVER;
    }
    return { ...s, group };
  });

export const reorderSchema = z.object({ ids: z.array(z.coerce.number().int().positive()).min(1).max(500) });

export const passwordSchema = z
  .object({
    current: z.string().min(1, "Isi password lama"),
    next: z.string().min(10, "Password baru minimal 10 karakter").max(200),
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, { message: "Konfirmasi password tidak sama", path: ["confirm"] });
