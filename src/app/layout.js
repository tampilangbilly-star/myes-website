import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/SocialFloat";
import { getSocialLinks } from "@/lib/helpers";
import { cookies } from "next/headers";

export const metadata = {
  title: "M-YES | Manado Youth English Service",
  description: "Community for Youth English Service in Manado",
  icons: {
    icon: "/logo-myes.png", // Ini adalah baris baru untuk memanggil gambar logo
  },
};

export default async function RootLayout({ children }) {
  // 1. Ambil preferensi bahasa dari sistem cookie Anda
  const cookieStore = cookies();
  const lang = cookieStore.get("lang")?.value || "en";

  // 2. Ambil data link sosial dinamis langsung dari database
  let socials = {};
  try {
    socials = await getSocialLinks();
  } catch (e) {
    // Fallback jika terjadi error pada database
    console.error("Gagal mengambil data sosial:", e);
    socials = {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      whatsapp: "https://wa.me/6281234567890",
    };
  }

  return (
    <html lang={lang}>
      <body>
        {/* 3. Render Navbar Elegan */}
        <Navbar lang={lang} />

        {/* 4. Konten Utama Halaman */}
        <main>{children}</main>

        {/* 5. Render Footer */}
        <Footer lang={lang} />

        {/* 6. Render Orb Media Sosial Melayang */}
        <SocialFloat socials={socials} />
      </body>
    </html>
  );
}
