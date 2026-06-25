import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || ""; // Folder opsional dari form

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Buat nama file unik
    const filename = Date.now() + "-" + file.name.replace(/\s+/g, "-");

    // 2. Tentukan folder tujuan (public/uploads atau sub-foldernya)
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

    // 3. Buat foldernya secara otomatis jika belum ada
    await mkdir(uploadDir, { recursive: true });

    // 4. Simpan fisik file ke server
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // 5. Kembalikan jalur file-nya ke AdminForm / SlideForm
    const returnedPath = folder ? `${folder}/${filename}` : filename;

    return NextResponse.json({ path: returnedPath });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file" },
      { status: 500 },
    );
  }
}
