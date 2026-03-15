import { Hero } from "@/components/Hero";
import { FeaturedWork } from "@/components/FeaturedWork";
import { getProfile } from "@/actions/profile";

export default async function Home() {
  const profile = await getProfile();

  return (
    <main className="min-h-screen bg-white">
      {/* Kirim data profil ke Hero */}
      <Hero profile={profile} />
      
      <section>
        <FeaturedWork />
      </section>

      <footer className="border-t border-gray-50 py-16">
        <div className="main-container flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4 max-w-lg">
            <h2 className="text-6xl md:text-8xl font-serif text-black leading-none">Let&apos;s talk.</h2>
            <p className="text-base text-gray-400 font-light italic">Available for new opportunities.</p>
          </div>
          <div className="flex gap-8">
            <a href={profile?.linkedinUrl || "#"} target="_blank" className="text-[10px] font-black tracking-widest text-gray-300 hover:text-black transition-colors uppercase border-b border-transparent hover:border-black pb-1">
              LINKEDIN
            </a>
            <a href={profile?.githubUrl || "#"} target="_blank" className="text-[10px] font-black tracking-widest text-gray-300 hover:text-black transition-colors uppercase border-b border-transparent hover:border-black pb-1">
              GITHUB
            </a>
            <a href={`mailto:${profile?.emailAddress}`} className="text-[10px] font-black tracking-widest text-gray-300 hover:text-black transition-colors uppercase border-b border-transparent hover:border-black pb-1">
              EMAIL
            </a>
          </div>
        </div>
        <div className="main-container mt-12 pt-8 border-t border-gray-50 flex justify-between items-center text-[8px] font-bold tracking-[0.4em] text-gray-200 uppercase">
          <p>© 2026 {profile?.logoText || 'Annisa Nugraha'} STUDIO</p>
        </div>
      </footer>
    </main>
  );
}
