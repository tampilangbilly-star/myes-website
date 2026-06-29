import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PERBAIKAN: Route asli melakukan upload file sendiri (writeFile) langsung di sini,
// berbeda dengan sistem upload terpusat di /api/upload.
// Ini menyebabkan inkonsistensi: gambar tersimpan tanpa subfolder,
// sementara halaman lain menyimpan ke subfolder (personnel/, slides/, dll).
//
// Solusi: Pisahkan alur menjadi 2 langkah dari sisi frontend (GuestSpeakersAdmin):
//   1. Upload foto dulu ke /api/upload  → dapat path
//   2. Kirim data JSON (termasuk path foto) ke /api/guest-speakers
//
// Route ini sekarang hanya menerima JSON, BUKAN FormData.

export async function GET() {
  try {
    const speakers = await prisma.guestSpeaker.findMany({
      orderBy: { dateServed: "desc" },
    });
    return NextResponse.json(speakers);
  } catch (error) {
    console.error("Error fetching speakers:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, origin, dateServed, image } = body;

    if (!name || !dateServed) {
      return NextResponse.json(
        { error: "Nama dan tanggal wajib diisi" },
        { status: 400 },
      );
    }

    const speaker = await prisma.guestSpeaker.create({
      data: {
        name,
        origin: origin || null,
        dateServed: new Date(dateServed),
        image: image || null, // path dari /api/upload, bisa null jika tidak ada foto
      },
    });

    return NextResponse.json(speaker);
  } catch (error) {
    console.error("Error saving speaker:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 },
      );
    }

    await prisma.guestSpeaker.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting speaker:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data" },
      { status: 500 },
    );
  }
}
