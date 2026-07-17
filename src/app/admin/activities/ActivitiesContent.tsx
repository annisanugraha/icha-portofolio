'use client';

import React, { useState, useEffect } from 'react';
import { getAllActivities, createActivity, updateActivity, deleteActivity, reorderActivities } from '@/actions/activity';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function ActivitiesContent() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '', event: '', year: '', description: '', imageUrl: '', order: 0, highlighted: false
  });

  useEffect(() => { loadActivities(); }, []);

  async function loadActivities() {
    const data = await getAllActivities();
    setActivities(data);
    setLoading(false);
  }

  const handleEdit = (a: any) => {
    setEditId(a.id);
    setFormData({
      title: a.title,
      event: a.event,
      year: a.year,
      description: a.description || '',
      imageUrl: a.imageUrl || '',
      order: a.order || 0,
      highlighted: a.highlighted || false
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = editId
        ? await updateActivity(editId, formData)
        : await createActivity({
            title: formData.title,
            event: formData.event,
            year: formData.year,
            description: formData.description || undefined,
            imageUrl: formData.imageUrl || undefined,
            order: activities.length,
            highlighted: formData.highlighted
          });

      if (res.success) {
        setShowForm(false);
        setEditId(null);
        setFormData({ title: '', event: '', year: '', description: '', imageUrl: '', order: 0, highlighted: false });
        loadActivities();
      } else {
        alert('Error: ' + res.error);
      }
    } catch (err: any) {
      alert('An unexpected error occurred: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this activity?')) return;
    const res = await deleteActivity(id);
    if (res.success) loadActivities();
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const items = Array.from(activities);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setActivities(items);
    try {
      await reorderActivities(items.map((item, i) => ({ id: item.id, order: i })));
    } catch (err) {
      console.error('Reorder error:', err);
    }
  };

  if (loading) return (
    <div className="flex items-center gap-3 p-6 lg:p-10">
      <div className="w-1 h-4 bg-[#111] animate-pulse" />
      <span className="text-[10px] tracking-widest text-[#999] uppercase">Loading Activities...</span>
    </div>
  );

  return (
    <div className="space-y-6 lg:space-y-10 pb-32 p-6 lg:p-10">
      {/* Header */}
      <div className="border-b border-[#ebebeb] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase mb-2">Experiences & Events</p>
          <h1 className="text-2xl text-[#111] font-medium tracking-tight">Activities. <span className="text-[#ccc] text-lg">({activities.length})</span></h1>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditId(null);
            } else {
              setEditId(null);
              setFormData({ title: '', event: '', year: '', description: '', imageUrl: '', order: activities.length, highlighted: false });
              setShowForm(true);
            }
          }}
          className="text-[10px] tracking-[0.3em] uppercase border border-[#ebebeb] px-5 py-2.5 hover:border-[#111] hover:text-[#111] text-[#999] transition-all cursor-pointer w-full sm:w-auto"
        >
          {showForm ? '× Cancel' : '+ Add Activity'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-[#ebebeb] p-5 lg:p-8 space-y-8 bg-[#fafafa]">
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase">{editId ? 'Edit Activity' : 'New Activity'}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-[9px] tracking-[0.4em] uppercase text-[#999]">Title / Role</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white border border-[#ebebeb] text-[#111] text-xs px-4 py-3 focus:outline-none focus:border-[#ccc] transition-colors font-mono" placeholder="e.g. Speaker / Committee" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] tracking-[0.4em] uppercase text-[#999]">Event / Organization</label>
              <input required type="text" value={formData.event} onChange={e => setFormData({ ...formData, event: e.target.value })} className="w-full bg-white border border-[#ebebeb] text-[#111] text-xs px-4 py-3 focus:outline-none focus:border-[#ccc] transition-colors font-mono" placeholder="e.g. Tech Summit Jakarta" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] tracking-[0.4em] uppercase text-[#999]">Year</label>
              <input required type="text" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="w-full bg-white border border-[#ebebeb] text-[#111] text-xs px-4 py-3 focus:outline-none focus:border-[#ccc] transition-colors font-mono" placeholder="e.g. 2024" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] tracking-[0.4em] uppercase text-[#999]">Description (Optional)</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white border border-[#ebebeb] text-[#111] text-xs px-4 py-3 focus:outline-none focus:border-[#ccc] transition-colors font-mono resize-none" placeholder="Brief context about your involvement..." />
          </div>

          <div className="pt-4 border-t border-[#ebebeb]">
            <ImageUploader
              label="Activity Photo / Banner"
              currentImage={formData.imageUrl}
              onUpload={(url) => setFormData({ ...formData, imageUrl: url || '' })}
              onDelete={() => setFormData({ ...formData, imageUrl: '' })}
            />
          </div>

          <label className="flex items-center gap-2 text-[9px] tracking-widest text-[#999] uppercase cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.highlighted}
              onChange={e => setFormData({ ...formData, highlighted: e.target.checked })}
              className="accent-[#111] cursor-pointer"
            />
            <span>Tampil di Homepage (Highlighted)</span>
          </label>

          <button className="bg-[#111] text-white text-[10px] tracking-[0.4em] uppercase px-10 py-3.5 hover:bg-black transition-colors cursor-pointer w-full sm:w-auto">
            {editId ? 'Save Changes' : 'Publish Activity'}
          </button>
        </form>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="activities" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {activities.map((a, index) => (
                <Draggable key={a.id} draggableId={a.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 border bg-white group select-none transition-all duration-300 ${snapshot.isDragging ? 'border-[#111] shadow-xl z-50' : 'border-[#ebebeb] hover:border-[#111]'}`}
                    >
                      <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                        {/* Drag Handle */}
                        <div {...provided.dragHandleProps} className="text-[#ccc] hover:text-[#111] cursor-grab active:cursor-grabbing shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                          </svg>
                        </div>

                        {/* Small Thumbnail */}
                        <div className="w-16 sm:w-20 h-12 sm:h-14 bg-[#fafafa] overflow-hidden border border-[#eee] shrink-0">
                          <img src={a.imageUrl || 'https://placehold.co/600x400/fafafa/eee?text=—'} alt={a.title} className="w-full h-full object-cover" />
                        </div>

                        {/* Title & Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] tracking-[0.2em] text-[#999] uppercase font-bold">{a.year}</span>
                            <span className="text-[8px] tracking-[0.1em] text-[#ccc] uppercase">|</span>
                            <span className="text-[8px] tracking-[0.2em] text-[#666] uppercase truncate">{a.event}</span>
                          </div>
                          <p className="text-xs font-medium text-[#111] truncate mt-0.5">{a.title}</p>
                        </div>
                      </div>

                      {/* Highlight Toggle & Actions */}
                      <div className="flex items-center gap-6 shrink-0 justify-end ml-9 sm:ml-0">
                        <label className="flex items-center gap-2 text-[8px] tracking-widest text-[#999] uppercase cursor-pointer select-none border border-[#ebebeb] px-3 py-1.5 hover:border-[#ccc] bg-[#fafafa]">
                          <input
                            type="checkbox"
                            checked={a.highlighted || false}
                            onChange={async () => {
                              await updateActivity(a.id, { highlighted: !a.highlighted });
                              loadActivities();
                            }}
                            className="accent-[#111] cursor-pointer"
                          />
                          <span>Tampil di Homepage</span>
                        </label>
                        <div className="flex gap-4">
                          <button onClick={() => handleEdit(a)} className="text-[9px] tracking-widest text-[#999] hover:text-[#111] transition-colors uppercase cursor-pointer border-b border-transparent hover:border-[#111]">Edit</button>
                          <button onClick={() => handleDelete(a.id)} className="text-[9px] tracking-widest text-[#ccc] hover:text-red-500 transition-colors uppercase cursor-pointer border-b border-transparent hover:border-red-500">Delete</button>
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
