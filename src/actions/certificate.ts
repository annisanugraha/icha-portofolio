'use server'

import { cache } from 'react'
import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export const getCertificates = cache(async () => {
  try {
    return await prisma.certificate.findMany({
      orderBy: { order: 'asc' }
    });
  } catch (error) {
    console.error('Fetch certificates error:', error);
    return [];
  }
})

export async function getHighlightedCertificates() {
  try {
    return await prisma.certificate.findMany({
      where: { highlighted: true },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('DB fetch failed (getHighlightedCertificates):', error);
    return []; // fallback aman — section Recognition otomatis hilang, tidak crash
  }
}

export async function addCertificate(title: string, category: string, description: string, imageUrl: string, order: number = 0, highlighted: boolean = false) {
  try {
    await prisma.certificate.create({
      data: { title, category, description, imageUrl, order, highlighted }
    });
    revalidatePath('/');
    revalidatePath('/archives');
    return { success: true };
  } catch (error: any) {
    console.error('Add certificate error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateCertificate(id: string, data: any) {
  try {
    await prisma.certificate.update({
      where: { id },
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        imageUrl: data.imageUrl,
        order: data.order,
        ...(data.highlighted !== undefined && { highlighted: data.highlighted }),
      }
    });
    revalidatePath('/');
    revalidatePath('/archives');
    return { success: true };
  } catch (error: any) {
    console.error('Update certificate error:', error);
    return { success: false, error: error.message };
  }
}

export async function toggleCertificateHighlight(id: string, value: boolean) {
  try {
    const updated = await prisma.certificate.update({
      where: { id },
      data: { highlighted: value }
    });
    revalidatePath('/');
    revalidatePath('/archives');
    revalidatePath('/admin/certificates');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Toggle certificate highlight error:', error);
    return { success: false, error: error.message };
  }
}

export async function reorderCertificates(orders: { id: string, order: number }[]) {
  try {
    const transactions = orders.map(item => 
      prisma.certificate.update({
        where: { id: item.id },
        data: { order: item.order }
      })
    );
    await prisma.$transaction(transactions);
    revalidatePath('/');
    revalidatePath('/archives');
    return { success: true };
  } catch (error: any) {
    console.error('Reorder error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCertificate(id: string) {
  try {
    await prisma.certificate.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/archives');
    return { success: true };
  } catch (error: any) {
    console.error('Delete certificate error:', error);
    return { success: false, error: error.message };
  }
}
