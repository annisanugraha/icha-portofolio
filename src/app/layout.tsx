import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GSA Portfolio | Digital Craftsman",
  description: "Minimalist portfolio focused on software engineering and user experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}>
        <Navbar />
        {/* 
          Sidebar lebar 64px (w-16).
          Konten diberi pl-16 di desktop agar rata dengan tepi sidebar,
          lalu main-container yang handle padding internal & max-width.
        */}
        <div className="md:pl-16">
          {children}
        </div>
      </body>
    </html>
  );
}
