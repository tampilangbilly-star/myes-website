import prisma from "@/lib/prisma";
import MomentsManager from "@/components/admin/MomentsManager";

export const metadata = { title: "Momen Beranda" };

export default async function Page() {
  const rows = await prisma.homeMoment.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  return <MomentsManager rows={rows} />;
}
