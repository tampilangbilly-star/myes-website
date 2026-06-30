import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data activities" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    // Normalisasi tipe data sebelum masuk database
    if (data.sortOrder !== undefined && data.sortOrder !== "") {
      data.sortOrder = parseInt(data.sortOrder) || 0;
    }
    if (data.isActive !== undefined) {
      data.isActive = Boolean(data.isActive);
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
