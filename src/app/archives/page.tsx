// ── archives/page.tsx ────────────────────────────────
import React from 'react';
import { CertificateGrid } from '@/components/CertificateGrid';
import { getCertificates } from '@/actions/certificate';

export default async function ArchivesPage() {
  const certificates = await getCertificates();

  return (
    <main className="min-h-screen bg-white">
      <div className="main-container pt-24 pb-32 space-y-16">

        <div className="space-y-3">
          <span className="label">Validation</span>
          <h1>Archives.</h1>
          <p className="text-xs text-[#999] max-w-xs leading-relaxed">
            Certifications, honors, and formal recognitions.
          </p>
        </div>

        <section className="border-t border-[#ebebeb] pt-16">
          <CertificateGrid certificates={certificates} />
        </section>

      </div>
    </main>
  );
}
