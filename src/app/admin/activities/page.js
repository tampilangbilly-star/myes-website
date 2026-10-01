import prisma from "@/lib/prisma";
import ResourceList from "@/components/admin/ResourceList";

export const metadata = { title: "activities" };

export default async function Page() {
  const rows = await prisma.activity.findMany({ orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { id: "asc" }] });
  return <ResourceList resource="activities" rows={rows} />;
}
