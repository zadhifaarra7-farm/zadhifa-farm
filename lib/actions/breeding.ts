'use server'

import { prisma } from '@/lib/prisma'

export async function getBreedingStock() {
    try {
        const males = await prisma.goat.findMany({
            where: { gender: 'MALE', healthStatus: 'EXCELLENT' } // Only healthy males
        });
        const females = await prisma.goat.findMany({
            where: { gender: 'FEMALE', healthStatus: { in: ['EXCELLENT', 'GOOD'] } }
        });

        // Parse tags for better display
        const parse = (goats: any[]) => goats.map(g => ({
            ...g,
            currentWeight: Number(g.currentWeight),
            basePrice: Number(g.basePrice),
            tags: g.tags ? (typeof g.tags === 'string' ? JSON.parse(g.tags) : g.tags) : []
        }));

        return {
            males: parse(males),
            females: parse(females)
        };
    } catch (e) {
        console.error(e);
        return { males: [], females: [] };
    }
}

// Simulation Logic (Server Side for "Secret Sauce")
export async function simulateMating(sireId: string, damId: string) {
    const sire = await prisma.goat.findUnique({ where: { id: sireId } });
    const dam = await prisma.goat.findUnique({ where: { id: damId } });

    if (!sire || !dam) return { error: 'Parent not found' };

    // Genetic Algorithm Mockup
    const sireWeight = Number(sire.currentWeight);
    const damWeight = Number(dam.currentWeight);

    // Predicted Offspring stats
    const potentialWeight = (sireWeight + damWeight) / 2 * 1.1; // Heterosis effect (10% boost)
    const marketValue = (Number(sire.basePrice) + Number(dam.basePrice)) / 2 * 1.25; // Premium lineage

    // Traits Inheritance
    const sireTags = sire.tags ? (typeof sire.tags === 'string' ? JSON.parse(sire.tags) : sire.tags) : [];
    const damTags = dam.tags ? (typeof dam.tags === 'string' ? JSON.parse(dam.tags) : dam.tags) : [];

    // Combine unique traits, prioritize "Dominant" ones
    const combinedTags = Array.from(new Set([...sireTags, ...damTags]));

    return {
        success: true,
        sire: { name: sire.name, breed: sire.breed },
        dam: { name: dam.name, breed: dam.breed },
        prediction: {
            breed: sire.breed === dam.breed ? `Pure ${sire.breed}` : `Cross ${sire.breed} x ${dam.breed}`,
            potentialWeight: potentialWeight.toFixed(1),
            marketValue: marketValue,
            inheritedTraits: combinedTags,
            healthForecast: 'EXCELLENT (Genetic Clearance)',
            confidence: '85%'
        }
    };
}
