import { getProfile } from "@/actions/profile";
import { PublicLayoutClient } from "@/components/PublicLayoutClient";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return <PublicLayoutClient profile={profile}>{children}</PublicLayoutClient>;
}