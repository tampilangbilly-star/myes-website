import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/SocialFloat";
import { getLang } from "@/lib/helpers";
import { getSite } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";
import { defaultMetadata } from "@/lib/seo";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Sora({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["600", "700", "800"] });

export const metadata = defaultMetadata;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F8FAFC",
};

export default async function RootLayout({ children }) {
  const lang = await getLang();
  const site = await getSite(lang);

  return (
    <html lang={lang} data-accent={site.accent} data-default-accent={site.accent} className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        {/* Terapkan warna pilihan pengunjung sebelum render pertama (tanpa kedipan) */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
      </head>
      <body className="min-h-dvh">
        <SiteShell
          navbar={<Navbar lang={lang} info={{ schedule: site.contact.schedule, area: site.contact.area, socials: site.socials }} />}
          footer={<Footer lang={lang} />}
          floating={<SocialFloat phone={site.contact.phoneDigits} adminName={site.contact.adminName} lang={lang} />}
        >
          {children}
        </SiteShell>
      </body>
    </html>
  );
}