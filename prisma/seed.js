require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const pg = require('pg')
const bcrypt = require('bcryptjs')

// 1. Ambil URL dari .env
const connString = process.env.DATABASE_URL;

// 2. Bersihkan URL (Perbaikan nomor 2 & 3)
let finalUrl = connString;
if (finalUrl) {
  // Hapus typo ':ase.com' jika ada
  finalUrl = finalUrl.replace(':ase.com:5432', ':5432');
  
  // Tambahkan sslmode=require dan uselibpqcompat=true jika belum ada
  if (!finalUrl.includes('sslmode=')) {
    finalUrl += finalUrl.includes('?') ? '&sslmode=require' : '?sslmode=require';
  }
  if (!finalUrl.includes('uselibpqcompat=')) {
    finalUrl += finalUrl.includes('?') ? '&uselibpqcompat=true' : '?uselibpqcompat=true';
  }
}

const pool = new pg.Pool({ connectionString: finalUrl })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('--- STARTING SEED (ADMIN & PROFILE) ---')

  try {
    // 1. Create Admin User
    const hashedPassword = await bcrypt.hash('IchaPortofolioForTheFuture', 10)
    await prisma.user.upsert({
      where: { email: 'annisaangelican@gmail.com' },
      update: { password: hashedPassword },
      create: {
        email: 'annisaangelican@gmail.com',
        password: hashedPassword
      }
    })
    console.log('✔ Admin User Ready.')

    // 2. Update Profile to Annisa Nugraha
    await prisma.profile.upsert({
      where: { id: 'singleton' },
      update: { 
        logoText: 'Annisa Nugraha',
        siteTitle: "Icha's Portfolio",
        siteDescription: "Minimalist portfolio focused on software engineering and user experience."
      },
      create: {
        id: 'singleton',
        logoText: 'Annisa Nugraha',
        siteTitle: "Icha's Portfolio",
        siteDescription: "Minimalist portfolio focused on software engineering and user experience.",
        heroRole: 'Fullstack Engineer',
        heroTitle: 'Annisa Nugraha',
        heroSubtitle: 'Engineering clarity through intentional code.'
      }
    })
    console.log('✔ Profile Updated: Annisa Nugraha')

    console.log('--- SEEDING COMPLETED ---')
  } catch (err) {
    console.error('SEED ERROR:', err)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
