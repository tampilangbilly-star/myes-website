import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PERBAIKAN: Route asli melakukan upload file (writeFile) langsung di sini via FormData,
// tidak konsisten dengan sistem upload terpusat /api/upload.
//
// Solusi: Frontend (AdminWeeklyActivities) sekarang harus:
//   1. Upload setiap foto ke /api/upload terlebih dahulu → dapat array of paths
//   2. Kirim data JSON { titleEn, titleId, activityDate, isActive, photos: [path1, path2, ...] }
//      ke endpoint ini.
//
// Route ini sekarang hanya menerima JSON.

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
    const { titleEn, titleId, activityDate, isActive, photos } = body;

    if (!titleEn || !activityDate) {
      return NextResponse.json(
        { error: "Judul (EN) dan tanggal kegiatan wajib diisi" },
        { status: 400 },
      );
    }

    // 1. Simpan data induk galeri
    const gallery = await prisma.activityGallery.create({
      data: {
        titleEn,
        titleId: titleId || null,
        activityDate: new Date(activityDate),
        isActive: Boolean(isActive),
      },
    });

    // 2. Simpan setiap path foto ke tabel ActivityPhoto
    if (Array.isArray(photos) && photos.length > 0) {
      for (const photoPath of photos) {
        if (photoPath) {
          await prisma.activityPhoto.create({
            data: {
              image: photoPath, // path sudah diupload via /api/upload
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
