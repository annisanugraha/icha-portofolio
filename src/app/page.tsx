import { Hero } from "@/components/Hero";
import { FeaturedWork } from "@/components/FeaturedWork";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <section className="pb-20">
        <FeaturedWork />
      </section>
      <footer className="border-t border-gray-50">
        <div className="main-container flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4">
            <h4 className="text-3xl font-black text-black uppercase tracking-tighter">LET'S TALK.</h4>
            <p className="text-base text-gray-400 font-light italic">Available for new opportunities.</p>
          </div>
          <div className="flex gap-8">
            {['LINKEDIN', 'GITHUB', 'EMAIL'].map((link) => (
              <a key={link} href="#" className="text-[10px] font-black tracking-widest text-gray-300 hover:text-black transition-colors uppercase border-b border-transparent hover:border-black pb-1">
                {link}
              </a>
            ))}
          </div>
        </div>
        <div className="main-container mt-12 pt-8 border-t border-gray-50 flex justify-between items-center text-[8px] font-bold tracking-[0.4em] text-gray-200 uppercase">
          <p>© 2026 GSA STUDIO</p>
        </div>
      </footer>
    </main>
  );
}