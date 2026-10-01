import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { collectionHandlers } from "@/lib/crud";
import { apiError, parseId, requireAdmin } from "@/lib/api-auth";
import { guestSpeakerSchema } from "@/lib/validation";

export const { GET, POST } = collectionHandlers("guestSpeaker", guestSpeakerSchema, { orderBy: { dateServed: "desc" } });

/** Kompatibel dengan versi lama: DELETE /api/guest-speakers?id=1 */
export async function DELETE(request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const id = parseId(new URL(request.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });
  try {
    await prisma.guestSpeaker.delete({ where: { id } });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (err) {
    return apiError(err, "Gagal menghapus data.");
  }
}
