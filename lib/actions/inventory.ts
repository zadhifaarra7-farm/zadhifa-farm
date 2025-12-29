'use server'

import { prisma } from '@/lib/prisma'

export async function getInventory() {
    try {
        // Simple query without relations (Pen and WeightRecord tables may not exist in cloud)
        const goats = await prisma.goat.findMany({
            orderBy: { updatedAt: 'desc' }
        });

        // Formatting for frontend
        return goats.map(goat => ({
            id: goat.registrationCode,
            name: goat.name,
            breed: goat.breed,
            currentWeight: Number(goat.currentWeight),
            age: calculateAge(goat.birthDate),
            status: goat.healthStatus,
            pen: 'Kandang Utama', // Default since Pen table may not exist
            rawId: goat.id
        }));
    } catch (error) {
        console.error('Failed to fetch inventory:', error);
        return [];
    }
}

function calculateAge(birthDate: Date): string {
    const diff = Date.now() - new Date(birthDate).getTime();
    const years = diff / (1000 * 60 * 60 * 24 * 365.25);

    if (years < 1) {
        const months = Math.floor(years * 12);
        return `${months} months`;
    }
    return `${years.toFixed(1)} yrs`;
}

export async function getGoatById(id: string) {
    try {
        const goat = await prisma.goat.findUnique({
            where: { registrationCode: id },
            include: {
                pen: true,
                weightHistory: { orderBy: { measuredAt: 'desc' } }
            }
        });

        if (!goat) return null;

        return {
            ...goat,
            currentWeight: Number(goat.currentWeight),
            basePrice: Number(goat.basePrice),
            dynamicPrice: goat.dynamicPrice ? Number(goat.dynamicPrice) : null,
            age: calculateAge(goat.birthDate),
            mediaUrls: goat.mediaUrls, // Prisma handles string[] if supported or mock it
            tags: goat.tags ? (typeof goat.tags === 'string' ? JSON.parse(goat.tags) : goat.tags) : []
        };
    } catch (error) {
        console.error('Error fetching goat:', error);
        return null;
    }
}
