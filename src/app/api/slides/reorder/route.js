import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { apiError, requireAdmin } from "@/lib/api-auth";
import { reorderSchema } from "@/lib/validation";

/** Simpan urutan hero slider hasil drag-and-drop. */
export async function PUT(req) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const { ids } = reorderSchema.parse(await req.json());
    await prisma.$transaction(ids.map((id, i) => prisma.slide.update({ where: { id }, data: { sortOrder: i } })));
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (err) {
    return apiError(err, "Gagal menyimpan urutan.");
  }
}
