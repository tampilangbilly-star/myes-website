'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SlideForm({ initialData = null }) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [form, setForm] = useState(initialData || {
    type: 'custom', titleEn: '', titleId: '', descriptionEn: '', descriptionId: '',
    overlineEn: '', overlineId: '', buttonTextEn: '', buttonTextId: '',
    buttonLink: '', backgroundColor: '#0a1628', sortOrder: 0, isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [bgFile, setBgFile] = useState(null);

  const set = (k, v) => setForm({ ...form, [k]: v });

  const uploadFile = async (file, folder) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    return data.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, sortOrder: parseInt(form.sortOrder) || 0 };

    if (imageFile) data.image = await uploadFile(imageFile, 'slides');
    if (bgFile) data.backgroundImage = await uploadFile(bgFile, 'slides/backgrounds');

    const url = isEdit ? `/api/slides/${initialData.id}` : '/api/slides';
    const method = isEdit ? 'PUT' : 'POST';

    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    router.push('/admin/slides');
    router.refresh();
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <h3 style={{color:'#fff',marginBottom:'1rem'}}>📋 Slide content</h3>
        <div className="form-grid">
          <div className="admin-field"><label>Type *</label>
            <select value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="activities">Activities</option><option value="social_media">Social Media</option>
              <option value="news">News</option><option value="mission_trip">Mission Trip</option><option value="custom">Custom</option>
            </select>
          </div>
          <div className="admin-field"><label>Sort Order</label><input type="number" value={form.sortOrder} onChange={e => set('sortOrder', e.target.value)} /></div>
        </div>
        <div className="form-grid">
          <div className="admin-field"><label>Overline (EN)</label><input value={form.overlineEn || ''} onChange={e => set('overlineEn', e.target.value)} placeholder="OUR ACTIVITIES" /></div>
          <div className="admin-field"><label>Overline (ID)</label><input value={form.overlineId || ''} onChange={e => set('overlineId', e.target.value)} placeholder="KEGIATAN KAMI" /></div>
        </div>
        <div className="form-grid">
          <div className="admin-field"><label>Title (EN) *</label><input value={form.titleEn} onChange={e => set('titleEn', e.target.value)} required /></div>
          <div className="admin-field"><label>Title (ID)</label><input value={form.titleId || ''} onChange={e => set('titleId', e.target.value)} /></div>
        </div>
        <div className="form-grid">
          <div className="admin-field"><label>Description (EN)</label><textarea value={form.descriptionEn || ''} onChange={e => set('descriptionEn', e.target.value)} rows={2} /></div>
          <div className="admin-field"><label>Description (ID)</label><textarea value={form.descriptionId || ''} onChange={e => set('descriptionId', e.target.value)} rows={2} /></div>
        </div>
        <div className="form-grid">
          <div className="admin-field"><label>Button Text (EN)</label><input value={form.buttonTextEn || ''} onChange={e => set('buttonTextEn', e.target.value)} /></div>
          <div className="admin-field"><label>Button Text (ID)</label><input value={form.buttonTextId || ''} onChange={e => set('buttonTextId', e.target.value)} /></div>
        </div>
        <div className="admin-field"><label>Button Link</label><input value={form.buttonLink || ''} onChange={e => set('buttonLink', e.target.value)} placeholder="/contact" /></div>

        <hr style={{border:'none',borderTop:'1px solid #243049',margin:'1.5rem 0'}} />
        <h3 style={{color:'#fff',marginBottom:'1rem'}}>🖼️ Images & background</h3>
        <div className="form-grid">
          <div className="admin-field"><label>Slide Image</label><input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} /></div>
          <div className="admin-field"><label>Background Image</label><input type="file" accept="image/*" onChange={e => setBgFile(e.target.files[0])} /></div>
        </div>
        <div className="admin-field"><label>Background Color</label>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <input type="color" value={form.backgroundColor} onChange={e => set('backgroundColor', e.target.value)} style={{width:50,height:40,borderRadius:8,cursor:'pointer',border:'none'}} />
            <span style={{color:'#94a3b8',fontSize:'.85rem'}}>{form.backgroundColor}</span>
          </div>
        </div>
        <div className="admin-field"><label><input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} /> Active</label></div>
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => router.push('/admin/slides')}>Cancel</button>
          <button type="submit" className="save-btn">💾 Save Slide</button>
        </div>
      </form>
    </div>
  );
}
