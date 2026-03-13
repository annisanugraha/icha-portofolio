'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addProject(data: {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  year: string;
}) {
  try {
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        imageUrl: data.imageUrl || null,
        githubUrl: data.githubUrl || null,
        demoUrl: data.demoUrl || null,
        year: data.year,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin')
    
    return { success: true, data: project }
  } catch (error) {
    console.error('Gagal menambahkan proyek:', error)
    return { success: false, error: 'Gagal menyimpan ke database cloud.' }
  }
}

export async function updateProject(id: string, data: any) {
  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        imageUrl: data.imageUrl || null,
        githubUrl: data.githubUrl || null,
        demoUrl: data.demoUrl || null,
        year: data.year,
      },
    })

    revalidatePath('/')
    revalidatePath(`/work/${data.slug}`)
    revalidatePath('/admin')
    
    return { success: true, data: project }
  } catch (error) {
    console.error('Gagal update proyek:', error)
    return { success: false, error: 'Gagal memperbarui database.' }
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({
      where: { id },
    })

    revalidatePath('/')
    revalidatePath('/admin')
    
    return { success: true }
  } catch (error) {
    console.error('Gagal hapus proyek:', error)
    return { success: false, error: 'Gagal menghapus dari database.' }
  }
}

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return projects
  } catch (error) {
    return []
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug }
    })
    return project
  } catch (error) {
    console.error('Gagal mengambil detail proyek:', error)
    return null
  }
}
