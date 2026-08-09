import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req, { params }) {
  try {
    const data = await req.json();

    // ==========================================
    // LOGIKA PERBAIKAN FORMAT ARRAY UNTUK IMAGES
    // ==========================================
    if (data.images !== undefined) {
      if (typeof data.images === "string") {
        // Jika form mengirim string (misal dipisah koma jika multi-upload, atau cuma 1 link)
        data.images = data.images
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url !== "");
      } else if (data.images === null) {
        data.images = [];
      }
    }

    // Memastikan sortOrder dikonversi ke Integer jika ada
    if (data.sortOrder !== undefined) {
      data.sortOrder = parseInt(data.sortOrder, 10) || 0;
    }

    const item = await prisma.program.update({ 
      where: { id: parseInt(params.id) }, 
      data 
    });
    
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error di PUT /api/programs/[id]:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui data program", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await prisma.program.delete({ 
      where: { id: parseInt(params.id) } 
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error di DELETE /api/programs/[id]:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data program", details: error.message },
      { status: 500 }
    );
  }
}