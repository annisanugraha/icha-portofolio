// src/actions/projects.ts - New name to force Turbopack reload
'use server'

import { cache } from 'react'
import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addProject(data: any) {
  try {
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        role: data.role || null,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        contextWhy: data.contextWhy || null,
        scopeWhat: data.scopeWhat || null,
        outcomeHow: data.outcomeHow || null,
        content: data.content || null,
        imageUrl: data.imageUrl || null,
        galleryImages: data.galleryImages || [],
        techStack: data.techStack || [],
        githubUrl: data.githubUrl || null,
        demoUrl: data.demoUrl || null,
        year: data.year,
        featured: data.featured || false,
        order: data.order || 0,
        links: {
          create: data.links || []
        },
        skills: data.skillIds ? {
          connect: data.skillIds.map((id: string) => ({ id }))
        } : undefined,
      },
      include: { links: true, skills: true }
    })
    revalidatePath('/')
    revalidatePath('/admin', 'layout')
    return { success: true, data: project }
  } catch (error: any) {
    console.error('Add project error:', error)
    if (error.code === 'P2002') return { success: false, error: 'Slug already exists.' }
    return { success: false, error: 'DB Error: ' + (error.message || 'Unknown') }
  }
}

export async function updateProject(id: string, data: any) {
  try {
    // console.log('DATA:', JSON.stringify(data, null, 2));

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        role: data.role || null,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        contextWhy: data.contextWhy || null,
        scopeWhat: data.scopeWhat || null,
        outcomeHow: data.outcomeHow || null,
        content: data.content || null,
        imageUrl: data.imageUrl || null,
        galleryImages: data.galleryImages || [],
        techStack: data.techStack || [],
        githubUrl: data.githubUrl || null,
        demoUrl: data.demoUrl || null,
        year: data.year,
        featured: data.featured ?? false,
        order: data.order ?? 0,
        links: {
          deleteMany: {},
          create: data.links || []
        },
        skills: {
          set: data.skillIds?.map((id: string) => ({ id })) || []
        }
      },
      include: { links: true, skills: true }
    })
    revalidatePath('/')
    revalidatePath(`/work/${data.slug}`)
    revalidatePath('/admin', 'layout')
    return { success: true, data: project }
  } catch (error: any) {
    console.error('Update project error:', error)
    if (error.code === 'P2002') return { success: false, error: 'Slug already exists.' }
    
    // Return the full message if it's a validation error
    let msg = error.message || 'Unknown';
    if (msg.includes('Invalid prisma.project.update() invocation')) {
      // Try to extract the useful part of the Prisma error
      const parts = msg.split('\n');
      if (parts.length > 1) {
        msg = parts.slice(1).join('\n').trim();
      }
    }

    return { success: false, error: 'DB Error:\n' + msg }
  }
}

export async function reorderProjects(orders: { id: string, order: number }[]) {
  try {
    const transactions = orders.map(item => 
      prisma.project.update({
        where: { id: item.id },
        data: { order: item.order }
      })
    );
    await prisma.$transaction(transactions);
    revalidatePath('/');
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error: any) {
    console.error('Reorder error:', error);
    return { success: false, error: error.message };
  }
}

export async function toggleProjectFeatured(id: string) {
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return { success: false, error: 'Project not found' };

    const updated = await prisma.project.update({
      where: { id },
      data: { featured: !project.featured }
    });

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/projects');
    
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Toggle featured error:', error);
    return { success: false, error: 'Failed to toggle featured status' };
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath('/')
    revalidatePath('/admin', 'layout')
    return { success: true }
  } catch (error: any) {
    console.error('Delete project error:', error)
    return { success: false, error: 'Delete failed.' }
  }
}

export async function getAllProjects() {
  try {
    return await prisma.project.findMany({
      include: { links: true, skills: true },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('DB fetch failed (getAllProjects):', error);
    return [];
  }
}

export const getProjects = cache(async () => {
  try {
    const allProjects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
      include: { links: true, skills: true }
    });
    return allProjects;
  } catch (error: any) {
    console.error('Fetch projects error:', error);
    return [];
  }
})

export const getFeaturedProjects = cache(async () => {
  try {
    const featured = await prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
      include: { links: true, skills: true }
    });
    return featured;
  } catch (error: any) {
    console.error('Fetch featured error:', error);
    return [];
  }
})

// Optimized: 2 parallel queries instead of 3-5 sequential ones.
// Prev/next navigation is computed in JS from a lightweight slug list.
export const getProjectBySlug = cache(async (slug: string) => {
  try {
    // Run both queries in parallel
    const [project, allSlugs] = await Promise.all([
      prisma.project.findUnique({ 
        where: { slug },
        include: { links: true, skills: true }
      }),
      prisma.project.findMany({
        orderBy: { order: 'asc' },
        select: { title: true, slug: true, order: true }
      })
    ]);
    
    if (!project) return null;

    // Compute prev/next from the sorted list
    const currentIndex = allSlugs.findIndex(p => p.slug === slug);
    const nextProject = allSlugs[currentIndex + 1] || allSlugs[0]; // wrap around
    const prevProject = allSlugs[currentIndex - 1] || allSlugs[allSlugs.length - 1]; // wrap around

    return { 
      ...project, 
      nextProject: nextProject ? { title: nextProject.title, slug: nextProject.slug } : null, 
      prevProject: prevProject ? { title: prevProject.title, slug: prevProject.slug } : null 
    };
  } catch (error: any) {
    console.error('Fetch slug error:', error);
    return null;
  }
})
