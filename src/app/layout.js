import "./globals.css";
import "./light-theme.css";
import SiteShell from "@/components/SiteShell";
import { getSocialLinks } from "@/lib/helpers";
import { cookies } from "next/headers";

export const metadata = {
  title: "M-YES | Manado Youth English Service",
  description: "Community for Youth English Service in Manado",
  icons: {
    icon: "/icon.png", // Ini adalah baris baru untuk memanggil gambar logo
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
        <SiteShell lang={lang} socials={socials}>{children}</SiteShell>
      </body>
    </html>
  );
}
