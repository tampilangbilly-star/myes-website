import prisma from "@/lib/prisma";
import SlidesManager from "@/components/admin/SlidesManager";

export const metadata = { title: "Hero Slider" };

export default async function Page() {
  const rows = await prisma.slide.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return <SlidesManager rows={rows} />;
}
