import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Mengambil semua data (GET)
export async function GET() {
  try {
    const activities = await prisma.careActivity.findMany({
      include: { media: true }, // Ambil juga relasi foto/videonya
      orderBy: { activityDate: "desc" },
    });
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching care activities:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// Menambah data baru (POST)
export async function POST(request) {
  try {
    const body = await request.json();
    const { titleEn, titleId, descriptionEn, descriptionId, activityDate, isActive, media } = body;

    const newActivity = await prisma.careActivity.create({
      data: {
        titleEn,
        titleId,
        descriptionEn,
        descriptionId,
        activityDate: new Date(activityDate),
        isActive: isActive ?? true,
        media: {
          create: media, // Media ini berisi array objek: [{ type: "IMAGE", url: "..." }, { type: "YOUTUBE", url: "..." }]
        },
      },
      include: { media: true },
    });

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error("Error creating care activity:", error);
    return NextResponse.json({ error: "Gagal menambahkan data" }, { status: 500 });
  }
}