import React from 'react';
import { getProjects } from '@/actions/project';
import { WorkList } from './WorkList';

// Ini adalah Server Component (mengambil data langsung dari database)
export const FeaturedWork = async () => {
  const projects = await getProjects();

  // Jika benar-benar kosong, skip section ini
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section>
      {/* Kirim data ke Client Component untuk dianimasikan */}
      <WorkList projects={projects} />
    </section>
  );
};
