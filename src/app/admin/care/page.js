import prisma from "@/lib/prisma";
import ResourceList from "@/components/admin/ResourceList";

export const metadata = { title: "care" };

export default async function Page() {
  const rows = await prisma.careActivity.findMany({ orderBy: { activityDate: "desc" }, include: { media: true } });
  return <ResourceList resource="care" rows={rows} />;
}
