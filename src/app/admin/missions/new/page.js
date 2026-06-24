import AdminForm from '@/components/AdminForm';
const fields = [
  { name: 'titleEn', label: 'Title (EN) *', required: true }, { name: 'titleId', label: 'Title (ID)' },
  { name: 'dateLabelEn', label: 'Date Label (EN)', placeholder: 'Upcoming' }, { name: 'dateLabelId', label: 'Date Label (ID)' },
  { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea' }, { name: 'descriptionId', label: 'Description (ID)', type: 'textarea' },
  { name: 'sortOrder', label: 'Sort Order', type: 'number' },
  { name: 'image', label: 'Image', type: 'file' }, { name: 'isActive', label: 'Active', type: 'checkbox' },
];
export default function NewMission() { return <AdminForm title="Add Mission" apiUrl="/api/missions" redirectUrl="/admin/missions" fields={fields} initialData={{isActive:true,sortOrder:0}} />; }
