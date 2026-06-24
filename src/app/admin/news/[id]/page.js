import prisma from '@/lib/prisma';
import AdminForm from '@/components/AdminForm';
const fields = [
  { name: 'titleEn', label: 'Title (EN) *', required: true }, { name: 'titleId', label: 'Title (ID)' },
  { name: 'tagEn', label: 'Tag (EN)' }, { name: 'tagId', label: 'Tag (ID)' },
  { name: 'contentEn', label: 'Content (EN)', type: 'textarea' }, { name: 'contentId', label: 'Content (ID)', type: 'textarea' },
  { name: 'publishedAt', label: 'Published Date', type: 'date' },
  { name: 'image', label: 'Image', type: 'file' }, { name: 'isActive', label: 'Active', type: 'checkbox' },
];
export default async function EditNews({ params }) {
  const item = await prisma.news.findUnique({ where: { id: parseInt(params.id) } });
  const data = JSON.parse(JSON.stringify(item));
  if (data.publishedAt) data.publishedAt = data.publishedAt.split('T')[0];
  return <AdminForm title="Edit News" apiUrl="/api/news" redirectUrl="/admin/news" fields={fields} initialData={data} />;
}
