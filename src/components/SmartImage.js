import Image from "next/image";

/**
 * next/image dengan pengaman: foto dari Supabase / folder lokal dioptimasi (WebP/AVIF, ukuran sesuai layar),
 * URL dari host lain tetap tampil tanpa optimasi agar tidak error.
 */
export default function SmartImage({ src, alt = "", ...props }) {
  if (!src) return null;
  const optimizable = src.startsWith("/") || /^https:\/\/[a-z0-9-]+\.supabase\.co\//i.test(src);
  return <Image src={src} alt={alt} unoptimized={!optimizable} {...props} />;
}
