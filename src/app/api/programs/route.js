import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const items = await prisma.program.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req) {
  try {
    const data = await req.json();

    // ==========================================
    // LOGIKA PERBAIKAN FORMAT ARRAY UNTUK IMAGES
    // ==========================================
    if (data.images) {
      if (typeof data.images === "string") {
        // Jika data yang masuk berupa string biasa atau dipisah koma
        data.images = data.images
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url !== "");
      }
    } else {
      // Pastikan tetap menjadi array kosong jika tidak ada gambar
      data.images = [];
    }

    // (Opsional) Memastikan sortOrder dikonversi ke Integer untuk mencegah error tipe data
    if (data.sortOrder !== undefined) {
      data.sortOrder = parseInt(data.sortOrder, 10) || 0;
    }

    const item = await prisma.program.create({ data });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error di POST /api/programs:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data program", details: error.message },
      { status: 500 }
    );
  }
}