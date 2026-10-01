import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { authOptions } from "./auth";

/**
 * Wajib dipanggil di SETIAP route API yang mengubah data atau membaca data privat.
 * Mengembalikan session bila login, atau NextResponse 401 bila tidak.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: "Sesi admin berakhir. Silakan login ulang." }, { status: 401 }) };
  }
  return { session };
}

/** Respons error yang ramah (tanpa membocorkan detail internal). */
export function apiError(err, fallback = "Terjadi kesalahan. Coba lagi.") {
  if (err instanceof ZodError) {
    const first = err.issues[0];
    const field = first?.path?.join(".");
    return NextResponse.json(
      { error: field ? `${field}: ${first.message}` : first?.message || "Data tidak valid.", issues: err.issues },
      { status: 400 },
    );
  }
  if (err?.code === "P2025") return NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });
  if (err?.code === "P2002") return NextResponse.json({ error: "Data dengan nilai ini sudah ada." }, { status: 409 });
  console.error("[api]", err);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

export function parseId(value) {
  const id = Number.parseInt(String(value), 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}
