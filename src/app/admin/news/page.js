import prisma from "@/lib/prisma";
import ResourceList from "@/components/admin/ResourceList";

export const metadata = { title: "news" };

export default async function Page() {
  const rows = await prisma.news.findMany({ orderBy: [{ publishedAt: { sort: "desc", nulls: "last" } }, { id: "desc" }] });
  return <ResourceList resource="news" rows={rows} />;
}
