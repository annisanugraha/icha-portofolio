'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addCertificate(title: string, category: string, description: string, imageUrl: string) {
  if (!title || !category || !description) {
    throw new Error('Semua field wajib diisi!')
  }

  try {
    const certificate = await prisma.certificate.create({
      data: {
        title,
        category,
        description,
        imageUrl: imageUrl || null,
      },
    })

    revalidatePath('/')
    revalidatePath('/archives')
    revalidatePath('/admin')
    
    return { success: true, data: certificate }
  } catch (error) {
    console.error('Gagal menambahkan sertifikat:', error)
    return { success: false, error: 'Gagal menyimpan ke database cloud.' }
  }
}

export async function updateCertificate(id: string, data: { title: string, category: string, description: string, imageUrl?: string }) {
  try {
    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        imageUrl: data.imageUrl || null,
      },
    })

    revalidatePath('/')
    revalidatePath('/archives')
    revalidatePath('/admin')
    
    return { success: true, data: certificate }
  } catch (error) {
    console.error('Gagal update sertifikat:', error)
    return { success: false, error: 'Gagal memperbarui database.' }
  }
}

export async function deleteCertificate(id: string) {
  try {
    await prisma.certificate.delete({
      where: { id },
    })

    revalidatePath('/')
    revalidatePath('/archives')
    revalidatePath('/admin')
    
    return { success: true }
  } catch (error) {
    console.error('Gagal hapus sertifikat:', error)
    return { success: false, error: 'Gagal menghapus dari database.' }
  }
}

export async function getCertificates() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return certificates
  } catch (error) {
    console.error('Gagal mengambil data sertifikat:', error)
    return []
  }
}
