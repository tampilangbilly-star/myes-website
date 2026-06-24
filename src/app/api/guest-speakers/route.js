import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

// GET: Mengambil semua data pembicara
export async function GET() {
  try {
    const speakers = await prisma.guestSpeaker.findMany({
      orderBy: { dateServed: "desc" }, // Urutkan dari yang terbaru
    });
    return NextResponse.json(speakers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

// POST: Menambahkan pembicara baru & upload foto
export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const origin = formData.get("origin");
    const dateServed = formData.get("dateServed");
    const image = formData.get("image");

    if (!name || !dateServed || !image || image.name === "undefined") {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    // Proses simpan file foto
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = Date.now() + "-" + image.name.replace(/\s+/g, "-");
    const filepath = path.join(process.cwd(), "public", "uploads", filename);
    await writeFile(filepath, buffer);

    // Simpan ke Database
    const speaker = await prisma.guestSpeaker.create({
      data: {
        name,
        origin,
        dateServed: new Date(dateServed),
        image: filename,
      },
    });

    return NextResponse.json(speaker);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data" },
      { status: 500 },
    );
  }
}

// DELETE: Menghapus data pembicara
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 },
      );

    await prisma.guestSpeaker.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghapus data" },
      { status: 500 },
    );
  }
}
