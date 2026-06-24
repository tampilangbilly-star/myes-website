'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminSlides() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch('/api/slides').then(r => r.json()).then(d => { setItems(d); setLoading(false); }); }, []);

  const deleteItem = async (id) => {
    if (!confirm('Delete this slide?')) return;
    await fetch(`/api/slides/${id}`, { method: 'DELETE' });
    setItems(items.filter(i => i.id !== id));
  };

  const typeColors = { activities: 'type-activities', social_media: 'type-social_media', news: 'type-news', mission_trip: 'type-mission_trip', custom: 'type-custom' };

  return (
    <>
      <div className="crud-header">
        <h2>Homepage Slides</h2>
        <Link href="/admin/slides/new" className="add-btn">+ Add Slide</Link>
      </div>
      <div className="data-table-wrap"><table className="data-table">
        <thead><tr><th>Type</th><th>Title</th><th>BG Color</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {loading ? <tr><td colSpan={6} style={{textAlign:'center',padding:'2rem'}}>Loading...</td></tr> :
           items.length === 0 ? <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">🖼️</div><p>No slides yet.</p></div></td></tr> :
           items.map(item => (
            <tr key={item.id}>
              <td><span className={`type-badge ${typeColors[item.type] || ''}`}>{item.type.replace('_',' ')}</span></td>
              <td><strong>{item.titleEn?.substring(0,35)}</strong></td>
              <td><span style={{width:16,height:16,borderRadius:4,background:item.backgroundColor,display:'inline-block',border:'1px solid rgba(255,255,255,.1)'}} /></td>
              <td>{item.sortOrder}</td>
              <td style={{color:item.isActive?'#10b981':'#ef4444',fontSize:'.82rem',fontWeight:600}}>{item.isActive ? '● Active' : '● Inactive'}</td>
              <td><div className="action-btns">
                <Link href={`/admin/slides/${item.id}`} className="act-btn edit">✏️</Link>
                <button className="act-btn delete" onClick={() => deleteItem(item.id)}>🗑️</button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </>
  );
}
