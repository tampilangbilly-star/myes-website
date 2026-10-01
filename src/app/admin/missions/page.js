import prisma from "@/lib/prisma";
import ResourceList from "@/components/admin/ResourceList";

export const metadata = { title: "missions" };

export default async function Page() {
  const rows = await prisma.mission.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return <ResourceList resource="missions" rows={rows} />;
}
