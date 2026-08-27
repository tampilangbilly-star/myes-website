import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Mengambil 1 data spesifik untuk form edit (GET)
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    const activity = await prisma.careActivity.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!activity) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// Memperbarui data (PUT)
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { titleEn, titleId, descriptionEn, descriptionId, activityDate, isActive, media } = body;

    // Gunakan transaksi: Hapus media lama, ganti dengan yang baru dari form admin
    const updatedActivity = await prisma.$transaction(async (tx) => {
      // 1. Bersihkan media lama
      await tx.careMedia.deleteMany({
        where: { careActivityId: id },
      });

      // 2. Update teks dan masukkan media yang baru diatur
      return await tx.careActivity.update({
        where: { id },
        data: {
          titleEn,
          titleId,
          descriptionEn,
          descriptionId,
          activityDate: new Date(activityDate),
          isActive: isActive ?? true,
          media: {
            create: media,
          },
        },
        include: { media: true },
      });
    });

    return NextResponse.json(updatedActivity);
  } catch (error) {
    console.error("Error updating care activity:", error);
    return NextResponse.json({ error: "Gagal memperbarui data" }, { status: 500 });
  }
}

// Menghapus data (DELETE)
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    await prisma.careActivity.delete({
      where: { id },
    });
    // Catatan: Foto/video di tabel care_media akan otomatis ikut terhapus karena kita pasang "onDelete: Cascade" di schema Prisma.
    
    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}