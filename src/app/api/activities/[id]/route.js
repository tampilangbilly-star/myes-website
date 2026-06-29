import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PERBAIKAN: File asli memiliki handler GET dan POST yang salah tempat di sini.
// GET dan POST seharusnya ada di route.js induk (/api/activities/route.js).
// File [id] ini seharusnya hanya menangani operasi pada satu record: PUT dan DELETE.

export async function PUT(req, { params }) {
  try {
    const data = await req.json();

    if (data.sortOrder !== undefined && data.sortOrder !== "")
      data.sortOrder = parseInt(data.sortOrder) || 0;
    if (data.isActive !== undefined) data.isActive = Boolean(data.isActive);

    const item = await prisma.activity.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate activity" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await prisma.activity.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json(
      { error: "Gagal menghapus activity" },
      { status: 500 },
    );
  }
}
