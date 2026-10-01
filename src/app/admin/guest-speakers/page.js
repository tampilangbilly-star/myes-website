import prisma from "@/lib/prisma";
import ResourceList from "@/components/admin/ResourceList";

export const metadata = { title: "Guest Speaker" };

export default async function Page() {
  const rows = await prisma.guestSpeaker.findMany({ orderBy: { dateServed: "desc" } });
  return <ResourceList resource="guestSpeakers" rows={rows} />;
}
