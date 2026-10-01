import Link from "next/link";
import prisma from "@/lib/prisma";
import { getLang, t } from "@/lib/helpers";
import { getSite } from "@/lib/site";
import { safe } from "@/lib/data";
import HeroSlider from "@/components/HeroSlider";
import NewsHomeSlider from "@/components/NewsHomeSlider";
import ProgramCardSlider from "@/components/ProgramCardSlider";
import WelcomePopup from "@/components/WelcomePopup";
import VirtualGreeter from "@/components/VirtualGreeter";
import SectionHeading from "@/components/SectionHeading";
import Carousel from "@/components/Carousel";
import SmartImage from "@/components/SmartImage";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export default async function Home() {
  const lang = await getLang();
  const id = lang === "id";
  const site = await getSite(lang);

  const [slides, programs, news, speakers, missions, care, moments] = await Promise.all([
    safe(prisma.slide.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] })),
    safe(prisma.program.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }], take: 6 })),
    safe(prisma.news.findMany({ where: { isActive: true }, orderBy: [{ publishedAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }], take: 5 })),
    safe(prisma.guestSpeaker.findMany({ where: { isActive: true }, orderBy: { dateServed: "desc" } })),
    safe(prisma.mission.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 5 })),
    safe(prisma.careActivity.findMany({ where: { isActive: true }, include: { media: true }, orderBy: { activityDate: "desc" }, take: 1 })),
    safe(prisma.homeMoment.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { id: "desc" }], take: 12 })),
  ]);

  const socials = [
    { key: "instagram", href: site.socials.instagram, label: id ? "Ikuti Instagram" : "Follow on Instagram", short: "Instagram", color: "text-[#C13584] bg-[#C13584]/10" },
    { key: "whatsapp", href: site.socials.whatsapp, label: id ? "Grup WhatsApp" : "Join WhatsApp", short: "WhatsApp", color: "text-[#128C3E] bg-[#25D366]/15" },
    { key: "tiktok", href: site.socials.tiktok, label: id ? "Ikuti TikTok Kami" : "Follow Our TikTok", short: "TikTok", color: "text-ink bg-ink/5" },
  ].filter((s) => s.href);

  return (
    <>
      <WelcomePopup news={news} cares={care} missions={missions} lang={lang} />

      <HeroSlider slides={slides} speakers={speakers} mainBackground={site.mainBackground} lang={lang} />

      {/* MEDIA SOSIAL */}
      {socials.length > 0 && (
        <section className="container-x mt-10 sm:mt-14" aria-labelledby="social-title">
          <Reveal className="card flex flex-col gap-4 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon name="globe" />
              </span>
              <div>
                <h2 id="social-title" className="text-lg font-bold">
                  {id ? "Media Sosial" : "Social Media"}
                </h2>
                <p className="text-sm text-ink-muted">{id ? "Ikuti kabar terbaru M-YES" : "Stay connected with M-YES"}</p>
              </div>
            </div>
            <ul className="grid grid-cols-3 gap-2 sm:gap-3 md:flex">
              {socials.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border border-line px-2 py-2 text-xs font-semibold text-ink transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card sm:flex-row sm:gap-2.5 sm:px-4 sm:text-sm">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.color}`}>
                      <Icon name={s.key} size={18} />
                    </span>
                    <span className="sm:hidden">{s.short}</span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}

      {/* MOMEN MINGGUAN (foto tanpa keterangan dari admin → Home Moments) */}
      {moments.length > 0 && (
        <section className="section pb-0" aria-labelledby="moments-title">
          <div className="container-x">
            <SectionHeading eyebrow={id ? "Momen" : "Moments"} title={<span id="moments-title">{id ? "Sepekan di M-YES" : "A Week at M-YES"}</span>} action={<Link href="/activities" className="btn-soft">{id ? "Galeri Kegiatan" : "Activity Gallery"} <Icon name="arrow-right" size={18} /></Link>} />
            <Carousel autoplay={4500} itemClassName="w-[78%] sm:w-[46%] lg:w-[31%]" labels={{ prev: id ? "Sebelumnya" : "Previous", next: id ? "Berikutnya" : "Next" }}>
              {moments.map((m, i) => (
                <div key={m.id} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-line">
                  <SmartImage src={m.image} alt={`${id ? "Momen M-YES" : "M-YES moment"} ${i + 1}`} fill sizes="(min-width:1024px) 360px, 78vw" className="object-cover" />
                </div>
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* PROGRAM */}
      {programs.length > 0 && (
        <section className="section" aria-labelledby="programs-title">
          <div className="container-x">
            <SectionHeading
              eyebrow={id ? "Apa Yang Kami Lakukan" : "What We Do"}
              title={<span id="programs-title">{id ? "Program Kami" : "Our Programs"}</span>}
              action={
                <Link href="/program" className="btn-soft">
                  {id ? "Semua Program" : "All Programs"} <Icon name="arrow-right" size={18} />
                </Link>
              }
            />
            <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {programs.map((p, i) => {
                const imgs = p.images?.length ? p.images : p.image ? [p.image] : [];
                return (
                  <Reveal as="li" key={p.id} delay={(i % 3) * 80}>
                    <Link href="/program" className="card card-hover group flex h-full flex-col overflow-hidden">
                      <ProgramCardSlider images={imgs} emoji={p.emoji} title={t(p, "title", lang)} />
                      <div className="flex flex-1 flex-col p-3 sm:p-5">
                        <h3 className="flex items-start gap-2 text-[0.95rem] font-bold leading-snug sm:text-lg">
                          <span aria-hidden className="hidden sm:inline">{p.emoji}</span>
                          {t(p, "title", lang)}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-muted sm:line-clamp-3 sm:text-sm">{t(p, "description", lang)}</p>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* BERITA & FLYER */}
      {news.length > 0 && (
        <section className="section border-y border-line bg-surface" aria-labelledby="news-title">
          <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <span className="eyebrow">{id ? "Warta Mingguan" : "Weekly Update"}</span>
              <h2 id="news-title" className="mt-3 text-[1.75rem] font-extrabold leading-tight sm:text-4xl">
                {id ? "Berita & Flyer Kegiatan" : "Latest Event Flyers"}
              </h2>
              <p className="mt-4 max-w-lg leading-relaxed text-ink-muted">
                {id
                  ? "Jangan lewatkan persekutuan ibadah, kelas pembelajaran bahasa Inggris, dan berbagai aktivitas seru M-YES setiap minggunya. Cek berkala deck kartu di samping untuk info terbaru!"
                  : "Stay tuned for our weekly youth worship services, English classes, and exciting fellowship events. Check out our card deck for the latest updates!"}
              </p>
              <Link href="/news" className="btn-primary mt-6">
                {id ? "Lihat Semua Berita" : "View All News"} <Icon name="arrow-right" size={18} />
              </Link>
            </Reveal>
            <NewsHomeSlider items={news} lang={lang} />
          </div>
        </section>
      )}

      {/* LOKASI */}
      <section className="section" aria-labelledby="location-title">
        <div className="container-x">
          <SectionHeading eyebrow={id ? "Kunjungi Kami" : "Visit Us"} title={<span id="location-title">{id ? "Lokasi Kami" : "Our Location"}</span>} />
          <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            <Reveal className="card overflow-hidden">
              <iframe
                src={site.contact.mapEmbed}
                title={id ? "Peta lokasi M-YES" : "M-YES location map"}
                className="block aspect-[4/3] h-full min-h-[280px] w-full border-0 sm:aspect-[16/10]"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </Reveal>
            <Reveal delay={100} className="card flex flex-col p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-strong">{site.contact.area}</p>
              <h3 className="mt-2 text-2xl font-extrabold">M-YES Basecamp</h3>
              <p className="mt-3 flex gap-3 leading-relaxed text-ink-muted">
                <Icon name="pin" className="mt-0.5 shrink-0 text-primary" />
                {site.contact.address}
              </p>
              <ul className="mt-5 space-y-3">
                <li>
                  <a href={`https://wa.me/${site.contact.phoneDigits}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-line p-3 transition hover:border-primary/30 hover:shadow-card">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#128C3E]">
                      <Icon name="whatsapp" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">WhatsApp</span>
                      <span className="block font-semibold">{site.contact.phone}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.contact.email}`} className="flex items-center gap-3 rounded-xl border border-line p-3 transition hover:border-primary/30 hover:shadow-card">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
                      <Icon name="mail" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Email</span>
                      <span className="block break-all font-semibold">{site.contact.email}</span>
                    </span>
                  </a>
                </li>
              </ul>
              <a href={site.contact.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-5 lg:mt-auto">
                <Icon name="external" size={18} /> {id ? "Buka di Google Maps" : "Open in Google Maps"}
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <VirtualGreeter joinUrl={site.socials.whatsapp} lang={lang} />
    </>
  );
}
