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
    <main className="min-h-screen bg-white pt-16 md:pt-0">
      {/* ── SECTION 1: HERO SPLIT (vh100 Split Screen) ── */}
      <section className="flex flex-col md:flex-row items-center min-h-screen">
        {/* Left Column: Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8 md:py-16 md:pl-12 md:pr-6 lg:py-20 lg:pl-12 bg-white">
          <FadeIn delay={0.1} once={true} className="space-y-3 md:space-y-4">
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#bbb] block">
              {project.category} · {project.year}
            </span>

            <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-[#111] leading-[1.1] pb-4">
              {project.title}
            </p>
            <p className="text-xs text-[#888] leading-relaxed">
              {project.shortDescription}
            </p>

            {/* Tech Stack Badges */}
            {(() => {
              if (displaySkills.length === 0) return null;

              return (
                <div className="flex flex-wrap gap-2 pt-3">
                  {displaySkills.map((skill: any, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] font-sans font-medium tracking-wide px-3 py-1.5 bg-[#fafafa] text-[#555] rounded-md flex items-center gap-2"
                    >
                      {skill.logoUrl ? (
                        <div className="w-3.5 h-3.5 relative flex-shrink-0">
                          <Image src={skill.logoUrl} alt={skill.name} fill className="object-contain" />
                        </div>
                      ) : null}
                      <span>{skill.name}</span>
                    </span>
                  ))}
                </div>
              );
            })()}
          </FadeIn>
        </div>

        {/* Right Column: Hero Image (4:3 Aspect inside vh100) */}
        <div className="w-full md:w-1/2 px-6 py-8 md:py-16 md:pr-12 md:pl-6 lg:py-20 flex items-center justify-center">
          <FadeIn delay={0.3} once={true} className="w-full aspect-[4/3] overflow-hidden border border-[#f5f5f5] shadow-sm md:shadow-none relative">
            <Image
              src={project.imageUrl || 'https://placehold.co/800x600/fcfcfc/eee?text=—'}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 2: CASE STUDY (WHY / WHAT / HOW + SPECIFICATIONS BOX) ── */}
      <section className="px-6 md:px-12 w-full py-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12 md:gap-16 mt-12">
          {/* Left Column: WHY / WHAT / HOW */}
          <div className="space-y-8">
            <FadeIn>
              <PageSectionHeader title="Case Study" number={getSectionNum()} />
            </FadeIn>
            {[
              { label: 'WHY', text: project.contextWhy },
              { label: 'WHAT', text: project.scopeWhat },
              { label: 'HOW', text: project.outcomeHow },
            ].map(({ label, text }, index) => (
              <FadeIn key={label} delay={0.1 * (index + 1)} className="flex gap-6 border-t border-[#ebebeb] pt-6 first:border-t-0 first:pt-0">
                <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#111] font-bold w-16 shrink-0 pt-0.5">
                  {label}
                </span>
                <p className="text-xs text-[#777] leading-relaxed whitespace-pre-wrap flex-1">
                  {text || '—'}
                </p>
              </FadeIn>
            ))}
          </div>

          {/* Right Column: SPECIFICATIONS Box */}
          <FadeIn delay={0.3} once={true}>
            <div className="border border-[#111] bg-[#fafafa] p-6 md:sticky md:top-20">
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#111] font-bold mb-4 pb-3 border-b border-[#ebebeb]">
                Specifications
              </p>
              <dl className="space-y-3 text-xs font-mono">
                <div className="flex justify-between gap-4">
                  <dt className="uppercase tracking-wide text-[#999]">Year</dt>
                  <dd className="text-[#111] font-semibold text-right">{project.year || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="uppercase tracking-wide text-[#999]">Role</dt>
                  <dd className="text-[#111] font-semibold text-right">{project.role || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="uppercase tracking-wide text-[#999]">Category</dt>
                  <dd className="text-[#111] font-semibold text-right">{project.category || '—'}</dd>
                </div>
              </dl>

              {project.links && project.links.length > 0 && (
                <>
                  <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#111] font-bold mt-5 mb-3 pt-4 border-t border-[#ebebeb]">
                    Links
                  </p>
                  <div className="flex flex-col gap-2">
                    {project.links.map((link: any) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-mono uppercase tracking-wide text-[#111] hover:opacity-50 transition-opacity flex items-center justify-between border-b border-transparent hover:border-[#111] pb-0.5"
                      >
                        <span>{link.label}</span>
                        <span>↗</span>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 3: THE STORY (Rich Narrative Storytelling / Full Description) ── */}
      {(project.content || project.fullDescription) && (
        <section className="px-6 md:px-12 w-full py-6 pb-8">
          <FadeIn>
            <PageSectionHeader title="The Story" number={getSectionNum()} />
          </FadeIn>
          <FadeIn delay={0.2} className="w-full mt-6">
            {project.content ? (
              <div
                className="prose-icha max-w-none w-full"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            ) : (
              <div className="text-xs text-[#555] leading-[1.8] font-light whitespace-pre-wrap max-w-none">
                {project.fullDescription}
              </div>
            )}
          </FadeIn>
        </section>
      )}

      {/* ── SECTION 4: GALLERY ── */}
      {galleryImages.length > 0 && (
        <section className="px-6 md:px-12 w-full py-6 pb-8">
          <FadeIn>
            <PageSectionHeader title="Gallery" number={getSectionNum()} />
          </FadeIn>
          <FadeIn delay={0.2} className="mt-6">
            <ProjectGallery images={galleryImages} title={project.title} />
          </FadeIn>
        </section>
      )}

      {/* ── SECTION 6: NAVIGATION ── */}
      <section className="px-6 md:px-12 w-full pt-6 pb-16">
        <div className="flex justify-between items-center">
          {project.prevProject ? (
            <Link
              href={`/work/${project.prevProject.slug}`}
              className="bg-white text-[#555] border border-[#888] text-[9px] tracking-[0.4em] uppercase px-8 py-3 hover:bg-[#111] hover:text-white transition-all cursor-pointer inline-flex items-center gap-2 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>PREV PROJECT</span>
            </Link>
          ) : <div />}

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
