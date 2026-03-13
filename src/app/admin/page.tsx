import { getProjects } from '@/actions/project';
import { getCertificates } from '@/actions/certificate';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const projects = await getProjects();
  const certificates = await getCertificates();

  return (
    <main className="min-h-screen bg-white">
      <AdminDashboard 
        initialProjects={projects} 
        initialCertificates={certificates} 
      />
    </main>
  );
}
