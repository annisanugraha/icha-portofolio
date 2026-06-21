'use server'

import { cache } from 'react'
import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

// React cache() deduplicates calls within the same request lifecycle.
// getProfile() is called ~3x per page load (metadata + layout + page).
export const getProfile = cache(async () => {
  try {
    let profile = await prisma.profile.findFirst({ where: { id: 'singleton' } });
    if (!profile) {
      profile = await prisma.profile.create({ data: { id: 'singleton' } });
    }
    return profile;
  } catch (error) {
    console.error('Fetch profile error:', error);
    return null;
  }
})

export async function updateProfile(data: any) {
  try {
    await prisma.profile.update({
      where: { id: 'singleton' },
      data: {
        logoText: data.logoText,
        logoImage: data.logoImage,
        favicon: data.favicon,
        siteTitle: data.siteTitle,
        siteDescription: data.siteDescription,
        heroRole: data.heroRole,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        aboutQuote: data.aboutQuote,
        aboutBio1: data.aboutBio1,
        aboutBio2: data.aboutBio2,
        aboutImage: data.aboutImage,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        emailAddress: data.emailAddress,
        emailSubject: data.emailSubject,
        resumeUrl: data.resumeUrl,
      }
    });
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/work', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Update profile error:', error);
    return { success: false, error: error.message || 'Update failed.' };
  }
}

export const getExperiences = cache(async () => {
  try {
    return await prisma.experience.findMany({ orderBy: { order: 'asc' } });
  } catch (error) {
    console.error('Fetch experiences error:', error);
    return [];
  }
})

export async function addExperience(data: any) {
  try {
    await prisma.experience.create({ 
      data: {
        year: data.year,
        title: data.title,
        company: data.company,
        description: data.description,
        imageUrl: data.imageUrl || null,
        order: data.order || 0
      } 
    });
    revalidatePath('/');
    revalidatePath('/about');
    return { success: true };
  } catch (error: any) {
    console.error('Add experience error:', error);
    return { success: false, error: error.message || 'Add failed.' };
  }
}

export async function updateExperience(id: string, data: any) {
  try {
    await prisma.experience.update({
      where: { id },
      data: {
        year: data.year,
        title: data.title,
        company: data.company,
        description: data.description,
        imageUrl: data.imageUrl || null,
      }
    });
    revalidatePath('/');
    revalidatePath('/about');
    return { success: true };
  } catch (error: any) {
    console.error('Update experience error:', error);
    return { success: false, error: error.message || 'Update failed.' };
  }
}

export async function reorderExperiences(orders: { id: string, order: number }[]) {
  try {
    const transactions = orders.map(item => 
      prisma.experience.update({
        where: { id: item.id },
        data: { order: item.order }
      })
    );
    await prisma.$transaction(transactions);
    revalidatePath('/');
    revalidatePath('/about');
    return { success: true };
  } catch (error: any) {
    console.error('Reorder experiences error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteExperience(id: string) {
  try {
    await prisma.experience.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/about');
    return { success: true };
  } catch (error: any) {
    console.error('Delete experience error:', error);
    return { success: false, error: error.message };
  }
}
