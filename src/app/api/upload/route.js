import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "general";

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 },
      );
    }

    // 1. Buat nama file unik
    const filename = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    // 2. Upload langsung ke Supabase Storage (ke dalam bucket 'uploads')
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false, // Jangan timpa jika ada file bernama sama
      });

    if (error) {
      console.error("Supabase Upload Error:", error);
      throw error;
    }

    // 3. Dapatkan URL publik dari gambar yang baru diunggah
    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filename);

    // 4. Kembalikan URL publik secara penuh ke database Anda
    return NextResponse.json({ path: publicUrlData.publicUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file ke cloud" },
      { status: 500 },
    );
  }
}
