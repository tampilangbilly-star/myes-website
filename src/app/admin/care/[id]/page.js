import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { parseId } from "@/lib/api-auth";
import ResourceForm from "@/components/admin/ResourceForm";
import { AdminTitle } from "@/components/admin/ResourceList";
import { RESOURCES } from "@/components/admin/resources";

export const metadata = { title: "Ubah" };

export default async function Page({ params }) {
  const id = parseId((await params).id);
  if (!id) notFound();
  const item = await prisma.careActivity.findUnique({ where: { id }, include: { media: true } });
  if (!item) notFound();
  const cfg = RESOURCES.care;
  return (
    <>
      <AdminTitle title={`Ubah ${cfg.singular}`} subtitle={cfg.primary(item)} back={{ href: cfg.base, label: cfg.title }} />
      <div className="card p-4 sm:p-6">
        <ResourceForm resource="care" item={item} />
      </div>
    </>
  );
}
