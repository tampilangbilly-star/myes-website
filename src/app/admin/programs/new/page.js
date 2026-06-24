import AdminForm from '@/components/AdminForm';
const fields = [
  { name: 'titleEn', label: 'Title (EN) *', required: true }, { name: 'titleId', label: 'Title (ID)' },
  { name: 'emoji', label: 'Emoji Icon', placeholder: '📖' }, { name: 'sortOrder', label: 'Sort Order', type: 'number' },
  { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea' }, { name: 'descriptionId', label: 'Description (ID)', type: 'textarea' },
  { name: 'image', label: 'Image', type: 'file' }, { name: 'isActive', label: 'Active', type: 'checkbox' },
];
export default function NewProgram() { return <AdminForm title="Add Program" apiUrl="/api/programs" redirectUrl="/admin/programs" fields={fields} initialData={{isActive:true,sortOrder:0,emoji:'📖'}} />; }
