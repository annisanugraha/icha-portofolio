import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Memulai Seeding ---')

  // Bersihkan data lama
  await prisma.project.deleteMany()
  await prisma.certificate.deleteMany()

  // Seeding Projects
  await prisma.project.createMany({
    data: [
      {
        title: 'Nexus E-Learning',
        slug: 'nexus-elearning',
        category: 'Fullstack Web • Education',
        year: '2024',
        shortDescription: 'Sistem manajemen pembelajaran modern dengan fokus pada aksesibilitas dan kemudahan navigasi.',
        fullDescription: `Nexus E-Learning lahir dari keinginan untuk membuat distribusi materi kuliah di Bengkel Koding menjadi lebih terstruktur. \n\nProyek ini menggunakan Next.js 15 untuk performa server-side rendering yang cepat, Prisma sebagai ORM untuk manajemen database yang aman, dan Supabase sebagai backbone cloud database.\n\nTantangan terbesar adalah membangun sistem role-based access control yang fleksibel namun tetap aman. Hasilnya, aplikasi ini mampu menangani ribuan request per detik dengan latensi yang sangat rendah.`,
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
        githubUrl: 'https://github.com/username/nexus-elearning',
        demoUrl: 'https://nexus.example.com'
      },
      {
        title: 'Hepta Inventory',
        slug: 'hepta-inventory',
        category: 'SaaS • Supply Chain',
        year: '2023',
        shortDescription: 'Solusi pengelolaan gudang pintar yang meminimalisir human error dalam pencatatan stok.',
        fullDescription: `Hepta Inventory dikembangkan untuk membantu UMKM dalam mengelola stok barang mereka tanpa harus pusing dengan spreadsheet yang rumit.\n\nFokus utama desainnya adalah 'Data-Informed UX', di mana setiap elemen dashboard dirancang berdasarkan masukan dari pemilik gudang nyata. Saya menggunakan React untuk frontend dan PostgreSQL untuk memastikan integritas data tetap terjaga.`,
        imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
        githubUrl: 'https://github.com/username/hepta-inventory',
        demoUrl: 'https://hepta.example.com'
      }
    ]
  })

  // Seeding Certificates
  await prisma.certificate.createMany({
    data: [
      {
        title: 'HKI: Algoritma Nexus Sync',
        category: 'HKI',
        description: 'Sertifikat Hak Kekayaan Intelektual atas inovasi algoritma sinkronisasi data real-time pada platform edukasi.',
        imageUrl: 'https://images.unsplash.com/photo-1621243804936-775306a8f2e3?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'Finalis Gemastik XVI - Software Dev',
        category: 'Competition',
        description: 'Penghargaan nasional sebagai finalis dalam kategori pengembangan aplikasi perangkat lunak terbaik.',
        imageUrl: 'https://images.unsplash.com/photo-1523240715632-d984bc4b7969?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'Google UX Design Certificate',
        category: 'Course',
        description: 'Sertifikasi profesional dari Google yang mencakup seluruh spektrum desain pengalaman pengguna.',
        imageUrl: 'https://images.unsplash.com/photo-1544391496-1ca7c97493c3?q=80&w=800&auto=format&fit=crop'
      }
    ]
  })

  console.log('--- Seeding Selesai: Database Cloud Kini Penuh Data ---')
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
