'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getAllSkills() {
  try {
    return await prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
  } catch (error) {
    console.error('DB fetch failed (getAllSkills):', error);
    return [];
  }
}

export async function getSkillsByCategory() {
  const skills = await getAllSkills();
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, any[]>);
}

export async function createSkill(data: {
  name: string;
  category: string;
  logoUrl?: string;
  order?: number;
}) {
  try {
    await prisma.skill.create({ data });
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/skills');
    return { success: true };
  } catch (error: any) {
    console.error('Create skill error:', error);
    if (error.code === 'P2002') return { success: false, error: 'Nama skill sudah terdaftar / harus unik!' };
    return { success: false, error: error.message || 'Failed to create skill' };
  }
}

export async function updateSkill(id: string, data: any) {
  try {
    await prisma.skill.update({ where: { id }, data });
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/skills');
    return { success: true };
  } catch (error: any) {
    console.error('Update skill error:', error);
    if (error.code === 'P2002') return { success: false, error: 'Nama skill sudah terdaftar / harus unik!' };
    return { success: false, error: error.message || 'Failed to update skill' };
  }
}

export async function deleteSkill(id: string) {
  try {
    await prisma.skill.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/skills');
    return { success: true };
  } catch (error: any) {
    console.error('Delete skill error:', error);
    return { success: false, error: error.message || 'Failed to delete skill' };
  }
}

export async function reorderSkills(orders: { id: string; order: number }[]) {
  try {
    const transactions = orders.map((item) =>
      prisma.skill.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    );
    await prisma.$transaction(transactions);
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/skills');
    return { success: true };
  } catch (error: any) {
    console.error('Reorder skills error:', error);
    return { success: false, error: error.message || 'Failed to reorder skills' };
  }
}
