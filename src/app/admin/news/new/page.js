import AdminForm from '@/components/AdminForm';
const fields = [
  { name: 'titleEn', label: 'Title (EN) *', required: true }, { name: 'titleId', label: 'Title (ID)' },
  { name: 'tagEn', label: 'Tag (EN)', placeholder: 'Event' }, { name: 'tagId', label: 'Tag (ID)', placeholder: 'Acara' },
  { name: 'contentEn', label: 'Content (EN)', type: 'textarea' }, { name: 'contentId', label: 'Content (ID)', type: 'textarea' },
  { name: 'publishedAt', label: 'Published Date', type: 'date' },
  { name: 'image', label: 'Image', type: 'file' }, { name: 'isActive', label: 'Active', type: 'checkbox' },
];
export default function NewNews() { return <AdminForm title="Add News" apiUrl="/api/news" redirectUrl="/admin/news" fields={fields} initialData={{isActive:true,tagEn:'News',tagId:'Berita',publishedAt:new Date().toISOString().split('T')[0]}} />; }
