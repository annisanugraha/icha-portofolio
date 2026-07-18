import { SinglePage } from "@/components/SinglePage";
import { getProfile, getExperiences } from "@/actions/profile";
import { getFeaturedProjects } from "@/actions/projects";
import { getCertificates } from "@/actions/certificate";
import { getHighlightedActivities } from "@/actions/activity";

export const revalidate = 3600; // 1 hour — CRUD updates are instant via revalidatePath()

export default async function Home() {
  const [profile, projects, allCertificates, highlightedActivities, experiences] = await Promise.all([
    getProfile(),
    getFeaturedProjects(),
    getCertificates(),
    getHighlightedActivities(),
    getExperiences(),
  ]);

  return (
    <SinglePage
      profile={profile}
      projects={projects}
      certificates={allCertificates}
      activities={highlightedActivities}
      experiences={experiences}
    />
  );
}
