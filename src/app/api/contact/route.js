import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { apiError, parseId, requireAdmin } from "@/lib/api-auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation";

// GET: hanya admin (sebelumnya terbuka untuk publik dan membocorkan semua pesan)
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(messages);
}

// POST: pengunjung mengirim pesan (dibatasi 5 pesan / 10 menit per IP, ada honeypot anti-spam)
export async function POST(request) {
  if (!rateLimit(`contact:${clientIp(request)}`, 5, 10 * 60_000).ok) {
    return NextResponse.json({ error: "Terlalu banyak pesan. Coba lagi beberapa menit lagi." }, { status: 429 });
  }
  try {
    const body = await request.json();
    if (body?.website) return NextResponse.json({ success: true }); // honeypot bot
    const data = contactSchema.parse(body);
    await prisma.contactMessage.create({ data });
    return NextResponse.json({ success: true });
  } catch (err) {
    return apiError(err, "Gagal mengirim pesan.");
  }
}

// PATCH: tandai sudah/belum dibaca
export async function PATCH(request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const { id, isRead } = await request.json();
    const pid = parseId(id);
    if (!pid) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    await prisma.contactMessage.update({ where: { id: pid }, data: { isRead: Boolean(isRead) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return apiError(err);
  }
}

// DELETE: hapus pesan (?id=)
export async function DELETE(request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const id = parseId(new URL(request.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return apiError(err, "Gagal menghapus pesan.");
  }
}
