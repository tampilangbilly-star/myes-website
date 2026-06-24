import AdminForm from '@/components/AdminForm';
const fields = [
  { name: 'type', label: 'Type *', type: 'select', options: [{value:'worship',label:'Worship'},{value:'learning',label:'Learning'}] },
  { name: 'time', label: 'Time *', required: true, placeholder: '17:00 - 17:15' },
  { name: 'activityEn', label: 'Activity (EN) *', required: true }, { name: 'activityId', label: 'Activity (ID)' },
  { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea' }, { name: 'descriptionId', label: 'Description (ID)', type: 'textarea' },
  { name: 'sortOrder', label: 'Sort Order', type: 'number' },
];
export default function NewActivity() { return <AdminForm title="Add Activity" apiUrl="/api/activities" redirectUrl="/admin/activities" fields={fields} initialData={{type:'worship',sortOrder:0}} />; }
