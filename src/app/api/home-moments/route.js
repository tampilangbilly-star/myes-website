import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/** GET /api/home-moments — daftar semua (dipakai halaman admin). */
export async function GET() {
  try {
    const moments = await prisma.homeMoment.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(moments);
  } catch (error) {
    console.error("Error fetching home moments:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data momen" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/home-moments — tambah foto baru.
 * sortOrder dihitung otomatis (max + 1) agar admin tidak perlu
 * memikirkan urutan — cukup unggah foto, tampil paling akhir.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { image, isActive } = body;

    if (!image) {
      return NextResponse.json(
        { error: "Foto wajib diunggah" },
        { status: 400 },
      );
    }

    const last = await prisma.homeMoment.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const moment = await prisma.homeMoment.create({
      data: {
        image,
        sortOrder: (last?.sortOrder ?? -1) + 1,
        isActive: isActive === undefined ? true : Boolean(isActive),
      },
    });

    return NextResponse.json(moment, { status: 201 });
  } catch (error) {
    console.error("Error saving home moment:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan foto" },
      { status: 500 },
    );
  }
}

/** DELETE /api/home-moments?id=123 — hapus foto (langsung hilang dari homepage). */
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

    await prisma.homeMoment.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: "Berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting home moment:", error);
    return NextResponse.json(
      { error: "Gagal menghapus foto" },
      { status: 500 },
    );
  }
}