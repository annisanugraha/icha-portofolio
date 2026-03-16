import React from 'react';
import { getProjectBySlug } from '@/actions/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProjectGallery } from '@/components/ProjectGallery';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = (await getProjectBySlug(slug)) as any;

  if (!project) notFound();

  const galleryImages = project.galleryImages && project.galleryImages.length > 0 
    ? project.galleryImages 
    : [];

  return (
    <main className="min-h-screen bg-white">
      
      {/* ── SECTION 1: HERO SPLIT ── */}
      <section className="flex flex-col md:flex-row items-center border-b border-[#eee] pt-20 md:pt-0">
        {/* Left Column: Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-8 md:p-16 lg:px-20 lg:py-32 bg-white">
          <nav className="mb-8 md:mb-20">
            <Link href="/" className="text-[9px] tracking-[0.4em] uppercase text-[#111] hover:text-[#999] transition-colors flex items-center gap-3">
              <span className="w-4 h-px bg-current" />
              Work
            </Link>
          </nav>

          <div className="space-y-3 md:space-y-4">
            <span className="text-[8px] tracking-[0.4em] uppercase text-[#bbb] block">
              {project.category} · {project.year}
            </span>
            <h1 className="text-xl md:text-2xl font-medium tracking-tight text-[#111] leading-tight">
              {project.title}
            </h1>
            <p className="text-xs text-[#888] italic leading-relaxed max-w-xs">
              {project.shortDescription}
            </p>
          </div>
        </div>

        {/* Right Column: Hero Image (4:3 Aspect) */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-16 lg:p-20 flex items-center justify-center bg-[#fafafa] md:bg-white">
          <div className="w-full aspect-[4/3] overflow-hidden bg-[#fcfcfc] border border-[#f5f5f5] shadow-sm md:shadow-none">
            <img
              src={project.imageUrl || 'https://placehold.co/800x600/fcfcfc/eee?text=—'}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PROCESS GRID ── */}
      <section className="main-container py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 lg:gap-20">
          {[
            { label: 'WHY', text: project.contextWhy },
            { label: 'WHAT', text: project.scopeWhat },
            { label: 'HOW', text: project.outcomeHow },
          ].map(({ label, text }) => (
            <div key={label} className="space-y-3 md:space-y-4">
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-[#111] font-semibold border-b border-[#f5f5f5] pb-2 md:pb-3">
                {label}
              </h3>
              <p className="text-xs text-[#777] leading-relaxed whitespace-pre-wrap">
                {text || '—'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: DESCRIPTION ── */}
      <section className="main-container py-12 md:py-16 border-t border-[#f5f5f5]">
        <div className="w-full">
          <div className="text-xs text-[#555] leading-[1.8] font-light whitespace-pre-wrap max-w-none">
            {project.fullDescription}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: GALLERY ── */}
      {galleryImages.length > 0 && (
        <section className="main-container py-12 md:py-16 border-t border-[#f5f5f5]">
          <ProjectGallery images={galleryImages} title={project.title} />
        </section>
      )}

      {/* ── SECTION 5: FOOTER (LINKS & NAVIGATION) ── */}
      <section className="main-container pt-16 md:pt-20 pb-32 md:pb-40 border-t border-[#f5f5f5]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16">
          
          {/* Custom Links */}
          <div className="space-y-4 md:space-y-6 w-full md:w-auto">
            <span className="text-[8px] tracking-[0.4em] uppercase text-[#bbb] block font-medium">Resources</span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:gap-x-8 md:gap-y-4">
              {project.links && project.links.length > 0 ? (
                project.links.map((link: any) => (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] tracking-widest uppercase text-[#111] hover:text-[#999] transition-colors border-b border-[#eee] hover:border-[#999] pb-0.5"
                  >
                    {link.label} ↗
                  </a>
                ))
              ) : (
                <span className="text-[10px] text-[#ddd] italic">None.</span>
              )}
            </div>
          </div>

          {/* Next Project */}
          {project.nextProject && (
            <div className="space-y-4 md:text-right w-full md:w-auto pt-8 md:pt-0 border-t md:border-t-0 border-[#f9f9f9]">
              <span className="text-[8px] tracking-[0.4em] uppercase text-[#bbb] block font-medium">[NEXT]</span>
              <Link 
                href={`/work/${project.nextProject.slug}`}
                className="group inline-flex flex-col md:items-end"
              >
                <span className="text-base font-medium text-[#111] group-hover:text-[#999] transition-colors tracking-tight">
                  {project.nextProject.title}
                </span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#ccc] mt-1 group-hover:text-[#111] transition-colors">
                  View →
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>

    </main>
  );
}
