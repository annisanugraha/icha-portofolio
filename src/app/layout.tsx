import type { Metadata } from "next";
import { DM_Serif_Display, DM_Mono, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getProfile } from "@/actions/profile";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: profile?.siteTitle || "Icha's Portfolio",
    description: profile?.siteDescription || "Minimalist portfolio focused on software engineering and user experience.",
    icons: {
      icon: profile?.favicon || profile?.logoImage || "/favicon.ico",
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSerif.variable} ${dmMono.variable} ${playfair.variable} ${jetbrainsMono.variable} antialiased bg-white`}>
        {children}
      </body>
    </html>
  );
}
