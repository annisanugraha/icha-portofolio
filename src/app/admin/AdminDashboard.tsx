'use client';

import React, { useState } from 'react';
import { addProject, deleteProject } from '@/actions/projects';
import { addCertificate, deleteCertificate } from '@/actions/certificate';

export default function AdminDashboard({ initialProjects, initialCertificates }: any) {
  const [projects, setProjects] = useState(initialProjects);
  const [certificates, setCertificates] = useState(initialCertificates);
  const [tab, setTab] = useState('projects'); // projects | certificates

  // Form states
  const [loading, setLoading] = useState(false);

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Hapus proyek ini?')) return;
    const res = await deleteProject(id);
    if (res.success) {
      setProjects(projects.filter((p: any) => p.id !== id));
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm('Hapus sertifikat ini?')) return;
    const res = await deleteCertificate(id);
    if (res.success) {
      setCertificates(certificates.filter((c: any) => c.id !== id));
    }
  };

  return (
    <div className="main-container pt-36 pb-32">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl">Console.</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setTab('projects')}
            className={`label cursor-pointer transition-colors ${tab === 'projects' ? 'text-[#111] border-b border-[#111]' : 'text-[#999] hover:text-[#666]'}`}
          >
            Projects
          </button>
          <button 
            onClick={() => setTab('certificates')}
            className={`label cursor-pointer transition-colors ${tab === 'certificates' ? 'text-[#111] border-b border-[#111]' : 'text-[#999] hover:text-[#666]'}`}
          >
            Certificates
          </button>
        </div>
      </div>

      {tab === 'projects' ? (
        <section className="space-y-8">
          <div className="flex justify-between items-center">
            <span className="label">Manage Projects</span>
            {/* Nanti bisa ditambah form popup/modal */}
          </div>
          
          <div className="border border-[#ebebeb] rounded-sm overflow-hidden">
            <table className="w-full text-left text-[11px] font-mono">
              <thead className="bg-[#fafafa] border-b border-[#ebebeb]">
                <tr>
                  <th className="p-4 font-medium uppercase tracking-widest text-[#999]">Title</th>
                  <th className="p-4 font-medium uppercase tracking-widest text-[#999]">Year</th>
                  <th className="p-4 font-medium uppercase tracking-widest text-[#999] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p: any) => (
                  <tr key={p.id} className="border-b border-[#ebebeb] last:border-0">
                    <td className="p-4">{p.title}</td>
                    <td className="p-4">{p.year}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteProject(p.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="space-y-8">
          <div className="flex justify-between items-center">
            <span className="label">Manage Certificates</span>
          </div>

          <div className="border border-[#ebebeb] rounded-sm overflow-hidden">
            <table className="w-full text-left text-[11px] font-mono">
              <thead className="bg-[#fafafa] border-b border-[#ebebeb]">
                <tr>
                  <th className="p-4 font-medium uppercase tracking-widest text-[#999]">Title</th>
                  <th className="p-4 font-medium uppercase tracking-widest text-[#999]">Category</th>
                  <th className="p-4 font-medium uppercase tracking-widest text-[#999] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((c: any) => (
                  <tr key={c.id} className="border-b border-[#ebebeb] last:border-0">
                    <td className="p-4">{c.title}</td>
                    <td className="p-4">{c.category}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteCert(c.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
