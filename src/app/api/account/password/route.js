import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { apiError, requireAdmin } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";
import { passwordSchema } from "@/lib/validation";

/** Ganti password admin yang sedang login. */
export async function POST(req) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  if (!rateLimit(`pwd:${session.user.email}`, 5, 15 * 60_000).ok) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi nanti." }, { status: 429 });
  }
  try {
    const { current, next } = passwordSchema.parse(await req.json());
    const user = await prisma.user.findFirst({ where: { email: { equals: session.user.email, mode: "insensitive" } } });
    if (!user || !(await bcrypt.compare(current, user.password))) {
      return NextResponse.json({ error: "Password lama salah." }, { status: 400 });
    }
    await prisma.user.update({ where: { id: user.id }, data: { password: await bcrypt.hash(next, 12) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return apiError(err, "Gagal mengganti password.");
  }
}
