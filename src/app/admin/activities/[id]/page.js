import prisma from "@/lib/prisma";
import AdminForm from "@/components/AdminForm";
const fields = [
  {
    name: "type",
    label: "Type *",
    type: "select",
    options: [
      { value: "worship", label: "Worship" },
      { value: "learning", label: "Learning" },
    ],
  },
  { name: "time", label: "Time *", required: true },
  { name: "activityEn", label: "Activity (EN) *", required: true },
  { name: "activityId", label: "Activity (ID)" },
  { name: "descriptionEn", label: "Description (EN)", type: "textarea" },
  { name: "descriptionId", label: "Description (ID)", type: "textarea" },
  { name: "sortOrder", label: "Sort Order", type: "number" },
  { name: "video", label: "Video Dokumentasi (Opsional)", type: "video" },
];
export default async function EditActivity({ params }) {
  const item = await prisma.activity.findUnique({
    where: { id: parseInt(params.id) },
  });
  return (
    <AdminForm
      title="Edit Activity"
      apiUrl="/api/activities"
      redirectUrl="/admin/activities"
      fields={fields}
      initialData={JSON.parse(JSON.stringify(item))}
    />
  );
}
