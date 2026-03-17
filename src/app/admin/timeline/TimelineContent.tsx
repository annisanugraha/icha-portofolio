'use client';

import React, { useState, useEffect } from 'react';
import { getExperiences, addExperience, updateExperience, deleteExperience, reorderExperiences } from '@/actions/profile';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ImageUploader } from '@/components/admin/ImageUploader';

const inputCls = "w-full bg-[#fafafa] border border-[#ebebeb] text-[#111] text-xs px-4 py-3 focus:outline-none focus:border-[#ccc] transition-colors font-mono placeholder-[#bbb]";
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="text-[9px] tracking-[0.4em] uppercase text-[#999]">{label}</label>
    {children}
  </div>
);

const emptyForm = { year: '', title: '', company: '', description: '', imageUrl: '' };

export default function TimelineContent() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { load(); }, []);
  async function load() { 
    const data = await getExperiences();
    setItems(data); 
    setLoading(false); 
  }

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditId(item.id);
    setForm({
      year: item.year,
      title: item.title,
      company: item.company,
      description: item.description,
      imageUrl: item.imageUrl || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = editId 
        ? await updateExperience(editId, form)
        : await addExperience({ ...form, order: items.length });

      if (res.success) { 
        setShowForm(false); 
        setEditId(null);
        setForm(emptyForm); 
        load(); 
      } else {
        alert('Error: ' + (res.error || 'Gagal menyimpan'));
      }
    } catch (err: any) {
      alert('An unexpected error occurred: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete entry?')) return;
    const res = await deleteExperience(id);
    if (res.success) load();
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
    await reorderExperiences(reordered.map((item, i) => ({ id: item.id, order: i })));
  };

  if (loading) return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-4 bg-[#111] animate-pulse" />
      <span className="text-[10px] tracking-widest text-[#999] uppercase">Loading...</span>
    </div>
  );

  return (
    <div className="space-y-6 lg:space-y-10 pb-32 p-6 lg:p-10">

      {/* Header */}
      <div className="border-b border-[#ebebeb] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase mb-2">About</p>
          <h1 className="text-2xl text-[#111] font-medium tracking-tight">Chronology. <span className="text-[#ccc] text-lg">({items.length})</span></h1>
        </div>
        <button onClick={showForm ? () => setShowForm(false) : openAdd}
          className="text-[10px] tracking-[0.3em] uppercase border border-[#ebebeb] px-5 py-2.5 hover:border-[#111] hover:text-[#111] text-[#999] transition-all cursor-pointer w-full sm:w-auto">
          {showForm ? '× Cancel' : '+ Add Milestone'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-[#ebebeb] p-5 lg:p-8 space-y-8 bg-[#fafafa]">
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase">{editId ? 'Edit Milestone' : 'New Milestone'}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Year"><input required type="text" value={form.year} onChange={e => set('year', e.target.value)} className={inputCls} placeholder="2024" /></Field>
            <Field label="Title"><input required type="text" value={form.title} onChange={e => set('title', e.target.value)} className={inputCls} /></Field>
            <Field label="Company / Org"><input required type="text" value={form.company} onChange={e => set('company', e.target.value)} className={inputCls} /></Field>
          </div>
          <Field label="Description">
            <textarea rows={3} required value={form.description} onChange={e => set('description', e.target.value)} className={`${inputCls} resize-none`} />
          </Field>
          <div className="border-t border-[#ebebeb]">
            <ImageUploader 
              label="Memory Fragment (Optional)"
              currentImage={form.imageUrl}
              onUpload={(url) => set('imageUrl', url || '')}
              onDelete={() => set('imageUrl', '')}
            />
          </div>
          <button disabled={saving} className="bg-[#111] text-white text-[10px] tracking-[0.4em] uppercase px-10 py-3.5 hover:bg-black transition-colors disabled:opacity-30 cursor-pointer w-full sm:w-auto">
            {saving ? 'Saving...' : editId ? 'Update Milestone' : 'Add Milestone'}
          </button>
        </form>
      )}

      {/* List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="timeline">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border select-none transition-colors group ${snapshot.isDragging ? 'border-[#111] bg-[#fafafa]' : 'border-[#ebebeb] hover:border-[#ccc]'}`}
                    >
                      <div className="flex items-center gap-4 sm:gap-8 flex-1 min-w-0">
                        {/* Tiny Preview */}
                        <div className="w-8 h-8 bg-[#fafafa] border border-[#ebebeb] overflow-hidden grayscale shrink-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[6px] text-[#ccc]">N/A</div>
                          )}
                        </div>
                        <span className="text-[9px] text-[#ccc] w-10 tabular-nums tracking-widest shrink-0">{item.year}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#111] truncate">{item.title}</p>
                          <p className="text-[9px] tracking-widest text-[#999] uppercase mt-0.5 truncate">{item.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0">
                        <span className="text-[8px] text-[#eee] group-hover:text-[#ccc] transition-colors uppercase tracking-widest sm:block hidden">⠿ drag</span>
                        <div className="flex gap-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(item)} className="text-[9px] tracking-widest text-[#999] hover:text-[#111] transition-colors uppercase cursor-pointer">Edit</button>
                          <button onClick={() => handleDelete(item.id)} className="text-[9px] tracking-widest text-[#ccc] hover:text-red-500 transition-colors uppercase cursor-pointer">Delete</button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

    </div>
  );
}
