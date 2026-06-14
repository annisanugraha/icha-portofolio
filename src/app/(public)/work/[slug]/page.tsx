import React from 'react';
import { getProjectBySlug } from '@/actions/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProjectGallery } from '@/components/ProjectGallery';
import { PageSectionHeader } from '@/components/PageSectionHeader';

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
    <main className="min-h-screen bg-white pt-16 md:pt-0">
      
      {/* ── SECTION 1: HERO SPLIT ── */}
      <section className="flex flex-col md:flex-row items-center min-h-screen">
        {/* Left Column: Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:py-16 md:pl-16 md:pr-6 lg:py-20 lg:pl-20 lg:pr-8 bg-white">

          <div className="space-y-3 md:space-y-4">
            <span className="text-[9px] tracking-[0.4em] uppercase text-[#bbb] block">
              {project.category} · {project.year}
            </span>
            <h3 className="text-xl md:text-2xl font-medium tracking-tight text-[#111] leading-tight pb-4">
              {project.title}
            </h3>
            <p className="text-[11px] text-[#888] italic leading-relaxed">
              {project.shortDescription}
            </p>
            {/* Tech Stack Badges */}
            {project.techStack && project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3">
                {project.techStack.map((tech: string, i: number) => (
                  <span key={i} className="text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 bg-[#fafafa] border border-[#ebebeb] text-[#777] rounded-sm">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Hero Image (4:3 Aspect) */}
        <div className="w-full md:w-1/2 p-8 md:py-16 md:pr-16 md:pl-6 lg:py-20 lg:pr-20 lg:pl-8 flex items-center justify-center">
          <div className="w-full aspect-[4/3] overflow-hidden border border-[#f5f5f5] shadow-sm md:shadow-none">
            <img
              src={project.imageUrl || 'https://placehold.co/800x600/fcfcfc/eee?text=—'}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PROCESS GRID ── */}
      <section className="main-container py-6 pb-8">
        <PageSectionHeader title="Case Study" number="02" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 lg:gap-20">
          {[
            { label: 'WHY', text: project.contextWhy },
            { label: 'WHAT', text: project.scopeWhat },
            { label: 'HOW', text: project.outcomeHow },
          ].map(({ label, text }) => (
            
            <div key={label} className="space-y-2">
              <p className="text-xs tracking-[0.2em] uppercase text-[#777]">
                {label}
              </p>
              <p className="text-[10px] text-[#777] leading-relaxed whitespace-pre-wrap">
                {text || '—'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: DESCRIPTION ── */}
      <section className="main-container py-6 pb-8">
        <PageSectionHeader title="The Deep Dive" number="03" />
        <div className="w-full">
          <div className="text-[10px] text-[#555] leading-[1.8] font-light whitespace-pre-wrap max-w-none">
            {project.fullDescription}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: GALLERY ── */}
      {galleryImages.length > 0 && (
        
        <section className="main-container py-6 pb-8">
          <PageSectionHeader title="Gallery" number="04" />
          <ProjectGallery images={galleryImages} title={project.title} />
        </section>
      )}

      {/* ── SECTION 5: RESOURCES ── */}
      <section className="main-container py-6 pb-12">
        <PageSectionHeader title="Resources" number="05" />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          {project.links && project.links.length > 0 ? (
            project.links.map((link: any, i: number) => (
              <React.Fragment key={link.id}>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-mono font-medium tracking-[0.2em] uppercase text-[#555] hover:text-[#999] transition-colors"
                >
                  {link.label} <span className="text-[#bbb]">↗</span>
                </a>
                {i !== project.links.length - 1 && (
                  <span className="text-[#eee] font-light">|</span>
                )}
              </React.Fragment>
            ))
          ) : (
            <span className="text-[10px] text-[#ddd] italic font-mono uppercase tracking-widest">No resources available.</span>
          )}
        </div>
      </section>

      {/* ── SECTION 6: NAVIGATION ── */}
      <section className="main-container pt-6">
        <div className="flex justify-between items-center">
          {/* Tombol Prev */}
          {project.prevProject ? (
            <Link 
              href={`/work/${project.prevProject.slug}`}
              className="bg-white text-[#555] border border-[#888] text-[9px] tracking-[0.4em] uppercase px-8 py-3 hover:bg-[#111] hover:text-white transition-all cursor-pointer inline-flex items-center gap-2 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>PREV PROJECT</span>
            </Link>
          ) : <div />}

          {/* Tombol Next */}
          {project.nextProject ? (
            <Link 
              href={`/work/${project.nextProject.slug}`}
              className="bg-white text-[#555] border border-[#888] text-[9px] tracking-[0.4em] uppercase px-8 py-3 hover:bg-[#111] hover:text-white transition-all cursor-pointer inline-flex items-center gap-2 group"
            >
              <span>NEXT PROJECT</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ) : <div />}
        </div>
      </section>

    </main>
  );
}
