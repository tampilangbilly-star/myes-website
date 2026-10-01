import ResourceForm from "@/components/admin/ResourceForm";
import { AdminTitle } from "@/components/admin/ResourceList";
import { RESOURCES } from "@/components/admin/resources";

export const metadata = { title: "Tambah" };

export default function Page() {
  const cfg = RESOURCES.missions;
  return (
    <>
      <AdminTitle title={`Tambah ${cfg.singular}`} back={{ href: cfg.base, label: cfg.title }} />
      <div className="card p-4 sm:p-6">
        <ResourceForm resource="missions" />
      </div>
    </>
  );
}
