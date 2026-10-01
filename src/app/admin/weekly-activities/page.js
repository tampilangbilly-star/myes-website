import prisma from "@/lib/prisma";
import ResourceList from "@/components/admin/ResourceList";

export const metadata = { title: "Galeri Mingguan" };

export default async function Page() {
  const rows = await prisma.activityGallery.findMany({ include: { photos: { orderBy: { id: "asc" } } }, orderBy: { activityDate: "desc" } });
  return <ResourceList resource="weeklyActivities" rows={rows} />;
}
