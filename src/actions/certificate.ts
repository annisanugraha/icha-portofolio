'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getCertificates() {
  try {
    return await prisma.certificate.findMany({
      orderBy: { order: 'asc' }
    });
  } catch (error) {
    console.error('Fetch certificates error:', error);
    return [];
  }
}

export async function addCertificate(title: string, category: string, description: string, imageUrl: string, order: number = 0) {
  try {
    await prisma.certificate.create({
      data: { title, category, description, imageUrl, order }
    });
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
        order: data.order
      }
    });
    revalidatePath('/archives');
    return { success: true };
  } catch (error: any) {
    console.error('Update certificate error:', error);
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
    revalidatePath('/archives');
    return { success: true };
  } catch (error: any) {
    console.error('Delete certificate error:', error);
    return { success: false, error: error.message };
  }
}
