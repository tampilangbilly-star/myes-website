import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { apiError, requireAdmin } from "@/lib/api-auth";
import { settingSchema } from "@/lib/validation";

export async function GET(req) {
  const { error } = await requireAdmin();
  if (error) return error;
  const group = new URL(req.url).searchParams.get("group");
  return NextResponse.json(await prisma.setting.findMany({ where: group ? { group } : {} }));
}

/** Simpan satu atau banyak pengaturan sekaligus (body: objek tunggal atau array). */
export async function POST(req) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const body = await req.json();
    const list = (Array.isArray(body) ? body : [body]).map((s) => settingSchema.parse(s));
    const saved = await prisma.$transaction(
      list.map(({ key, valueEn, valueId, group }) =>
        prisma.setting.upsert({ where: { key }, update: { valueEn, valueId, group }, create: { key, valueEn, valueId, group } }),
      ),
    );
    revalidatePath("/", "layout");
    return NextResponse.json(Array.isArray(body) ? saved : saved[0]);
  } catch (err) {
    return apiError(err, "Gagal menyimpan pengaturan.");
  }
}
