import prisma from "@/lib/prisma";
import ResourceList from "@/components/admin/ResourceList";

export const metadata = { title: "programs" };

export default async function Page() {
  const rows = await prisma.program.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return <ResourceList resource="programs" rows={rows} />;
}
