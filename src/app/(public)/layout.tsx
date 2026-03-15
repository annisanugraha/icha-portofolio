import { Navbar } from "@/components/Navbar";
import { getProfile } from "@/actions/profile";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return (
    <>
      <Navbar logoText={profile?.logoText} logoImage={profile?.logoImage} />
      {/* Padding md:pl-16 untuk memberikan ruang bagi sidebar desktop */}
      <div className="md:pl-16">
        {children}
      </div>
    </>
  );
}
