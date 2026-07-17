'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Untuk homepage: hanya yang highlighted=true
export async function getHighlightedActivities() {
  try {
    return await prisma.activity.findMany({
      where: { highlighted: true },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('DB fetch failed (getHighlightedActivities):', error);
    return [];
  }
}

// Untuk halaman /archives: semua aktivitas
export async function getAllActivities() {
  try {
    return await prisma.activity.findMany({ orderBy: { order: 'asc' } });
  } catch (error) {
    console.error('DB fetch failed (getAllActivities):', error);
    return [];
  }
}

// CRUD untuk Admin (write operations — biarkan error naik ke UI supaya admin tahu simpan gagal)
export async function createActivity(data: {
  title: string;
  event: string;
  year: string;
  imageUrl?: string;
  description?: string;
  highlighted?: boolean;
  order?: number;
}) {
  try {
    await prisma.activity.create({ data });
    revalidatePath('/');
    revalidatePath('/archives');
    revalidatePath('/admin/activities');
    return { success: true };
  } catch (error: any) {
    console.error('Create activity error:', error);
    return { success: false, error: error.message || 'Failed to create activity' };
  }
}

export async function updateActivity(id: string, data: any) {
  try {
    await prisma.activity.update({ where: { id }, data });
    revalidatePath('/');
    revalidatePath('/archives');
    revalidatePath('/admin/activities');
    return { success: true };
  } catch (error: any) {
    console.error('Update activity error:', error);
    return { success: false, error: error.message || 'Failed to update activity' };
  }
}

export async function deleteActivity(id: string) {
  try {
    await prisma.activity.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/archives');
    revalidatePath('/admin/activities');
    return { success: true };
  } catch (error: any) {
    console.error('Delete activity error:', error);
    return { success: false, error: error.message || 'Failed to delete activity' };
  }
}

export async function reorderActivities(orders: { id: string; order: number }[]) {
  try {
    const transactions = orders.map((item) =>
      prisma.activity.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    );
    await prisma.$transaction(transactions);
    revalidatePath('/');
    revalidatePath('/archives');
    revalidatePath('/admin/activities');
    return { success: true };
  } catch (error: any) {
    console.error('Reorder activities error:', error);
    return { success: false, error: error.message || 'Failed to reorder activities' };
  }
}
