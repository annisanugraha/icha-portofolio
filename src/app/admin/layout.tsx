import React from 'react';
import { getProfile } from '@/actions/profile';
import AdminSidebar from './AdminSidebar';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const baseTitle = profile?.siteTitle || "Icha's Portfolio";
  return {
    title: `${baseTitle} | Admin`,
  };
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex font-mono text-[#111]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
