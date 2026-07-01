import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const galleries = await prisma.activityGallery.findMany({
      include: { photos: true },
      orderBy: { activityDate: "desc" },
    });
    return NextResponse.json(galleries);
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { titleEn, titleId, activityDate, isActive, photos, video } = body;

    if (!titleEn || !activityDate) {
      return NextResponse.json(
        { error: "Judul (EN) dan tanggal kegiatan wajib diisi" },
        { status: 400 },
      );
    }

    // 1. Simpan data induk galeri beserta link videonya
    const gallery = await prisma.activityGallery.create({
      data: {
        titleEn,
        titleId: titleId || null,
        activityDate: new Date(activityDate),
        isActive: Boolean(isActive),
        video: video || null,
      },
    });

    // 2. Simpan setiap path foto ke tabel ActivityPhoto
    if (Array.isArray(photos) && photos.length > 0) {
      for (const photoPath of photos) {
        if (photoPath) {
          await prisma.activityPhoto.create({
            data: {
              image: photoPath,
              galleryId: gallery.id,
            },
          });
        }
      }
    }

    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error("Error saving gallery:", error);
    return NextResponse.json(
      { error: "Failed to save gallery" },
      { status: 500 },
    );
  }
}

// FUNGSI BARU UNTUK MENGHAPUS DATA
export async function DELETE(request) {
  try {
    // Mengambil ID dari URL (contoh: /api/weekly-activities?id=1)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 },
      );
    }

    // Menghapus data berdasarkan ID (karena ID kita sekarang Int, gunakan parseInt)
    await prisma.activityGallery.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    return NextResponse.json(
      { error: "Gagal menghapus galeri" },
      { status: 500 },
    );
  }
}
