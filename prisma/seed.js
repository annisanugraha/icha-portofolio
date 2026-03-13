// Import dotenv untuk membaca file .env secara manual di mode CLI
require('dotenv').config()

const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const pg = require('pg')

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL tidak ditemukan di file .env')
  process.exit(1)
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('--- STARTING SEED (DOTENV MODE) ---')

  try {
    console.log('Cleaning up old data...')
    // Gunakan pengecekan (prisma as any) untuk menghindari error metadata lama
    if (prisma.project) await prisma.project.deleteMany()
    if (prisma.certificate) await prisma.certificate.deleteMany()

    console.log('Seeding Projects...')
    await prisma.project.createMany({
      data: [
        {
          title: 'Nexus E-Learning',
          slug: 'nexus-e-learning',
          category: 'Fullstack Web • Education',
          year: '2024',
          shortDescription: 'Sistem manajemen pembelajaran modern dengan fokus pada aksesibilitas.',
          fullDescription: 'Nexus E-Learning lahir dari keinginan untuk membuat distribusi materi kuliah di Bengkel Koding menjadi lebih terstruktur. Proyek ini menggunakan Next.js 15 untuk performa server-side rendering yang cepat.',
          imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200',
          githubUrl: 'https://github.com/',
        },
        {
          title: 'Hepta Inventory',
          slug: 'hepta-inventory',
          category: 'SaaS • Supply Chain',
          year: '2023',
          shortDescription: 'Solusi pengelolaan gudang pintar yang meminimalisir human error.',
          fullDescription: 'Hepta Inventory dikembangkan untuk membantu UMKM dalam mengelola stok barang mereka tanpa harus pusing dengan spreadsheet yang rumit.',
          imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200',
          githubUrl: 'https://github.com/',
        }
      ]
    })

    console.log('Seeding Certificates...')
    await prisma.certificate.createMany({
      data: [
        {
          title: 'HKI: Algoritma Nexus Sync',
          category: 'HKI',
          description: 'Sertifikat Hak Kekayaan Intelektual atas inovasi algoritma sinkronisasi data real-time pada platform edukasi.',
          imageUrl: 'https://images.unsplash.com/photo-1621243804936-775306a8f2e3?q=80&w=800'
        },
        {
          title: 'Finalis Gemastik XVI - Software Dev',
          category: 'Competition',
          description: 'Penghargaan nasional sebagai finalis dalam kategori pengembangan aplikasi perangkat lunak terbaik.',
          imageUrl: 'https://images.unsplash.com/photo-1523240715632-d984bc4b7969?q=80&w=800'
        },
        {
          title: 'Google UX Design Certificate',
          category: 'Course',
          description: 'Sertifikasi profesional dari Google yang mencakup seluruh spektrum desain pengalaman pengguna.',
          imageUrl: 'https://images.unsplash.com/photo-1544391496-1ca7c97493c3?q=80&w=800'
        }
      ]
    })

    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---')
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
