import prisma from "@/lib/prisma";
import MessagesManager from "@/components/admin/MessagesManager";

export const metadata = { title: "Pesan Masuk" };

export default async function Page() {
  const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return <MessagesManager rows={rows} />;
}
