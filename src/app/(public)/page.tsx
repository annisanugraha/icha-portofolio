import { SinglePage } from "@/components/SinglePage";
import { getProfile, getExperiences } from "@/actions/profile";
import { getFeaturedProjects } from "@/actions/projects";
import { getCertificates } from "@/actions/certificate";

export const revalidate = 30;

export default async function Home() {
  const [profile, projects, certificates, experiences] = await Promise.all([
    getProfile(),
    getFeaturedProjects(),
    getCertificates(),
    getExperiences(),
  ]);

  return (
    <SinglePage
      profile={profile}
      projects={projects}
      certificates={certificates}
      experiences={experiences}
    />
  );
}
