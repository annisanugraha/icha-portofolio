'use client';

import React, { useState, useEffect } from 'react';
import { getProjects, addProject, updateProject, deleteProject, reorderProjects, toggleProjectFeatured } from '@/actions/projects';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { MultiImageUploader } from '@/components/admin/MultiImageUploader';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const inputCls = "w-full bg-[#fafafa] border border-[#ebebeb] text-[#111] text-xs px-4 py-3 focus:outline-none focus:border-[#ccc] transition-colors font-mono placeholder-[#bbb]";
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="text-[9px] tracking-[0.4em] uppercase text-[#999]">{label}</label>
    {children}
  </div>
);

const emptyForm = {
  title: '', slug: '', category: '', year: '',
  shortDescription: '', fullDescription: '',
  contextWhy: '', scopeWhat: '', outcomeHow: '',
  imageUrl: '', galleryImages: [] as string[],
  links: [] as { label: string; url: string }[],
  featured: false,
};

export default function ProjectsContent() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { load(); }, []);
  async function load() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Load projects error:', err);
    } finally {
      setLoading(false);
    }
  }

  const openAdd = () => { 
    setEditId(null); 
    setForm(emptyForm); 
    setShowForm(true); 
  };
  
  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({ 
      title: p.title, 
      slug: p.slug, 
      category: p.category, 
      year: p.year, 
      shortDescription: p.shortDescription, 
      fullDescription: p.fullDescription, 
      contextWhy: p.contextWhy || '',
      scopeWhat: p.scopeWhat || '',
      outcomeHow: p.outcomeHow || '',
      imageUrl: p.imageUrl || '', 
      galleryImages: p.galleryImages || [], 
      links: p.links?.map((l: any) => ({ label: l.label, url: l.url })) || [],
      featured: p.featured || false 
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = editId ? await updateProject(editId, form) : await addProject(form);
      if (res.success) { 
        setShowForm(false); 
        setEditId(null); 
        load(); 
      } else {
        alert('Error: ' + res.error);
      }
    } catch (err: any) {
      alert('An unexpected error occurred: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      const res = await deleteProject(id);
      if (res.success) load();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      // Optimistic update
      setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
      
      const res = await toggleProjectFeatured(id);
      if (!res.success) {
        // Rollback if failed
        load();
        alert(res.error);
      }
    } catch (err: any) {
      load();
      alert('Toggle failed: ' + err.message);
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const items = Array.from(projects);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setProjects(items);
    try {
      await reorderProjects(items.map((item, i) => ({ id: item.id, order: i })));
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
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase mb-2">Work</p>
          <h1 className="text-2xl text-[#111] font-medium tracking-tight">Portfolio. <span className="text-[#ccc] text-lg">({projects.length})</span></h1>
        </div>
        <button onClick={showForm ? () => setShowForm(false) : openAdd}
          className="text-[10px] tracking-[0.3em] uppercase border border-[#ebebeb] px-5 py-2.5 hover:border-[#111] hover:text-[#111] text-[#999] transition-all cursor-pointer">
          {showForm ? '× Cancel' : '+ Add'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-[#ebebeb] p-8 space-y-8 bg-[#fafafa]">
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase">{editId ? 'Edit Project' : 'New Project'}</p>

          <div className="grid grid-cols-2 gap-5">
            <Field label="Title"><input required type="text" value={form.title} onChange={e => set('title', e.target.value)} className={inputCls} /></Field>
            <Field label="Slug"><input required type="text" value={form.slug} onChange={e => set('slug', e.target.value)} className={inputCls} /></Field>
            <Field label="Category"><input required type="text" value={form.category} onChange={e => set('category', e.target.value)} className={inputCls} /></Field>
            <Field label="Year"><input required type="text" value={form.year} onChange={e => set('year', e.target.value)} className={inputCls} /></Field>
          </div>

          <Field label="Short Description">
            <input required type="text" value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} className={inputCls} />
          </Field>

          <div className="grid grid-cols-3 gap-5 border-t border-[#ebebeb] pt-8">
            <Field label="The Why (Context)">
              <textarea rows={3} value={form.contextWhy} onChange={e => set('contextWhy', e.target.value)} className={`${inputCls} resize-none`} placeholder="Why did you build this?" />
            </Field>
            <Field label="The What (Scope)">
              <textarea rows={3} value={form.scopeWhat} onChange={e => set('scopeWhat', e.target.value)} className={`${inputCls} resize-none`} placeholder="What were the constraints?" />
            </Field>
            <Field label="The How (Outcome)">
              <textarea rows={3} value={form.outcomeHow} onChange={e => set('outcomeHow', e.target.value)} className={`${inputCls} resize-none`} placeholder="How did it end up?" />
            </Field>
          </div>
          <div className='border-t border-[#ebebeb] pt-8'>
            <Field label="Full Description">
              <textarea rows={5} required value={form.fullDescription} onChange={e => set('fullDescription', e.target.value)} className={`${inputCls} resize-none`} />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-10 border-t border-[#ebebeb] pt-8">
            <ImageUploader label="Thumbnail" currentImage={form.imageUrl} onUpload={url => set('imageUrl', url)} />
            
            <div className="space-y-8">
              <Field label="Project Links (Resources)">
                <div className="space-y-3">
                  {form.links.map((link, idx) => (
                    <div key={idx} className="flex gap-2 items-center animate-in fade-in slide-in-from-left-2 duration-300">
                      <input 
                        placeholder="Label (e.g. Figma)" 
                        value={link.label} 
                        onChange={e => {
                          const newLinks = [...form.links];
                          newLinks[idx].label = e.target.value;
                          set('links', newLinks);
                        }}
                        className={`${inputCls} w-1/3 uppercase`}
                      />
                      <input 
                        placeholder="URL" 
                        value={link.url} 
                        onChange={e => {
                          const newLinks = [...form.links];
                          newLinks[idx].url = e.target.value;
                          set('links', newLinks);
                        }}
                        className={`${inputCls} flex-1`}
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          set('links', form.links.filter((_, i) => i !== idx));
                        }}
                        className="text-red-400 hover:text-red-600 transition-colors px-2 text-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => set('links', [...form.links, { label: '', url: '' }])}
                    className="text-[9px] tracking-widest uppercase border border-dashed border-[#ccc] px-4 py-2 hover:border-[#111] text-[#999] hover:text-[#111] transition-all w-full"
                  >
                    + Add Link
                  </button>
                </div>
              </Field>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div onClick={() => set('featured', !form.featured)}
                  className={`w-8 h-4 border transition-colors ${form.featured ? 'bg-[#111] border-[#111]' : 'border-[#ccc]'}`}>
                  {form.featured && <div className="w-2 h-2 bg-white m-1" />}
                </div>
                <span className="text-[9px] tracking-widest uppercase text-[#999] group-hover:text-[#111] transition-colors">Featured on Home</span>
              </label>
            </div>
          </div>

          <MultiImageUploader label="Gallery Photos" currentImages={form.galleryImages} onUpload={urls => set('galleryImages', urls)} />

          <button disabled={saving} className="bg-[#111] text-white text-[10px] tracking-[0.4em] uppercase px-10 py-3.5 hover:bg-black transition-colors disabled:opacity-30 cursor-pointer">
            {saving ? 'Saving...' : editId ? 'Save Changes' : 'Publish'}
          </button>
        </form>
      )}

      {/* Project Grid */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="projects" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {projects.map((p, index) => (
                <Draggable key={p.id} draggableId={p.id} index={index}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-6 p-4 border bg-white group select-none transition-all duration-300 ${snapshot.isDragging ? 'border-[#111] shadow-xl z-50' : 'border-[#ebebeb] hover:border-[#111]'}`}
                    >
                      {/* Drag Handle */}
                      <div {...provided.dragHandleProps} className="text-[#ccc] hover:text-[#111] cursor-grab active:cursor-grabbing">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                        </svg>
                      </div>

                      {/* Small Thumbnail */}
                      <div className="w-20 h-14 bg-[#fafafa] overflow-hidden border border-[#eee] shrink-0">
                        <img src={p.imageUrl || 'https://placehold.co/400x300/fafafa/eee?text=—'} alt={p.title} className="w-full h-full object-cover" />
                      </div>

                      {/* Title & Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[8px] tracking-[0.2em] text-[#999] uppercase">{p.category} · {p.year}</p>
                        <p className="text-xs font-medium text-[#111] truncate">{p.title}</p>
                      </div>

                      {/* Featured Toggle */}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleFeatured(p.id);
                        }}
                        className={`px-2 py-1 border transition-all cursor-pointer flex items-center gap-1.5 ${
                          p.featured 
                            ? 'bg-black border-black text-white' 
                            : 'bg-white border-[#ebebeb] text-[#ccc] hover:border-[#111] hover:text-[#111]'
                        }`}
                      >
                        <span className="text-[9px] font-bold tracking-tighter uppercase">{p.featured ? '★ ON' : '☆ OFF'}</span>
                      </button>

                      {/* Actions */}
                      <div className="flex gap-4 shrink-0">
                        <button onClick={() => openEdit(p)} className="text-[9px] tracking-widest text-[#999] hover:text-[#111] transition-colors uppercase cursor-pointer border-b border-transparent hover:border-[#111]">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="text-[9px] tracking-widest text-[#ccc] hover:text-red-500 transition-colors uppercase cursor-pointer border-b border-transparent hover:border-red-500">Delete</button>
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
