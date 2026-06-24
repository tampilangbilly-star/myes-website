import prisma from '@/lib/prisma';
import AdminForm from '@/components/AdminForm';
const fields = [
  { name: 'titleEn', label: 'Title (EN) *', required: true }, { name: 'titleId', label: 'Title (ID)' },
  { name: 'dateLabelEn', label: 'Date Label (EN)' }, { name: 'dateLabelId', label: 'Date Label (ID)' },
  { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea' }, { name: 'descriptionId', label: 'Description (ID)', type: 'textarea' },
  { name: 'sortOrder', label: 'Sort Order', type: 'number' },
  { name: 'image', label: 'Image', type: 'file' }, { name: 'isActive', label: 'Active', type: 'checkbox' },
];
export default async function EditMission({ params }) {
  const item = await prisma.mission.findUnique({ where: { id: parseInt(params.id) } });
  return <AdminForm title="Edit Mission" apiUrl="/api/missions" redirectUrl="/admin/missions" fields={fields} initialData={JSON.parse(JSON.stringify(item))} />;
}
