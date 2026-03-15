import { getProjects } from '@/actions/projects';
import { getCertificates } from '@/actions/certificate';
import { getExperiences } from '@/actions/profile';
import Link from 'next/link';
import { Metadata } from 'next';

export default async function AdminPage() {
  const [projects, certificates, experiences] = await Promise.all([
    getProjects(),
    getCertificates(),
    getExperiences(),
  ]);

  const stats = [
    { label: 'Projects', count: projects.length, path: '/admin/projects', icon: '◧' },
    { label: 'Certificates', count: certificates.length, path: '/admin/archives', icon: '◫' },
    { label: 'Timeline', count: experiences.length, path: '/admin/timeline', icon: '◎' },
  ];

  return (
    <div className="p-10 space-y-14 bg-white">

      {/* Header */}
      <div className="border-b border-[#ebebeb] pb-8">
        <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase mb-2">Overview</p>
        <h1 className="text-2xl text-[#111] font-medium tracking-tight">Dashboard.</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link
            key={s.path}
            href={s.path}
            className="border border-[#ebebeb] p-6 hover:border-[#111] transition-colors group space-y-4 bg-[#fafafa]"
          >
            <span className="text-lg text-[#ccc] group-hover:text-[#111] transition-colors">{s.icon}</span>
            <div>
              <p className="text-2xl text-[#111] font-medium tabular-nums">{String(s.count).padStart(2, '0')}</p>
              <p className="text-[9px] tracking-[0.4em] text-[#999] uppercase mt-1">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[9px] tracking-[0.5em] text-[#999] uppercase">Recent Projects</p>
          <Link href="/admin/projects" className="text-[9px] tracking-widest text-[#999] hover:text-[#111] uppercase transition-colors">
            View All →
          </Link>
        </div>
        <div className="border border-[#ebebeb] divide-y divide-[#ebebeb]">
          {projects.slice(0, 5).map((p) => (
            <div key={p.id} className="flex items-center justify-between px-5 py-4 bg-white">
              <div className="flex items-center gap-6">
                <span className="text-[9px] text-[#ccc] w-10 tabular-nums">{p.year}</span>
                <span className="text-xs text-[#111]">{p.title}</span>
              </div>
              <div className="flex items-center gap-4">
                {p.featured && (
                  <span className="text-[7px] tracking-widest text-[#ccc] uppercase border border-[#ebebeb] px-2 py-0.5">Featured</span>
                )}
                <span className="text-[9px] text-[#ccc] tracking-wider uppercase">{p.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}