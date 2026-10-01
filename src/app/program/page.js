import Link from "next/link";
import prisma from "@/lib/prisma";
import { getLang, t } from "@/lib/helpers";
import { safe } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ProgramCardSlider from "@/components/ProgramCardSlider";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";

export const metadata = pageMeta("Programs", "English worship, English classes, public speaking and fellowship — discover the M-YES programs.", "/program");

export default async function ProgramPage() {
  const lang = await getLang();
  const id = lang === "id";
  const items = await safe(prisma.program.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }));

  return (
    <>
      <PageHeader
        eyebrow={id ? "Apa Yang Kami Lakukan" : "What We Do"}
        title={id ? "Program Kami" : "Our Programs"}
        subtitle={id ? "Setiap program dirancang untuk menolong anak muda bertumbuh dalam iman, karakter, dan kemampuan bahasa Inggris." : "Every program is designed to help young people grow in faith, character, and English skills."}
      />
      <section className="section">
        <div className="container-x">
          {items.length ? (
            <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {items.map((p, i) => {
                const imgs = p.images?.length ? p.images : p.image ? [p.image] : [];
                const desc = t(p, "description", lang);
                return (
                  <Reveal as="li" key={p.id} delay={(i % 3) * 80} className="card card-hover flex flex-col overflow-hidden">
                    <ProgramCardSlider images={imgs} emoji={p.emoji} title={t(p, "title", lang)} />
                    <div className="flex flex-1 flex-col p-3 sm:p-6">
                      <h2 className="flex items-start gap-2 text-[0.95rem] font-bold leading-snug sm:text-xl">
                        <span aria-hidden className="hidden sm:inline">{p.emoji}</span>
                        {t(p, "title", lang)}
                      </h2>
                      {desc && (
                        <details className="group mt-1.5 flex-1">
                          <summary className="cursor-pointer list-none text-xs leading-relaxed text-ink-muted sm:text-sm [&::-webkit-details-marker]:hidden">
                            <span className="line-clamp-3 group-open:line-clamp-none">{desc}</span>
                            {desc.length > 90 && <span className="mt-1 inline-block font-semibold text-primary-strong group-open:hidden">{id ? "Selengkapnya" : "Read more"}</span>}
                          </summary>
                        </details>
                      )}
                      <Link href="/contact" className="btn-soft btn-sm mt-4 self-start">
                        {id ? "Gabung Program" : "Join Program"} <Icon name="arrow-right" size={16} />
                      </Link>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          ) : (
            <EmptyState icon="book" title={id ? "Belum ada program." : "No programs yet."} />
          )}
        </div>
      </section>
    </>
  );
}
