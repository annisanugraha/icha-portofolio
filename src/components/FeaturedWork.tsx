import React from 'react';
import { getFeaturedProjects } from '@/actions/projects';
import { WorkList } from './WorkList';

// Ini adalah Server Component (mengambil data langsung dari database)
export const FeaturedWork = async () => {
  // Hanya ambil project yang diset 'featured: true' di CMS
  const projects = await getFeaturedProjects();

  // Jika benar-benar kosong, skip section ini
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[#ebebeb] pt-24">
      <WorkList projects={projects} />
    </section>
  );
};
