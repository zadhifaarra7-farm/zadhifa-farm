'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addGoat(formData: FormData) {
    const breed = formData.get('breed') as string;
    const gender = formData.get('gender') as string;
    const weight = parseFloat(formData.get('weight') as string) || 30;
    const price = parseFloat(formData.get('price') as string) || 3000000;
    const birthDate = formData.get('birthDate') as string;
    const notes = formData.get('notes') as string;

    try {
        const count = await prisma.goat.count();
        const code = `ZF-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

        await prisma.goat.create({
            data: {
                registrationCode: code,
                name: `${breed} ${gender === 'MALE' ? 'Jantan' : 'Betina'}`,
                breed,
                gender,
                birthDate: birthDate ? new Date(birthDate) : new Date(),
                currentWeight: weight,
                basePrice: price,
                dynamicPrice: price,
                healthStatus: 'HEALTHY',
                isAvailable: true,
                purposes: 'QURBAN,BREEDING',
                qualityGrade: 'STANDARD',
                notes: notes || undefined,
                tags: JSON.stringify(['Premium']),
                mediaUrls: JSON.stringify([]),
            }
        });

        revalidatePath('/dashboard/inventory');
        return { success: true };
    } catch (error) {
        console.error('Error adding goat:', error);
        return { success: false, error: 'Gagal menambah data domba' };
    }
}

export async function updateGoat(id: string, formData: FormData) {
    const breed = formData.get('breed') as string;
    const gender = formData.get('gender') as string;
    const weight = parseFloat(formData.get('weight') as string);
    const price = parseFloat(formData.get('price') as string);
    const isAvailable = formData.get('isAvailable') === 'true';
    const notes = formData.get('notes') as string;

    try {
        await prisma.goat.update({
            where: { id },
            data: {
                breed,
                gender,
                currentWeight: weight,
                basePrice: price,
                dynamicPrice: price,
                isAvailable,
                notes: notes || undefined,
            }
        });

        revalidatePath('/dashboard/inventory');
        return { success: true };
    } catch (error) {
        console.error('Error updating goat:', error);
        return { success: false, error: 'Gagal update data domba' };
    }
}

export async function deleteGoat(id: string) {
    try {
        await prisma.goat.delete({
            where: { id }
        });

        revalidatePath('/dashboard/inventory');
        return { success: true };
    } catch (error) {
        console.error('Error deleting goat:', error);
        return { success: false, error: 'Gagal hapus data domba' };
    }
}

export async function getAllGoats() {
    try {
        const goats = await prisma.goat.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return goats;
    } catch (error) {
        console.error('Error fetching goats:', error);
        return [];
    }
}
