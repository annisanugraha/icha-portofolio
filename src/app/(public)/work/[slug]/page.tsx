import React from 'react';
import { getProjectBySlug } from '@/actions/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectGallery } from '@/components/ProjectGallery';
import { PageSectionHeader } from '@/components/PageSectionHeader';
import { FadeIn } from '@/components/animations/FadeIn';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug) as any;

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: `${project.title} — Icha's Portfolio`,
    description: project.shortDescription || `A project by Annisa Angelica Nugraha.`,
    openGraph: {
      title: project.title,
      description: project.shortDescription || '',
      images: project.imageUrl ? [{ url: project.imageUrl, width: 1200, height: 630, alt: project.title }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.shortDescription || '',
      images: project.imageUrl ? [project.imageUrl] : [],
    },
  };
}

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

  const displaySkills = project.skills && project.skills.length > 0
    ? project.skills
    : (project.techStack || []).map((name: string) => ({ id: name, name, logoUrl: null }));

  let currentSectionNum = 2;
  const getSectionNum = () => String(currentSectionNum++).padStart(2, '0');

  return (
    <main className="min-h-screen bg-white">
      {/* ── Sticky breadcrumb bar ── */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#f0f0f0] h-14 flex items-center">
        <div className="flex items-center justify-between w-full px-6 md:px-0 md:pl-8">
          <Link
            href="/work"
            className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#aaa] hover:text-[#111] transition-colors flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform inline-block">←</span>
            Works
          </Link>
          <span className="text-[10px] font-mono text-[#ccc] tracking-widest uppercase pr-6 md:pr-10">
            {project.category} · {project.year}
          </span>
        </div>
      </div>

      {/* ── 2-col layout ── */}
      <div className="flex flex-col md:flex-row min-h-screen">

        {/* LEFT: Sticky Sidebar */}
        <aside className="w-full md:w-60 lg:w-72 shrink-0
                          px-6 md:px-8 pt-8 pb-6 md:py-12
                          border-b md:border-b-0 md:border-r border-[#f5f5f5]
                          bg-[#fafafa]
                          md:sticky md:top-14 md:max-h-[calc(100vh-56px)] md:overflow-y-auto">
          <div className="space-y-8">
            {/* Title & short desc */}
            <div className="space-y-3">
              <h1 className="font-serif text-xl md:text-2xl text-[#111] leading-tight">
                {project.title}
              </h1>
              <p className="text-[11px] text-[#888] leading-relaxed">
                {project.shortDescription}
              </p>
              {project.role && (
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase px-2.5 py-0.5 bg-white border border-[#e5e5e5] text-[#aaa] rounded-full inline-block">
                  {project.role}
                </span>
              )}
            </div>

            {/* Links — always visible */}
            {project.links && project.links.length > 0 && (
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-[#ccc] tracking-[0.35em] uppercase">Links</span>
                <div className="flex flex-col gap-2 mt-1">
                  {project.links.map((link: any) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-mono text-[#555] hover:text-[#111] transition-colors flex items-center gap-2 group/link"
                    >
                      <span className="text-[#ddd] group-hover/link:text-[#111] transition-colors">↗</span>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {displaySkills.length > 0 && (
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-[#ccc] tracking-[0.35em] uppercase">Stack</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {displaySkills.map((skill: any, i: number) => (
                    <span
                      key={i}
                      className="text-[9px] font-mono px-2 py-0.5 bg-white border border-[#ebebeb] text-[#888] rounded-sm flex items-center gap-1.5"
                    >
                      {skill.logoUrl && (
                        <img src={skill.logoUrl} alt={skill.name} className="w-3 h-3 object-contain flex-shrink-0" />
                      )}
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Prev/Next — sidebar bottom on desktop */}
            <div className="hidden md:flex flex-col gap-2 pt-4 border-t border-[#ebebeb]">
              {project.prevProject && (
                <Link
                  href={`/work/${project.prevProject.slug}`}
                  className="text-[9px] font-mono text-[#aaa] hover:text-[#111] transition-colors flex items-center gap-1.5 group/nav"
                >
                  <span className="group-hover/nav:-translate-x-0.5 transition-transform inline-block">←</span>
                  <span className="truncate">{project.prevProject.title}</span>
                </Link>
              )}
              {project.nextProject && (
                <Link
                  href={`/work/${project.nextProject.slug}`}
                  className="text-[9px] font-mono text-[#aaa] hover:text-[#111] transition-colors flex items-center justify-between gap-1.5 group/nav"
                >
                  <span className="truncate">{project.nextProject.title}</span>
                  <span className="group-hover/nav:translate-x-0.5 transition-transform inline-block shrink-0">→</span>
                </Link>
              )}
            </div>
          </div>
        </aside>

        {/* RIGHT: Scrollable content */}
        <div className="flex-1 px-6 md:px-10 lg:px-14 py-8 md:py-12 space-y-14 min-w-0">

          {/* Hero Image */}
          <FadeIn once={true} className="w-full aspect-[16/10] overflow-hidden border border-[#f5f5f5] relative">
            <Image
              src={project.imageUrl || 'https://placehold.co/800x500/fcfcfc/eee?text=—'}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, calc(100vw - 288px)"
              className="object-cover"
              priority
            />
          </FadeIn>

          {/* WHY / WHAT / HOW */}
          <section>
            <FadeIn once={true}>
              <PageSectionHeader title="Case Study" number={getSectionNum()} />
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-6">
              {[
                { label: 'WHY', text: project.contextWhy },
                { label: 'WHAT', text: project.scopeWhat },
                { label: 'HOW', text: project.outcomeHow },
              ].map(({ label, text }, index) => (
                <FadeIn key={label} delay={0.1 * (index + 1)} once={true} className="space-y-2">
                  <p className="text-sm tracking-[0.2em] uppercase text-[#777]">{label}</p>
                  <p className="text-xs text-[#777] leading-relaxed whitespace-pre-wrap">{text || '—'}</p>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* The Story */}
          {(project.content || project.fullDescription) && (
            <section>
              <FadeIn once={true}>
                <PageSectionHeader title="The Story" number={getSectionNum()} />
              </FadeIn>
              <FadeIn delay={0.2} once={true} className="w-full mt-6">
                {project.content ? (
                  <div className="prose-icha" dangerouslySetInnerHTML={{ __html: project.content }} />
                ) : (
                  <div className="text-xs text-[#555] leading-[1.8] font-light whitespace-pre-wrap max-w-none">
                    {project.fullDescription}
                  </div>
                )}
              </FadeIn>
            </section>
          )}

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <section>
              <FadeIn once={true}>
                <PageSectionHeader title="Gallery" number={getSectionNum()} />
              </FadeIn>
              <FadeIn delay={0.2} once={true} className="mt-6">
                <ProjectGallery images={galleryImages} title={project.title} />
              </FadeIn>
            </section>
          )}

          {/* Prev/Next — mobile only */}
          <section className="md:hidden pt-6 border-t border-[#ebebeb]">
            <div className="flex justify-between items-center">
              {project.prevProject ? (
                <Link
                  href={`/work/${project.prevProject.slug}`}
                  className="text-[9px] font-mono tracking-[0.3em] uppercase text-[#555] border border-[#ddd] px-5 py-2.5 hover:bg-[#111] hover:text-white hover:border-[#111] transition-all flex items-center gap-2 group"
                >
                  <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                  Prev
                </Link>
              ) : <div />}
              {project.nextProject ? (
                <Link
                  href={`/work/${project.nextProject.slug}`}
                  className="text-[9px] font-mono tracking-[0.3em] uppercase text-[#555] border border-[#ddd] px-5 py-2.5 hover:bg-[#111] hover:text-white hover:border-[#111] transition-all flex items-center gap-2 group"
                >
                  Next
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
              ) : <div />}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

