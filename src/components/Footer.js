import Link from "next/link";
import Image from "next/image";
import Icon from "./Icon";
import { getSite } from "@/lib/site";

const QUICK = [
  { href: "/about", en: "About", id: "Tentang" },
  { href: "/personnel", en: "Personnel", id: "Personalia" },
  { href: "/program", en: "Program", id: "Program" },
  { href: "/activities", en: "Activities", id: "Kegiatan" },
];
const EXPLORE = [
  { href: "/mission", en: "Mission", id: "Misi" },
  { href: "/care", en: "M-YES Care", id: "M-YES Care" },
  { href: "/news", en: "News", id: "Berita" },
  { href: "/contact", en: "Contact", id: "Kontak" },
];

export default async function Footer({ lang = "en" }) {
  const site = await getSite(lang);
  const id = lang === "id";
  const socials = [
    { key: "instagram", label: "Instagram", href: site.socials.instagram },
    { key: "whatsapp", label: "WhatsApp", href: site.socials.whatsapp },
    { key: "tiktok", label: "TikTok", href: site.socials.tiktok },
    { key: "facebook", label: "Facebook", href: site.socials.facebook },
    { key: "youtube", label: "YouTube", href: site.socials.youtube },
  ].filter((s) => s.href);

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      {/* Ajakan bergabung */}
      <div className="container-x pt-14">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-10 text-primary-ink sm:px-10 sm:py-12">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/10" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{id ? "Siap Bertumbuh Bersama?" : "Ready to Grow Together?"}</h2>
              <p className="mt-2 leading-relaxed text-white/90">
                {id
                  ? "Mari bergabung dengan komunitas anak muda M-YES. Kita belajar bahasa Inggris, membangun relasi, dan memperdalam iman bersama-sama!"
                  : "Join the M-YES youth community. We learn English, build friendships, and grow deeper in faith together!"}
              </p>
            </div>
            <a href={site.socials.whatsapp || "/contact"} target="_blank" rel="noopener noreferrer" className="btn shrink-0 bg-white text-primary-strong hover:bg-white/90">
              {id ? "Bergabung Sekarang" : "Join Us Now"} <Icon name="arrow-right" size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="M-YES Home">
            <Image src="/logo-myes.png" alt="" width={44} height={44} className="h-11 w-11 object-contain" />
            <span className="font-display text-lg font-extrabold">M-YES</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
            {id
              ? "Komunitas anak muda yang bertumbuh bersama melalui ibadah berbahasa Inggris, persekutuan, dan pelayanan. Terbuka untuk siapa saja yang ingin belajar dan melayani."
              : "A youth community growing together through English-language worship, fellowship, and service. Open to anyone who wants to learn and serve."}
          </p>
          {socials.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="icon-btn border border-line bg-surface hover:border-primary/40 hover:text-primary">
                    <Icon name={s.key} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <FooterLinks title={id ? "Tautan Cepat" : "Quick Links"} links={QUICK} lang={lang} />
        <FooterLinks title={id ? "Jelajahi" : "Explore"} links={EXPLORE} lang={lang} />

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-soft">{id ? "Kontak" : "Contact"}</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-muted">
            <li className="flex gap-3">
              <Icon name="pin" size={18} className="mt-0.5 shrink-0 text-primary" />
              <span>{site.contact.address}</span>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className="flex gap-3 break-all hover:text-primary">
                <Icon name="mail" size={18} className="mt-0.5 shrink-0 text-primary" />
                {site.contact.email}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${site.contact.phoneDigits}`} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-primary">
                <Icon name="phone" size={18} className="mt-0.5 shrink-0 text-primary" />
                {site.contact.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-5 pb-24 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:pb-5">
          <p>© {new Date().getFullYear()} Manado Youth English Service (M-YES). All rights reserved.</p>
          <Link href="/admin" className="opacity-80 transition hover:text-primary hover:opacity-100">
            Admin <span className="mx-1 font-light">~bt~</span> Billy Tampilang
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links, lang }) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-ink-soft">{title}</h3>
      <ul className="mt-2 grid grid-cols-2 gap-x-4 sm:grid-cols-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="flex min-h-11 items-center text-sm font-medium text-ink-muted transition hover:text-primary">
              {lang === "id" ? l.id : l.en}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
