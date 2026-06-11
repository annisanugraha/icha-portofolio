import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { getProfile } from "@/actions/profile";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return (
    <>
      <AnimatedBackground />
      <Navbar logoText={profile?.logoText} logoImage={profile?.logoImage} />
      {/* Padding md:pl-16 untuk memberikan ruang bagi sidebar desktop */}
      <div className="md:pl-16 flex flex-col min-h-screen">
        <div className="flex-1 relative z-10">
          {children}
        </div>
        <Footer profile={profile} />
      </div>
    </>
  );
}