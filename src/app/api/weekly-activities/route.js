import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { apiError, parseId, requireAdmin } from "@/lib/api-auth";
import { weeklyGallerySchema } from "@/lib/validation";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    return NextResponse.json(await prisma.activityGallery.findMany({ include: { photos: true }, orderBy: { activityDate: "desc" } }));
  } catch (err) {
    return apiError(err, "Gagal mengambil data.");
  }
}

export async function POST(request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const { photos, ...data } = weeklyGallerySchema.parse(await request.json());
    const gallery = await prisma.activityGallery.create({
      data: { ...data, photos: { create: photos.map((image) => ({ image })) } },
      include: { photos: true },
    });
    revalidatePath("/", "layout");
    return NextResponse.json(gallery, { status: 201 });
  } catch (err) {
    return apiError(err, "Gagal menyimpan galeri.");
  }
}

/** Kompatibel dengan versi lama: DELETE /api/weekly-activities?id=1 */
export async function DELETE(request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const id = parseId(new URL(request.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });
  try {
    await prisma.activityGallery.delete({ where: { id } });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (err) {
    return apiError(err, "Gagal menghapus galeri.");
  }
}
