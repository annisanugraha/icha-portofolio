import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getProfile } from "@/actions/profile";
import { SidebarContentWrapper } from "@/components/SidebarContentWrapper";

import { SidebarProvider } from "@/contexts/SidebarContext";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return (
    <SidebarProvider>
      <Navbar logoText={profile?.logoText} logoImage={profile?.logoImage} />
      {/* Padding md:pl-16 untuk memberikan ruang bagi sidebar desktop */}
      <SidebarContentWrapper>
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">
            {children}
          </div>
          <Footer profile={profile} />
        </div>
      </SidebarContentWrapper>
    </SidebarProvider>
  );
}
