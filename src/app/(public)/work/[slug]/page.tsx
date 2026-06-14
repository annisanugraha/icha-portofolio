import React from 'react';
import { getProjectBySlug } from '@/actions/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProjectGallery } from '@/components/ProjectGallery';
import { PageSectionHeader } from '@/components/PageSectionHeader';
import { FadeIn } from '@/components/animations/FadeIn';

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
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8 md:py-16 md:pl-12 md:pr-6 lg:py-20 lg:pl-12 bg-white">
          <FadeIn delay={0.1} once={true} className="space-y-3 md:space-y-4">
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#bbb] block">
              {project.category} · {project.year}
            </span>
            <h3 className="text-xl md:text-2xl font-medium tracking-tight text-[#111] leading-tight pb-4">
              {project.title}
            </h3>
            <p className="text-xs text-[#888] leading-relaxed">
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
          </FadeIn>
        </div>

        {/* Right Column: Hero Image (4:3 Aspect) */}
        <div className="w-full md:w-1/2 px-6 py-8 md:py-16 md:pr-12 md:pl-6 lg:py-20 flex items-center justify-center">
          <FadeIn delay={0.3} once={true} className="w-full aspect-[4/3] overflow-hidden border border-[#f5f5f5] shadow-sm md:shadow-none">
            <img
              src={project.imageUrl || 'https://placehold.co/800x600/fcfcfc/eee?text=—'}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 2: PROCESS GRID ── */}
      <section className="px-6 md:px-12 w-full py-6 pb-8">
        <FadeIn>
          <PageSectionHeader title="Case Study" number="02" />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 lg:gap-20 mt-6">
          {[
            { label: 'WHY', text: project.contextWhy },
            { label: 'WHAT', text: project.scopeWhat },
            { label: 'HOW', text: project.outcomeHow },
          ].map(({ label, text }, index) => (
            <FadeIn key={label} delay={0.1 * (index + 1)} className="space-y-2">
              <p className="text-sm tracking-[0.2em] uppercase text-[#777]">
                {label}
              </p>
              <p className="text-xs text-[#777] leading-relaxed whitespace-pre-wrap">
                {text || '—'}
              </p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: DESCRIPTION ── */}
      {project.fullDescription && (
        <section className="px-6 md:px-12 w-full py-6 pb-8">
          <FadeIn>
            <PageSectionHeader title="The Deep Dive" number="03" />
          </FadeIn>
          <FadeIn delay={0.2} className="w-full mt-6">
            <div className="text-xs text-[#555] leading-[1.8] font-light whitespace-pre-wrap max-w-none">
              {project.fullDescription}
            </div>
          </FadeIn>
        </section>
      )}

      {/* ── SECTION 4: GALLERY ── */}
      {galleryImages.length > 0 && (
        <section className="px-6 md:px-12 w-full py-6 pb-8">
          <FadeIn>
            <PageSectionHeader title="Gallery" number="04" />
          </FadeIn>
          <FadeIn delay={0.2} className="mt-6">
            <ProjectGallery images={galleryImages} title={project.title} />
          </FadeIn>
        </section>
      )}

      {/* ── SECTION 5: RESOURCES ── */}
      <section className="px-6 md:px-12 w-full py-6 pb-12">
        <FadeIn>
          <PageSectionHeader title="Resources" number={galleryImages.length > 0 ? "05" : "04"} />
        </FadeIn>
        <FadeIn delay={0.2} className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-6">
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
        </FadeIn>
      </section>

      {/* ── SECTION 6: NAVIGATION ── */}
      <section className="px-6 md:px-12 w-full pt-6">
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
