import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    return NextResponse.json(
      await prisma.activity.findMany({ orderBy: { sortOrder: "asc" } }),
    );
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}

// PERBAIKAN: Route ini dipanggil dari AdminForm via JSON (bukan FormData).
// Sebelumnya POST menggunakan req.formData() yang tidak cocok dengan cara AdminForm mengirim data,
// sehingga semua field termasuk image selalu kosong / NULL.
export async function POST(req) {
  try {
    const data = await req.json();

    if (data.sortOrder !== undefined && data.sortOrder !== "")
      data.sortOrder = parseInt(data.sortOrder) || 0;
    if (data.isActive !== undefined) data.isActive = Boolean(data.isActive);

    const item = await prisma.activity.create({ data });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error saving activity:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan activity" },
      { status: 500 },
    );
  }
}
