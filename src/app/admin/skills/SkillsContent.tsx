'use client';

import React, { useState, useEffect } from 'react';
import { getAllSkills, createSkill, updateSkill, deleteSkill, reorderSkills } from '@/actions/skill';
import { ImageUploader } from '@/components/admin/ImageUploader';

const FIXED_CATEGORIES = ['Frontend', 'Backend', 'Design', 'Tools'];

export default function SkillsContent() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    logoUrl: '',
    order: 0
  });

  useEffect(() => { loadSkills(); }, []);

  async function loadSkills() {
    const data = await getAllSkills();
    setSkills(data);
    setLoading(false);
  }

  const handleMove = async (categoryItems: any[], currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= categoryItems.length) return;

    const newItems = [...categoryItems];
    const [movedItem] = newItems.splice(currentIndex, 1);
    newItems.splice(targetIndex, 0, movedItem);

    const orders = newItems.map((item, idx) => ({ id: item.id, order: idx }));
    await reorderSkills(orders);
    loadSkills();
  };

  const handleEdit = (s: any) => {
    setEditId(s.id);
    setFormData({
      name: s.name,
      category: s.category || 'Frontend',
      logoUrl: s.logoUrl || '',
      order: s.order || 0
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = editId
        ? await updateSkill(editId, formData)
        : await createSkill({
            name: formData.name,
            category: formData.category,
            logoUrl: formData.logoUrl || undefined,
            order: skills.length
          });

      if (res.success) {
        setShowForm(false);
        setEditId(null);
        setFormData({ name: '', category: 'Frontend', logoUrl: '', order: 0 });
        loadSkills();
      } else {
        alert('Error: ' + res.error);
      }
    } catch (err: any) {
      alert('An unexpected error occurred: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    const res = await deleteSkill(id);
    if (res.success) loadSkills();
  };

  if (loading) return (
    <div className="flex items-center gap-3 p-6 lg:p-10">
      <div className="w-1 h-4 bg-[#111] animate-pulse" />
      <span className="text-[10px] tracking-widest text-[#999] uppercase">Loading Skills...</span>
    </div>
  );

  // Group skills by category
  const grouped = FIXED_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {} as Record<string, any[]>);

  // Also catch any skills with unexpected category
  const otherSkills = skills.filter(s => !FIXED_CATEGORIES.includes(s.category));
  if (otherSkills.length > 0) grouped['Other'] = otherSkills;

  return (
    <div className="space-y-6 lg:space-y-10 pb-32 p-6 lg:p-10">
      {/* Header */}
      <div className="border-b border-[#ebebeb] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase mb-2">Capabilities Matrix</p>
          <h1 className="text-2xl text-[#111] font-medium tracking-tight">Skills. <span className="text-[#ccc] text-lg">({skills.length})</span></h1>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditId(null);
            } else {
              setEditId(null);
              setFormData({ name: '', category: 'Frontend', logoUrl: '', order: skills.length });
              setShowForm(true);
            }
          }}
          className="text-[10px] tracking-[0.3em] uppercase border border-[#ebebeb] px-5 py-2.5 hover:border-[#111] hover:text-[#111] text-[#999] transition-all cursor-pointer w-full sm:w-auto"
        >
          {showForm ? '× Cancel' : '+ Add Skill'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-[#ebebeb] p-5 lg:p-8 space-y-8 bg-[#fafafa]">
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase">{editId ? 'Edit Skill' : 'New Skill'}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[9px] tracking-[0.4em] uppercase text-[#999]">Skill Name (Harus Unik)</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white border border-[#ebebeb] text-[#111] text-xs px-4 py-3 focus:outline-none focus:border-[#ccc] transition-colors font-mono" placeholder="e.g. Next.js / TypeScript" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] tracking-[0.4em] uppercase text-[#999]">Category (4 Fixed Categories)</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white border border-[#ebebeb] text-[#111] text-xs px-4 py-3 focus:outline-none focus:border-[#ccc] transition-colors font-mono"
              >
                {FIXED_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#ebebeb]">
            <ImageUploader
              label="Skill Logo (SVG / PNG / WebP — bucket: portfolio)"
              currentImage={formData.logoUrl}
              bucket="portfolio"
              onUpload={(url) => setFormData({ ...formData, logoUrl: url || '' })}
              onDelete={() => setFormData({ ...formData, logoUrl: '' })}
            />
          </div>

          <button className="bg-[#111] text-white text-[10px] tracking-[0.4em] uppercase px-10 py-3.5 hover:bg-black transition-colors cursor-pointer w-full sm:w-auto">
            {editId ? 'Save Changes' : 'Publish Skill'}
          </button>
        </form>
      )}

      {/* Category Sections */}
      <div className="space-y-12">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-[#ebebeb] pb-3">
              <span className="text-[10px] tracking-[0.3em] font-bold uppercase text-[#111]">{category}</span>
              <span className="text-[9px] text-[#ccc] font-mono">({items.length})</span>
            </div>

            {items.length === 0 ? (
              <p className="text-xs text-[#bbb] italic py-2">No skills registered under {category}.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((s, idx) => (
                  <div key={s.id} className="border border-[#ebebeb] p-4 bg-white flex items-center justify-between group hover:border-[#111] transition-all">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-[#fafafa] border border-[#eee] flex items-center justify-center shrink-0 p-1">
                        {s.logoUrl ? (
                          <img src={s.logoUrl} alt={s.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[10px] text-[#ccc] font-mono">✦</span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-[#111] truncate">{s.name}</span>
                    </div>

                    <div className="flex gap-2 shrink-0 ml-2 items-center">
                      <div className="flex items-center gap-1 border-r border-[#ebebeb] pr-2">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(items, idx, 'up')}
                          className="text-[10px] text-[#999] hover:text-[#111] disabled:opacity-20 transition-colors px-1 cursor-pointer"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={idx === items.length - 1}
                          onClick={() => handleMove(items, idx, 'down')}
                          className="text-[10px] text-[#999] hover:text-[#111] disabled:opacity-20 transition-colors px-1 cursor-pointer"
                          title="Move Down"
                        >
                          ↓
                        </button>
                      </div>
                      <button onClick={() => handleEdit(s)} className="text-[8px] tracking-widest uppercase text-[#999] hover:text-[#111]">Edit</button>
                      <button onClick={() => handleDelete(s.id)} className="text-[8px] tracking-widest uppercase text-[#ccc] hover:text-red-500">Del</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
