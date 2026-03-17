'use client';

import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '@/actions/profile';
import { ImageUploader } from '@/components/admin/ImageUploader';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="text-[9px] tracking-[0.4em] uppercase text-[#999]">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full bg-[#fafafa] border border-[#ebebeb] text-[#111] text-xs px-4 py-3 focus:outline-none focus:border-[#ccc] transition-colors font-mono placeholder-[#bbb]";

export default function ProfileContent() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfile().then((d) => { setProfile(d); setLoading(false); });
  }, []);

  const set = (key: string, val: any) => setProfile((p: any) => ({ ...p, [key]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile(profile);
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert('Error: ' + (res.error || 'Gagal update profil'));
      }
    } catch (err: any) {
      alert('An unexpected error occurred: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-4 bg-[#111] animate-pulse" />
      <span className="text-[10px] tracking-widest text-[#999] uppercase">Loading...</span>
    </div>
  );

  return (
    <div className="space-y-10 lg:space-y-14 pb-32 p-6 lg:p-10">

      {/* Header */}
      <div className="border-b border-[#ebebeb] pb-8">
        <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase mb-2">Landing</p>
        <h1 className="text-2xl text-[#111] font-medium tracking-tight">Identity.</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-10 lg:space-y-14">

        {/* SEO Section */}
        <section className="space-y-6">
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase border-b border-[#ebebeb] pb-3">Search Engine Optimization (SEO)</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div className="space-y-5">
              <Field label="Site Title">
                <input type="text" value={profile.siteTitle || ''} onChange={e => set('siteTitle', e.target.value)} className={inputCls} placeholder="e.g. Annisa Nugraha — Software Engineer" />
              </Field>
              <Field label="Site Description">
                <textarea rows={3} value={profile.siteDescription || ''} onChange={e => set('siteDescription', e.target.value)} className={`${inputCls} resize-none`} placeholder="Brief description for Google search results..." />
              </Field>
            </div>
            <div className="space-y-5">
              <ImageUploader
                label="Favicon (Ikon Browser)"
                currentImage={profile.favicon}
                onUpload={(url) => set('favicon', url)}
                onDelete={() => set('favicon', null)}
              />
              <p className="text-[9px] text-[#999] leading-relaxed italic">
                * Favicon adalah ikon kecil yang muncul di tab browser. Gunakan format .ico atau .png (1:1).
              </p>
            </div>
          </div>
        </section>

        {/* Branding Section */}
        <section className="space-y-6">
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase border-b border-[#ebebeb] pb-3">Branding</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div className="space-y-5">
              <Field label="Logo Text">
                <input type="text" value={profile.logoText} onChange={e => set('logoText', e.target.value)} className={inputCls} />
              </Field>
              <Field label="LinkedIn URL">
                <input type="text" value={profile.linkedinUrl} onChange={e => set('linkedinUrl', e.target.value)} className={inputCls} />
              </Field>
              <Field label="GitHub URL">
                <input type="text" value={profile.githubUrl} onChange={e => set('githubUrl', e.target.value)} className={inputCls} />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email Address">
                  <input type="email" value={profile.emailAddress} onChange={e => set('emailAddress', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Email Subject">
                  <input type="text" value={profile.emailSubject || ''} onChange={e => set('emailSubject', e.target.value)} className={inputCls} placeholder="e.g. Hello Icha" />
                </Field>
              </div>
            </div>
            <div className="space-y-5">
              <ImageUploader
                label="Logo Image (Optional)"
                currentImage={profile.logoImage}
                onUpload={(url) => set('logoImage', url)}
                onDelete={() => set('logoImage', null)}
              />
              <p className="text-[9px] text-[#999] leading-relaxed">
                Tip: Use a square image with a transparent background (PNG/SVG) for the best look in the sidebar.
              </p>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="space-y-6">
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase border-b border-[#ebebeb] pb-3">Hero Section</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Role Label">
              <input type="text" value={profile.heroRole} onChange={e => set('heroRole', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Subtitle">
              <input type="text" value={profile.heroSubtitle} onChange={e => set('heroSubtitle', e.target.value)} className={inputCls} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Main Heading">
                <textarea rows={3} value={profile.heroTitle} onChange={e => set('heroTitle', e.target.value)} className={`${inputCls} resize-none`} />
              </Field>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="space-y-6">
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase border-b border-[#ebebeb] pb-3">About Persona</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div className="space-y-5 order-2 lg:order-1">
              <Field label="Intro Quote">
                <input type="text" value={profile.aboutQuote} onChange={e => set('aboutQuote', e.target.value)} className={`${inputCls} italic`} />
              </Field>
              <Field label="Bio Paragraph 1">
                <textarea rows={4} value={profile.aboutBio1} onChange={e => set('aboutBio1', e.target.value)} className={`${inputCls} resize-none`} />
              </Field>
              <Field label="Bio Paragraph 2">
                <textarea rows={4} value={profile.aboutBio2} onChange={e => set('aboutBio2', e.target.value)} className={`${inputCls} resize-none`} />
              </Field>
            </div>
            <div className="order-1 lg:order-2">
              <ImageUploader
                label="Portrait Photo"
                currentImage={profile.aboutImage}
                onUpload={(url) => set('aboutImage', url)}
                onDelete={() => set('aboutImage', null)}
              />
            </div>
          </div>
        </section>

        {/* Save */}
        <button
          disabled={saving}
          className="bg-[#111] text-white text-[10px] tracking-[0.4em] uppercase px-10 py-4 hover:bg-black transition-colors disabled:opacity-30 font-medium cursor-pointer w-full sm:w-auto"
        >
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Identity'}
        </button>

      </form>
    </div>
  );
}
