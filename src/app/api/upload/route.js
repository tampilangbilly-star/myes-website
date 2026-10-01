import { NextResponse } from "next/server";
import { apiError, requireAdmin } from "@/lib/api-auth";
import { storeImage, validateImage } from "@/lib/storage";

export const runtime = "nodejs";

/**
 * Upload foto (khusus admin). Foto otomatis dikompres ke WebP & diperkecil maks 2000px
 * sebelum disimpan ke Supabase Storage — hemat kuota free plan.
 */
export async function POST(req) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const invalid = validateImage(file);
    if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });
    const url = await storeImage(file, formData.get("folder") || "uploads");
    return NextResponse.json({ url, path: url });
  } catch (err) {
    return apiError(err, "Gagal mengunggah foto. Pastikan file berupa gambar yang valid.");
  }
}
