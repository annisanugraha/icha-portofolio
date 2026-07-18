export const revalidate = 3600;

import { getAllProjects } from '@/actions/projects';
import { ProjectsPage } from '@/components/ProjectsPage';

export default async function WorkPage() {
  const projects = await getAllProjects();
  return <ProjectsPage projects={projects} />;
}
