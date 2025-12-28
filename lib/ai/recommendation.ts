import { PrismaClient } from '@prisma/client';

export type GoatPurpose = 'QURBAN' | 'AQIQAH' | 'BREEDING';

interface UserPreferences {
    budget: number;
    eventType: GoatPurpose;
    eventDate: Date;
    preferredBreed?: string;
    minWeight?: number;
}

interface GoatRecommendation {
    goatId: string;
    matchPercentage: number;
    reasons: string[];
    priceConfidence: 'STABLE' | 'RISING' | 'PEAK';
}

// Mock Database of Goats (since we don't have DB running yet)
const MOCK_GOATS = [
    { id: '1', name: 'Etawa A1', price: 7500000, purpose: ['QURBAN', 'BREEDING'], weight: 85, health: 'EXCELLENT' },
    { id: '2', name: 'Boer Cross', price: 5200000, purpose: ['MEAT', 'AQIQAH'], weight: 65, health: 'GOOD' },
    { id: '3', name: 'Jawarandu', price: 3800000, purpose: ['QURBAN'], weight: 45, health: 'GOOD' },
    { id: '4', name: 'Saanen Pure', price: 12000000, purpose: ['DAIRY', 'BREEDING'], weight: 60, health: 'EXCELLENT' },
];

export async function getRecommendations(preferences: UserPreferences): Promise<GoatRecommendation[]> {
    // In a real app, this would query the vector database or use complex aggregation

    const scoredGoats = MOCK_GOATS.map(goat => {
        let score = 0;
        const reasons: string[] = [];

        // 1. Budget Fit (30%)
        const priceRatio = goat.price / preferences.budget;
        if (priceRatio <= 1.1) { // Allow slight overbudget
            const point = 30 * (1 - Math.abs(0.9 - priceRatio)); // Optimal is 90% of budget
            score += Math.max(0, point);
            if (point > 20) reasons.push('Perfect budget match');
        }

        // 2. Purpose Match (25%)
        if (goat.purpose.includes(preferences.eventType)) {
            score += 25;
            reasons.push(`Ideal for ${preferences.eventType}`);
        }

        // 3. Weight/Health (Simulated)
        if (goat.health === 'EXCELLENT') score += 20;

        // 4. Random AI "Magic" Factor (Seasonality, Pedigree)
        score += Math.random() * 25;

        return {
            goatId: goat.id,
            matchPercentage: Math.min(99, Math.round(score)),
            reasons,
            priceConfidence: 'RISING' as const // Mock prediction
        };
    });

    return scoredGoats.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3);
}
