import prisma from "@/lib/prisma";
import { getLang, t } from "@/lib/helpers";
import { safe } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import MissionCarousel from "@/components/MissionCarousel";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";

export const metadata = pageMeta("Mission Trip", "Reaching out beyond Manado — stories and photos from M-YES mission trips.", "/mission");

export default async function MissionPage() {
  const lang = await getLang();
  const id = lang === "id";
  const rows = await safe(prisma.mission.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }));

  // Baris dengan judul yang sama digabung menjadi satu perjalanan dengan banyak foto (seperti sebelumnya)
  const groups = [];
  for (const m of rows) {
    const title = t(m, "title", lang);
    let g = groups.find((x) => x.title === title);
    if (!g) {
      g = { id: m.id, title, description: t(m, "description", lang), dateLabel: t(m, "dateLabel", lang), images: [] };
      groups.push(g);
    }
    if (!g.description) g.description = t(m, "description", lang);
    if (!g.dateLabel) g.dateLabel = t(m, "dateLabel", lang);
    if (m.image) g.images.push(m.image);
  }

  return (
    <>
      <PageHeader
        eyebrow={id ? "Menjangkau" : "Reaching Out"}
        title={id ? "Misi Perjalanan" : "Mission Trip"}
        subtitle={id ? "Membawa kasih Kristus dan semangat belajar ke tempat-tempat baru." : "Bringing the love of Christ and a passion for learning to new places."}
      />
      <section className="section">
        <div className="container-x">
          {groups.length ? (
            <ol className="relative space-y-8 border-l-2 border-primary/20 pl-5 sm:space-y-12 sm:pl-10">
              {groups.map((g, i) => (
                <Reveal as="li" key={g.id} className="relative">
                  <span aria-hidden className="absolute -left-[31px] top-6 flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-4 ring-bg sm:-left-[51px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  <article className={`card grid gap-5 overflow-hidden p-4 sm:p-6 ${g.images.length ? "lg:grid-cols-2 lg:items-center" : ""}`}>
                    {g.images.length > 0 && <MissionCarousel images={g.images} title={g.title} />}
                    <div className={i % 2 && g.images.length ? "lg:order-first" : ""}>
                      {g.dateLabel && (
                        <p className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary-strong">
                          <Icon name="calendar" size={14} /> {g.dateLabel}
                        </p>
                      )}
                      <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">{g.title}</h2>
                      {g.description && <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-muted">{g.description}</p>}
                      {g.images.length > 1 && (
                        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-soft">
                          <Icon name="camera" size={16} /> {g.images.length} {id ? "foto" : "photos"}
                        </p>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </ol>
          ) : (
            <EmptyState icon="plane" title={id ? "Belum ada catatan perjalanan." : "No mission trips recorded yet."} />
          )}
        </div>
      </section>
    </>
  );
}
