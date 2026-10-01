import prisma from "@/lib/prisma";
import { getLang, t, formatDate } from "@/lib/helpers";
import { safe } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SmartImage from "@/components/SmartImage";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";

export const metadata = pageMeta("News", "Latest news, event flyers and announcements from M-YES.", "/news");

export default async function NewsPage() {
  const lang = await getLang();
  const id = lang === "id";
  const items = await safe(prisma.news.findMany({ where: { isActive: true }, orderBy: [{ publishedAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }] }));

  return (
    <>
      <PageHeader eyebrow={id ? "Tetap Update" : "Stay Updated"} title={id ? "Berita Terbaru" : "Latest News"} subtitle={id ? "Pengumuman, flyer acara, dan kabar terbaru dari komunitas M-YES." : "Announcements, event flyers, and the latest from the M-YES community."} />
      <section className="section">
        <div className="container-x">
          {items.length ? (
            <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {items.map((n, i) => {
                const content = t(n, "content", lang);
                const date = formatDate(n.publishedAt || n.createdAt, lang, { day: "numeric", month: "short", year: "numeric" });
                return (
                  <Reveal as="li" key={n.id} delay={(i % 3) * 70} className="card flex flex-col overflow-hidden">
                    <div className="relative aspect-[4/5] bg-bg">
                      {n.image ? (
                        <SmartImage src={n.image} alt={t(n, "title", lang)} fill sizes="(min-width:1024px) 360px, 50vw" className="object-contain" />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-primary/60">
                          <Icon name="news" size={48} />
                        </span>
                      )}
                      <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-primary-ink sm:left-3 sm:top-3 sm:text-xs">{t(n, "tag", lang) || "Update"}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-3 sm:p-5">
                      <p className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
                        <Icon name="calendar" size={14} /> {date || "-"}
                      </p>
                      <h2 className="mt-1.5 text-[0.95rem] font-bold leading-snug sm:text-lg">{t(n, "title", lang)}</h2>
                      {content && (
                        <details className="group mt-1.5">
                          <summary className="cursor-pointer list-none text-xs leading-relaxed text-ink-muted sm:text-sm [&::-webkit-details-marker]:hidden">
                            <span className="line-clamp-3 whitespace-pre-line group-open:line-clamp-none">{content}</span>
                            {content.length > 100 && <span className="mt-1 inline-block font-semibold text-primary-strong group-open:hidden">{id ? "Baca selengkapnya" : "Read more"}</span>}
                          </summary>
                        </details>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          ) : (
            <EmptyState icon="news" title={id ? "Belum ada berita saat ini." : "No news available at the moment."} />
          )}
        </div>
      </section>
    </>
  );
}
