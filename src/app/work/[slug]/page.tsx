import React from 'react';
import { getProjectBySlug } from '@/actions/project';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  // Simulasi multiple images — nanti bisa diganti dari DB
  const galleryImages = project.galleryImages || [project.imageUrl, project.imageUrl, project.imageUrl, project.imageUrl].filter(Boolean);

  return (
    <main className="min-h-screen bg-white">

      {/* ── SECTION 1: Full viewport hero ── */}
      <section className="h-screen flex flex-col justify-between pt-20 pb-12">
        <div className="main-container w-full">

          {/* Back */}
          <Link href="/" className="label inline-flex items-center gap-3 hover:text-[#111] transition-colors">
            <div className="w-5 h-px bg-current" />
            Work
          </Link>
        </div>

        {/* Title block — bottom of screen */}
        <div className="main-container w-full space-y-4">
          <span className="label">{project.category} · {project.year}</span>
          <h1 className="max-w-3xl">{project.title}</h1>
          <p className="text-sm text-[#999] italic max-w-lg leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* Scroll hint */}
        <div className="main-container w-full flex items-center gap-3">
          <div className="w-px h-6 bg-[#ddd]" />
          <span className="label text-[#ccc]">Scroll</span>
        </div>
      </section>

      {/* ── SECTION 2: Hero image full width ── */}
      <section className="h-screen">
        <div className="h-full img-container overflow-hidden">
          <img
            src={project.imageUrl || 'https://placehold.co/1600x900/f5f5f5/999?text=—'}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ── SECTION 3: Overview + description ── */}
      <section className="main-container py-24 space-y-16">

        {/* Overview grid */}
        <div className="grid grid-cols-3 gap-8 pb-12 border-b border-[#ebebeb]">
          {[
            { label: 'Context', text: 'Strategic foundation and core challenges.' },
            { label: 'Scope', text: 'Architecture and technical implementation.' },
            { label: 'Outcome', text: 'Effective digital product delivery.' },
          ].map(({ label, text }) => (
            <div key={label} className="space-y-2">
              <span className="label block">{label}</span>
              <p className="text-xs text-[#999] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-4">
          <span className="label block">Description</span>
          <div className="text-sm text-[#555] leading-[1.9] whitespace-pre-wrap">
            {project.fullDescription}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Photo gallery grid (pennybanks style) ── */}
      {galleryImages.length > 0 && (
        <section className="main-container pb-24 space-y-4">
          <span className="label block mb-8">Gallery</span>

          {/* Grid: 1 besar + 2 kecil, lalu 3 kolom */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className={`img-container overflow-hidden rounded-sm ${
                  i === 0 ? 'col-span-2 md:col-span-2 aspect-[16/9]' : 'aspect-square'
                }`}
              >
                <img
                  src={img || 'https://placehold.co/800x600/f5f5f5/999?text=—'}
                  alt={`${project.title} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SECTION 5: Links ── */}
      <div className="main-container pb-24 flex items-center gap-8 pt-6 border-t border-[#ebebeb]">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer"
            className="label hover:text-[#111] transition-colors border-b border-current pb-px">
            Source
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noreferrer"
            className="label hover:text-[#111] transition-colors border-b border-current pb-px">
            Live
          </a>
        )}
      </div>

    </main>
  );
}