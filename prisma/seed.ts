import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Memulai Seeding ---')

  // 1. Bersihkan data (Opsional, tapi bagus untuk reset)
  // await prisma.user.deleteMany()
  // await prisma.profile.deleteMany()

  // 2. Create Admin User
  const hashedPassword = await bcrypt.hash('IchaPortofolioForTheFuture', 10)
  await prisma.user.upsert({
    where: { email: 'annisaangelican@gmail.com' },
    update: { password: hashedPassword },
    create: {
      email: 'annisaangelican@gmail.com',
      password: hashedPassword
    }
  })
  console.log('✔ Admin User Created.')

  // 3. Create/Update Profile
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
  console.log('✔ Profile Updated to: Annisa Nugraha')

  console.log('--- Seeding Selesai ---')
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
