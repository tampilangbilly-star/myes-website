import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    // Mengambil data kegiatan beserta foto-fotonya
    const galleries = await prisma.activityGallery.findMany({
      include: { photos: true },
      orderBy: { activityDate: "desc" },
    });
    return NextResponse.json(galleries);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const titleEn = formData.get("titleEn");
    const titleId = formData.get("titleId");
    const activityDate = formData.get("activityDate");
    const isActive = formData.get("isActive") === "true";

    // Mengambil SEMUA file foto yang di-upload (Multiple)
    const photos = formData.getAll("photos");

    // 1. Simpan Data Induk ke tabel ActivityGallery
    const gallery = await prisma.activityGallery.create({
      data: {
        titleEn,
        titleId,
        activityDate: new Date(activityDate),
        isActive,
      },
    });

    // 2. Siapkan folder penyimpanan gambar
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // 3. Looping: Simpan setiap foto fisik dan catat namanya di database
    for (const photo of photos) {
      if (photo && photo.name) {
        const buffer = Buffer.from(await photo.arrayBuffer());
        // Buat nama file unik menggunakan penanda waktu
        const fileName = Date.now() + "-" + photo.name.replace(/\s+/g, "-");
        const filePath = path.join(uploadDir, fileName);

        // Simpan file fisik ke folder public/uploads
        await fs.writeFile(filePath, buffer);

        // Simpan nama file ke tabel ActivityPhoto
        await prisma.activityPhoto.create({
          data: {
            image: fileName,
            galleryId: gallery.id,
          },
        });
      }
    }

    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload gallery" },
      { status: 500 },
    );
  }
}
