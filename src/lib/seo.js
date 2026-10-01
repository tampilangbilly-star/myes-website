export const SITE_URL = (process.env.NEXTAUTH_URL || "https://myes.or.id").replace(/\/$/, "");
export const SITE_NAME = "M-YES | Manado Youth English Service";
const DESCRIPTION = "M-YES (Manado Youth English Service) — a Christian youth community in Manado that grows together in faith and English. Learn, grow, and make an impact.";

export const defaultMetadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: "%s | M-YES" },
  description: DESCRIPTION,
  applicationName: "M-YES",
  keywords: ["M-YES", "Manado Youth English Service", "English worship Manado", "komunitas pemuda Manado", "belajar bahasa Inggris gratis"],
  openGraph: {
    type: "website",
    siteName: "M-YES",
    title: SITE_NAME,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    alternateLocale: ["id_ID"],
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "M-YES — Belajar, Bertumbuh, Berdampak" }],
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: DESCRIPTION, images: ["/og-image.jpg"] },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
  alternates: { canonical: "/" },
};

/** Metadata per halaman. */
export function pageMeta(title, description, path) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | M-YES`, description, url: path },
  };
}
