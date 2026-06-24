import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Admin mengambil daftar pesan
export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" }, // Yang paling baru di atas
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}

// POST: Pengunjung mengirim pesan dari halaman depan
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Semua kolom wajib diisi" },
        { status: 400 },
      );
    }

    const newMessage = await prisma.contactMessage.create({
      data: { name, email, message },
    });

    return NextResponse.json({ success: true, data: newMessage });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengirim pesan" },
      { status: 500 },
    );
  }
}

// DELETE: Admin menghapus pesan
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

    await prisma.contactMessage.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghapus pesan" },
      { status: 500 },
    );
  }
}
