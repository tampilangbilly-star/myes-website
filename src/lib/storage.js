import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB per foto
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/heic", "image/heif"];

let client = null;
function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, { auth: { persistSession: false } });
  return client;
}

export function validateImage(file) {
  if (!file || typeof file === "string" || !file.size) return "Tidak ada file yang diunggah.";
  if (!ALLOWED.includes(file.type)) return "Hanya file gambar (JPG, PNG, WebP, AVIF, HEIC) yang diizinkan.";
  if (file.size > MAX_UPLOAD_BYTES) return "Ukuran foto maksimal 8 MB.";
  return null;
}

/**
 * Kompres & ubah ukuran (maks 2000px, WebP q80, orientasi EXIF diperbaiki, metadata/GPS dibuang),
 * lalu simpan ke Supabase Storage (bucket publik "uploads").
 * Tanpa kredensial Supabase (development lokal), file disimpan di public/uploads.
 */
export async function storeImage(file, folder = "uploads") {
  const safeFolder = String(folder).replace(/[^a-z0-9/_-]/gi, "").replace(/\.\./g, "").slice(0, 60) || "uploads";
  const input = Buffer.from(await file.arrayBuffer());
  const output = await sharp(input, { failOn: "error" })
    .rotate()
    .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  const base = path.parse(file.name || "foto").name.toLowerCase().replace(/[^a-z0-9-]+/g, "-").slice(0, 40) || "foto";
  const filename = `${safeFolder}/${Date.now()}-${base}.webp`;

  const sb = supabase();
  if (sb) {
    const bucket = process.env.SUPABASE_BUCKET || "uploads";
    const { error } = await sb.storage.from(bucket).upload(filename, output, { contentType: "image/webp", cacheControl: "31536000", upsert: false });
    if (error) throw error;
    return sb.storage.from(bucket).getPublicUrl(filename).data.publicUrl;
  }
  const full = path.join(process.cwd(), "public", "uploads", filename);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, output);
  return `/uploads/${filename}`;
}
