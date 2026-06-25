import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  const items = await prisma.activity.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const data = {};

    // Ambil data teks
    for (const [key, value] of formData.entries()) {
      if (key !== "image" && key !== "photo") {
        data[key] = value;
      }
    }

    // Konversi tipe data jika diperlukan
    if (data.sortOrder) data.sortOrder = parseInt(data.sortOrder);
    if (data.isActive !== undefined) data.isActive = data.isActive === "true";

    // Tangani Gambar (Bisa membaca nama field 'image' atau 'photo')
    const file = formData.get("image") || formData.get("photo");
    if (file && typeof file !== "string") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + "-" + file.name.replace(/\s+/g, "-");
      await writeFile(
        path.join(process.cwd(), "public/uploads", filename),
        buffer,
      );

      // Sesuaikan dengan nama kolom di database Anda (biasanya 'image' atau 'photo')
      data.image = filename;
    }

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
