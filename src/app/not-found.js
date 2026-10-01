import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
      <Image src="/dove.webp" alt="" width={120} height={141} className="dove-fly h-auto w-24 drop-shadow-lg" />
      <p className="mt-6 font-display text-6xl font-extrabold text-primary sm:text-7xl">404</p>
      <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Page not found · Halaman tidak ditemukan</h1>
      <p className="mt-3 max-w-md text-ink-muted">The page you are looking for may have moved or no longer exists. Halaman yang Anda cari mungkin sudah dipindah atau dihapus.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          <Icon name="home" size={18} /> Home
        </Link>
        <Link href="/contact" className="btn-outline">
          Contact
        </Link>
      </div>
    </section>
  );
}
