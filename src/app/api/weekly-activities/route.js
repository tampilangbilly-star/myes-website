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
    // Menambahkan 'video' dari body yang dikirim oleh AdminWeeklyActivities
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
        video: video || null, // <--- MENYIMPAN PATH VIDEO KE DATABASE
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
