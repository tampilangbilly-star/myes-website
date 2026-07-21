import prisma from "@/lib/prisma";
import AdminForm from "@/components/AdminForm";

const fields = [
  { name: "name", label: "Full Name *", required: true },
  {
    name: "category",
    label: "Kategori *",
    type: "select",
    options: [
      { value: "Pembina", label: "Pembina" },
      { value: "Pengurus Inti", label: "Pengurus Inti" },
      { value: "Bidang-Bidang", label: "Bidang-Bidang" },
      { value: "Lainnya", label: "Lainnya" },
    ],
    required: true,
  },
  { name: "roleEn", label: "Role (EN) *", required: true },
  { name: "roleId", label: "Role (ID)" },
  { name: "sortOrder", label: "Sort Order", type: "number" },
  { name: "bioEn", label: "Bio (EN)", type: "textarea" },
  { name: "bioId", label: "Bio (ID)", type: "textarea" },
  { name: "photo", label: "Photo", type: "file" },
  { name: "isActive", label: "Active", type: "checkbox" },
];

export default async function EditPersonnel({ params }) {
  const item = await prisma.personnel.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!item) return <p>Not found</p>;
  return (
    <AdminForm
      title="Edit Personnel"
      apiUrl="/api/personnel"
      redirectUrl="/admin/personnel"
      fields={fields}
      initialData={JSON.parse(JSON.stringify(item))}
    />
  );
}
