// src/actions/projects.ts - New name to force Turbopack reload
'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addProject(data: any) {
  try {
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        contextWhy: data.contextWhy || null,
        scopeWhat: data.scopeWhat || null,
        outcomeHow: data.outcomeHow || null,
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
        }
      },
      include: { links: true }
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
    console.log('UPDATING PROJECT:', id);
    // console.log('DATA:', JSON.stringify(data, null, 2));

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        contextWhy: data.contextWhy || null,
        scopeWhat: data.scopeWhat || null,
        outcomeHow: data.outcomeHow || null,
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
        }
      },
      include: { links: true }
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

export async function getProjects() {
  try {
    const allProjects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
      include: { links: true }
    });
    return allProjects;
  } catch (error: any) {
    console.error('Fetch projects error:', error);
    return [];
  }
}

export async function getFeaturedProjects() {
  try {
    const featured = await prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
      include: { links: true }
    });
    return featured;
  } catch (error: any) {
    console.error('Fetch featured error:', error);
    return [];
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const p = await prisma.project.findUnique({ 
      where: { slug },
      include: { links: true }
    });
    
    if (!p) return null;

    // Get next project for navigation
    const nextProject = await prisma.project.findFirst({
      where: {
        order: { gt: p.order }
      },
      orderBy: { order: 'asc' },
      select: { title: true, slug: true }
    }) || await prisma.project.findFirst({
      orderBy: { order: 'asc' },
      select: { title: true, slug: true }
    });

    // Get previous project for navigation
    const prevProject = await prisma.project.findFirst({
      where: {
        order: { lt: p.order }
      },
      orderBy: { order: 'desc' },
      select: { title: true, slug: true }
    }) || await prisma.project.findFirst({
      orderBy: { order: 'desc' },
      select: { title: true, slug: true }
    });

    return { ...p, nextProject, prevProject };
  } catch (error: any) {
    console.error('Fetch slug error:', error);
    return null;
  }
}
