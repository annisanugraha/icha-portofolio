require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const pg = require('pg')
const bcrypt = require('bcryptjs')

const connString = process.env.DATABASE_URL?.includes('?') 
  ? `${process.env.DATABASE_URL}&pgbouncer=true` 
  : `${process.env.DATABASE_URL}?pgbouncer=true`;

const pool = new pg.Pool({ connectionString: connString })
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
