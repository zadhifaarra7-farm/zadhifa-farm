'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addGoat(formData: FormData) {
    console.log('addGoat called with formData');

    const breed = formData.get('breed') as string;
    const gender = formData.get('gender') as string;
    const weight = parseFloat(formData.get('weight') as string) || 30;
    const price = parseFloat(formData.get('price') as string) || 3000000;
    const birthDate = formData.get('birthDate') as string;
    const notes = formData.get('notes') as string;

    console.log('Parsed data:', { breed, gender, weight, price, birthDate, notes });

    try {
        const count = await prisma.goat.count();
        console.log('Current goat count:', count);

        const code = `ZF-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
        console.log('Generated code:', code);

        const newGoat = await prisma.goat.create({
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
                notes: notes || null,
                tags: JSON.stringify(['Premium']),
                mediaUrls: JSON.stringify([]),
            }
        });

        console.log('Goat created successfully:', newGoat.id);

        revalidatePath('/dashboard/inventory');
        return { success: true, goat: { id: newGoat.id, registrationCode: newGoat.registrationCode } };
    } catch (error) {
        console.error('Error adding goat:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: `Gagal menambah data domba: ${errorMessage}` };
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
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                registrationCode: true,
                name: true,
                breed: true,
                gender: true,
                currentWeight: true,
                basePrice: true,
                isAvailable: true,
                notes: true,
            }
        });
        // Serialize untuk menghindari masalah dengan DateTime objects
        return JSON.parse(JSON.stringify(goats));
    } catch (error) {
        console.error('Error fetching goats:', error);
        return [];
    }
}
