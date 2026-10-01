import prisma from "@/lib/prisma";
import ResourceList from "@/components/admin/ResourceList";

export const metadata = { title: "personnel" };

export default async function Page() {
  const rows = await prisma.personnel.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return <ResourceList resource="personnel" rows={rows} />;
}
