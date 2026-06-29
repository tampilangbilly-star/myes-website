import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Pastikan SUPABASE_SERVICE_ROLE_KEY sudah ditambahkan di Environment Variables Vercel
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "uploads";

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 },
      );
    }

    const filename = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    // Upload ke bucket 'uploads' di Supabase
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filename, file, { upsert: true });

    if (error) throw error;

    // Ambil URL publik untuk disimpan ke database
    const {
      data: { publicUrl },
    } = supabase.storage.from("uploads").getPublicUrl(filename);

    return NextResponse.json({ path: publicUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file ke cloud." },
      { status: 500 },
    );
  }
}
