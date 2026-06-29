import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "";

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 },
      );
    }

    // Validasi ukuran file (maks 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file terlalu besar. Maksimal 5MB." },
        { status: 400 },
      );
    }

    // Validasi tipe file
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipe file tidak didukung: ${file.type}` },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Buat nama file unik
    const safeName = file.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.\-_]/g, "");
    const filename = `${Date.now()}-${safeName}`;

    // Tentukan folder tujuan
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

    // Buat folder jika belum ada
    await mkdir(uploadDir, { recursive: true });

    // Simpan file ke disk
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Kembalikan path relatif (tanpa prefix /uploads/)
    // agar konsisten: folder/filename atau hanya filename
    const returnedPath = folder ? `${folder}/${filename}` : filename;

    return NextResponse.json({ path: returnedPath });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file. Silakan coba lagi." },
      { status: 500 },
    );
  }
}
