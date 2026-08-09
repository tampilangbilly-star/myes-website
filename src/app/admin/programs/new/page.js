import AdminForm from '@/components/AdminForm';

const fields = [
  { name: 'titleEn', label: 'Title (EN) *', required: true }, 
  { name: 'titleId', label: 'Title (ID)' },
  { name: 'emoji', label: 'Emoji Icon', placeholder: '📖' }, 
  { name: 'sortOrder', label: 'Sort Order', type: 'number' },
  { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea' }, 
  { name: 'descriptionId', label: 'Description (ID)', type: 'textarea' },
  // Ubah field image untuk menangani multiple array ("images")
  { name: 'images', label: 'Images (Pilih lebih dari 1)', type: 'file', multiple: true }, 
  { name: 'isActive', label: 'Active', type: 'checkbox' },
];

export default function NewProgram() { 
  return (
    <AdminForm 
      title="Add Program" 
      apiUrl="/api/programs" 
      redirectUrl="/admin/programs" 
      fields={fields} 
      initialData={{isActive: true, sortOrder: 0, emoji: '📖'}} 
    />
  ); 
}