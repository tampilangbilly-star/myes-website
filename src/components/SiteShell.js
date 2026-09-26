"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/SocialFloat";

// One public shell prevents duplicate navigation/footer on individual pages.
// Admin keeps the original theme and its own layout.
export default function SiteShell({ children, lang, socials }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname?.startsWith("/admin/")) return children;
  return (
    <div className="site-light">
      <Navbar lang={lang} />
      <main>{children}</main>
      <Footer lang={lang} />
      <SocialFloat socials={socials} />
    </div>
  );
}
