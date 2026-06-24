import prisma from '@/lib/prisma';
import AdminForm from '@/components/AdminForm';
const fields = [
  { name: 'titleEn', label: 'Title (EN) *', required: true }, { name: 'titleId', label: 'Title (ID)' },
  { name: 'emoji', label: 'Emoji Icon' }, { name: 'sortOrder', label: 'Sort Order', type: 'number' },
  { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea' }, { name: 'descriptionId', label: 'Description (ID)', type: 'textarea' },
  { name: 'image', label: 'Image', type: 'file' }, { name: 'isActive', label: 'Active', type: 'checkbox' },
];
export default async function EditProgram({ params }) {
  const item = await prisma.program.findUnique({ where: { id: parseInt(params.id) } });
  return <AdminForm title="Edit Program" apiUrl="/api/programs" redirectUrl="/admin/programs" fields={fields} initialData={JSON.parse(JSON.stringify(item))} />;
}
