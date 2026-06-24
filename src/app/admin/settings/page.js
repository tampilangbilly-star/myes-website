'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AdminSettings() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'about';
  const [tab, setTab] = useState(initialTab);
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [bgFile, setBgFile] = useState(null);

  useEffect(() => { fetch('/api/settings').then(r => r.json()).then(data => {
    const s = {}; data.forEach(i => { s[i.key] = { en: i.valueEn || '', id: i.valueId || '' }; }); setSettings(s);
  }); }, []);

  const get = (key, lang='en') => settings[key]?.[lang] || '';
  const set = (key, lang, val) => setSettings({...settings, [key]: {...(settings[key]||{}), [lang]: val}});

  const save = async (keys, group) => {
    setSaving(true);
    for (const key of keys) {
      await fetch('/api/settings', { method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ key, valueEn: get(key,'en'), valueId: get(key,'id'), group }) });
    }
    if (bgFile) {
      const fd = new FormData(); fd.append('file', bgFile); fd.append('folder', 'backgrounds');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const { path } = await res.json();
      await fetch('/api/settings', { method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ key: 'main_background', valueEn: path, group: 'general' }) });
    }
    setSaving(false); alert('Saved!');
  };

  return (
    <>
      <div className="activities-tabs" style={{justifyContent:'flex-start',marginBottom:'1.5rem'}}>
        <button className={`tab-btn ${tab==='about'?'active':''}`} onClick={() => setTab('about')}>📋 About Us</button>
        <button className={`tab-btn ${tab==='social'?'active':''}`} onClick={() => setTab('social')}>🔗 Social Media</button>
        <button className={`tab-btn ${tab==='contact'?'active':''}`} onClick={() => setTab('contact')}>💬 Contact</button>
      </div>

      {tab === 'about' && (
        <>
          <div className="settings-card"><h4>📋 About Description</h4><div className="form-grid">
            <div className="admin-field"><label>English</label><textarea value={get('about_description','en')} onChange={e => set('about_description','en',e.target.value)} rows={3} /></div>
            <div className="admin-field"><label>Indonesian</label><textarea value={get('about_description','id')} onChange={e => set('about_description','id',e.target.value)} rows={3} /></div>
          </div></div>
          <div className="settings-card"><h4>👁️ Vision</h4><div className="form-grid">
            <div className="admin-field"><label>English</label><textarea value={get('vision','en')} onChange={e => set('vision','en',e.target.value)} rows={3} /></div>
            <div className="admin-field"><label>Indonesian</label><textarea value={get('vision','id')} onChange={e => set('vision','id',e.target.value)} rows={3} /></div>
          </div></div>
          <div className="settings-card"><h4>🎯 Mission</h4><div className="form-grid">
            <div className="admin-field"><label>English (1 point per line)</label><textarea value={get('mission','en')} onChange={e => set('mission','en',e.target.value)} rows={5} /></div>
            <div className="admin-field"><label>Indonesian</label><textarea value={get('mission','id')} onChange={e => set('mission','id',e.target.value)} rows={5} /></div>
          </div></div>
          <button className="green-btn" disabled={saving} onClick={() => save(['about_description','vision','mission'],'about')}>{saving ? 'Saving...' : '💾 Save About Us'}</button>
        </>
      )}

      {tab === 'social' && (
        <>
          <div className="settings-card"><h4>📷 Instagram</h4><div className="admin-field"><label>URL</label><input value={get('social_instagram','en')} onChange={e => set('social_instagram','en',e.target.value)} placeholder="https://instagram.com/myes.manado" /></div></div>
          <div className="settings-card"><h4>📘 Facebook</h4><div className="admin-field"><label>URL</label><input value={get('social_facebook','en')} onChange={e => set('social_facebook','en',e.target.value)} /></div></div>
          <div className="settings-card"><h4>🎵 TikTok</h4><div className="admin-field"><label>URL</label><input value={get('social_tiktok','en')} onChange={e => set('social_tiktok','en',e.target.value)} /></div></div>
          <div className="settings-card"><h4>💬 WhatsApp</h4><div className="admin-field"><label>Group Link</label><input value={get('social_whatsapp','en')} onChange={e => set('social_whatsapp','en',e.target.value)} /></div></div>
          <div className="settings-card"><h4>🎬 YouTube</h4><div className="admin-field"><label>URL</label><input value={get('social_youtube','en')} onChange={e => set('social_youtube','en',e.target.value)} /></div></div>
          <div className="settings-card"><h4>📸 Main Background Photo</h4>
            <p style={{fontSize:'.82rem',color:'#64748b',marginBottom:'1rem'}}>Foto seluruh anggota & pembina yang tampil di homepage.</p>
            {get('main_background','en') && <img src={`/uploads/${get('main_background','en')}`} style={{maxHeight:150,borderRadius:10,marginBottom:'1rem',display:'block',width:'100%',objectFit:'cover'}} alt="" />}
            <input type="file" accept="image/*" onChange={e => setBgFile(e.target.files[0])} />
          </div>
          <button className="green-btn" disabled={saving} onClick={() => save(['social_instagram','social_facebook','social_tiktok','social_whatsapp','social_youtube'],'social')}>{saving ? 'Saving...' : '💾 Save Settings'}</button>
        </>
      )}

      {tab === 'contact' && (
        <>
          <div className="settings-card"><h4>📧 Email</h4><div className="form-grid">
            <div className="admin-field"><label>Email</label><input value={get('contact_email','en')} onChange={e => set('contact_email','en',e.target.value)} /></div>
            <div className="admin-field"><label>Email (ID)</label><input value={get('contact_email','id')} onChange={e => set('contact_email','id',e.target.value)} /></div>
          </div></div>
          <div className="settings-card"><h4>📱 Phone</h4><div className="form-grid">
            <div className="admin-field"><label>Phone</label><input value={get('contact_phone','en')} onChange={e => set('contact_phone','en',e.target.value)} /></div>
            <div className="admin-field"><label>Phone (ID)</label><input value={get('contact_phone','id')} onChange={e => set('contact_phone','id',e.target.value)} /></div>
          </div></div>
          <div className="settings-card"><h4>📍 Address</h4><div className="form-grid">
            <div className="admin-field"><label>English</label><textarea value={get('contact_address','en')} onChange={e => set('contact_address','en',e.target.value)} rows={2} /></div>
            <div className="admin-field"><label>Indonesian</label><textarea value={get('contact_address','id')} onChange={e => set('contact_address','id',e.target.value)} rows={2} /></div>
          </div></div>
          <div className="settings-card"><h4>⏰ Schedule</h4><div className="form-grid">
            <div className="admin-field"><label>English</label><input value={get('contact_schedule','en')} onChange={e => set('contact_schedule','en',e.target.value)} /></div>
            <div className="admin-field"><label>Indonesian</label><input value={get('contact_schedule','id')} onChange={e => set('contact_schedule','id',e.target.value)} /></div>
          </div></div>
          <button className="green-btn" disabled={saving} onClick={() => save(['contact_email','contact_phone','contact_address','contact_schedule'],'contact')}>{saving ? 'Saving...' : '💾 Save Contact'}</button>
        </>
      )}
    </>
  );
}
