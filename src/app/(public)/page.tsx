import { Hero } from "@/components/Hero";
import { FeaturedWork } from "@/components/FeaturedWork";
import { getProfile } from "@/actions/profile";

export default async function Home() {
  const profile = await getProfile();

  return (
    <main className="min-h-screen bg-white">
      <div className="main-container">
        {/* Hero Section */}
        <Hero profile={profile} />
        
        {/* Featured Projects Section */}
        <FeaturedWork />

        {/* Let's Talk Section */}
        <section className="border-t border-[#ebebeb] pt-24 pb-12">
          <div className="space-y-4 max-w-lg">
            <h2 className="text-6xl md:text-8xl font-serif text-black leading-none">Let&apos;s talk.</h2>
            <p className="text-base text-gray-400 font-light italic">Available for new opportunities.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
