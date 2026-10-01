import prisma from "@/lib/prisma";
import { getLang } from "@/lib/helpers";
import { safe } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import CareGallery from "@/components/CareGallery";

export const metadata = pageMeta("M-YES Care", "M-YES Care — impactful activities sharing kindness and care with the community and local churches.", "/care");

export default async function CarePage() {
  const lang = await getLang();
  const id = lang === "id";
  const activities = await safe(prisma.careActivity.findMany({ where: { isActive: true }, include: { media: { orderBy: { id: "asc" } } }, orderBy: { activityDate: "desc" } }));

  return (
    <>
      <PageHeader
        eyebrow={id ? "Berdampak Nyata" : "Making an Impact"}
        title="M-YES Care"
        subtitle={id ? "Kami juga melakukan berbagai kegiatan yang berdampak positif, membagikan kebaikan dan kepedulian kepada masyarakat maupun gereja-gereja." : "We also organize various impactful activities, sharing kindness and care with the community and local churches."}
      />
      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow={id ? "Aksi Nyata" : "Real Actions"} title={id ? "Galeri M-YES Care" : "M-YES Care Gallery"} />
          <CareGallery activities={activities} lang={lang} />
        </div>
      </section>
    </>
  );
}
