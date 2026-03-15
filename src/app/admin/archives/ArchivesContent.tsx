'use client';

import React, { useState, useEffect } from 'react';
import { getCertificates, addCertificate, updateCertificate, deleteCertificate, reorderCertificates } from '@/actions/certificate';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function ArchivesContent() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '', category: '', description: '', imageUrl: '', order: 0
  });

  useEffect(() => { loadCerts(); }, []);

  async function loadCerts() {
    const data = await getCertificates();
    setCerts(data);
    setLoading(false);
  }

  const handleEdit = (c: any) => {
    setEditId(c.id);
    setFormData({
      title: c.title, category: c.category, description: c.description, imageUrl: c.imageUrl || '', order: c.order || 0
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = editId 
        ? await updateCertificate(editId, formData)
        : await addCertificate(formData.title, formData.category, formData.description, formData.imageUrl || '', certs.length);

      if (res.success) {
        setShowForm(false);
        setEditId(null);
        setFormData({ title: '', category: '', description: '', imageUrl: '', order: 0 });
        loadCerts();
      } else {
        alert('Error: ' + res.error);
      }
    } catch (err: any) {
      alert('An unexpected error occurred: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certificate?')) return;
    const res = await deleteCertificate(id);
    if (res.success) loadCerts();
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const items = Array.from(certs);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setCerts(items);
    try {
      await reorderCertificates(items.map((item, i) => ({ id: item.id, order: i })));
    } catch (err) {
      console.error('Reorder error:', err);
    }
  };

  if (loading) return (
    <div className="p-10 flex items-center gap-3">
      <div className="w-1 h-4 bg-[#111] animate-pulse" />
      <span className="text-[10px] tracking-widest text-[#999] uppercase">Loading...</span>
    </div>
  );

  return (
    <div className="p-10 space-y-10 pb-32">
      {/* Header */}
      <div className="border-b border-[#ebebeb] pb-8 flex items-end justify-between">
        <div>
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase mb-2">Validation</p>
          <h1 className="text-2xl text-[#111] font-medium tracking-tight">Archives. <span className="text-[#ccc] text-lg">({certs.length})</span></h1>
        </div>
        <button 
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditId(null);
            } else {
              setEditId(null);
              setFormData({ title: '', category: '', description: '', imageUrl: '', order: certs.length });
              setShowForm(true);
            }
          }}
          className="text-[10px] tracking-[0.3em] uppercase border border-[#ebebeb] px-5 py-2.5 hover:border-[#111] hover:text-[#111] text-[#999] transition-all cursor-pointer"
        >
          {showForm ? '× Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-[#ebebeb] p-8 space-y-8 bg-[#fafafa]">
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase">{editId ? 'Edit Entry' : 'New Entry'}</p>
          
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[9px] tracking-[0.4em] uppercase text-[#999]">Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white border border-[#ebebeb] text-[#111] text-xs px-4 py-3 focus:outline-none focus:border-[#ccc] transition-colors font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] tracking-[0.4em] uppercase text-[#999]">Category</label>
              <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white border border-[#ebebeb] text-[#111] text-xs px-4 py-3 focus:outline-none focus:border-[#ccc] transition-colors font-mono" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] tracking-[0.4em] uppercase text-[#999]">Description</label>
            <textarea rows={4} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white border border-[#ebebeb] text-[#111] text-xs px-4 py-3 focus:outline-none focus:border-[#ccc] transition-colors font-mono resize-none" />
          </div>
          
          <div className="pt-4 border-t border-[#ebebeb]">
            <ImageUploader 
              label="Certificate Document"
              currentImage={formData.imageUrl}
              onUpload={(url) => setFormData({...formData, imageUrl: url || ''})}
              onDelete={() => setFormData({...formData, imageUrl: ''})}
            />
          </div>

          <button className="bg-[#111] text-white text-[10px] tracking-[0.4em] uppercase px-10 py-3.5 hover:bg-black transition-colors cursor-pointer">
            {editId ? 'Save Changes' : 'Publish Entry'}
          </button>
        </form>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="archives" direction="horizontal">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {certs.map((c, index) => (
                <Draggable key={c.id} draggableId={c.id} index={index}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`border group select-none transition-all duration-300 ${snapshot.isDragging ? 'border-[#111] bg-[#fafafa] z-50' : 'border-[#ebebeb] hover:border-[#111] hover:bg-[#fafafa] hover:shadow-sm'}`}
                    >
                      <div className="aspect-[4/3] bg-[#fafafa] overflow-hidden relative">
                        <img src={c.imageUrl || 'https://placehold.co/600x400/fafafa/eee?text=—'} alt={c.title} className="w-full h-full object-cover opacity-100 group-hover:opacity-80 transition-opacity duration-500" />
                        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 border border-[#ebebeb] opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="text-[7px] tracking-widest text-[#999] uppercase">Drag to Reorder</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="space-y-1">
                          <p className="text-[8px] tracking-widest text-[#999] uppercase">{c.category}</p>
                          <p className="text-sm text-[#111] line-clamp-1">{c.title}</p>
                        </div>
                        <div className="flex gap-4 border-t border-[#ebebeb] pt-3">
                          <button onClick={() => handleEdit(c)} className="text-[9px] tracking-widest text-[#999] hover:text-[#111] transition-colors uppercase cursor-pointer">Edit</button>
                          <button onClick={() => handleDelete(c.id)} className="text-[9px] tracking-widest text-[#ccc] hover:text-red-500 transition-colors uppercase cursor-pointer">Delete</button>
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
