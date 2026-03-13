## My Digital Portfolio

A minimalist, high-performance portfolio built with **Next.js 15**, **Tailwind CSS v4**, and **Prisma**. Designed for software engineers who value clean aesthetics and robust content management.

## 🚀 Features

- **Minimalist Aesthetic**: Focused on typography (DM Serif Display & DM Mono) and intentional spacing.
- **Multi-Zone Architecture**: Single codebase deployed to two environments (Public & Admin) for maximum security.
- **Custom CMS**: Built-in dashboard to manage projects and certificates without exposing the admin panel to the public.
- **Responsive Hero**: Full viewport experience with smooth Framer Motion animations.
- **Cloud Database**: Integrated with Prisma for stable data management on PostgreSQL (Supabase/Neon).

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel

## 🔒 Security & Deployment

Proyek ini menggunakan mode `NEXT_PUBLIC_APP_MODE` untuk memisahkan akses:

1. **Public Mode**: 
   - URL: `your-portfolio.com`
   - Fitur: Hanya menampilkan konten publik. Akses `/admin` diblokir otomatis (404).
2. **Admin Mode**: 
   - URL: `admin.your-portfolio.com`
   - Fitur: Mengaktifkan dashboard CMS untuk manajemen konten.

## 📦 Getting Started

1. Clone repository ini.
2. Install dependensi:
   ```bash
   npm install
   ```
3. Setup `.env` file:
   ```env
   DATABASE_URL="your-postgresql-url"
   NEXT_PUBLIC_APP_MODE="ADMIN" # atau "PUBLIC"
   ```
4. Jalankan database migration:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Jalankan server:
   ```bash
   npm run dev
   ```

---
*Crafted with intention by Icha.*
