export function predictPrice(
    currentWeight: number,
    breed: string,
    daysUntilIdulAdha: number
): { predictedPrice: number; confidence: number; trend: string } {

    // Base logic constants (Refined for Indonesian Market)
    const BASE_PRICE_PER_KG = 85000; // Standard meat price
    const BREED_MULTIPLIERS: Record<string, number> = {
        'ETAWA': 1.5,
        'BOER': 1.8,
        'KACANG': 1.1,
        'JAWARANDU': 1.2,
        'DORPER': 2.5,
        'CROSS DORPER': 2.0,
        'GARUT': 1.6
    };

    // 1. Growth Projection
    const estimatedDailyGain = 0.15; // kg/day
    const projectedWeight = currentWeight + (estimatedDailyGain * 30); // 1 month projection

    // 2. Seasonality Factor (Idul Adha Spike)
    let seasonalMultiplier = 1.0;
    if (daysUntilIdulAdha < 30) seasonalMultiplier = 1.6; // High spike
    else if (daysUntilIdulAdha < 90) seasonalMultiplier = 1.3; // Building up

    // 3. Breed Premium (Case insensitive)
    const breedFactor = BREED_MULTIPLIERS[breed.toUpperCase()] || 1.0;

    // Calculate
    const predictedPrice = projectedWeight * BASE_PRICE_PER_KG * breedFactor * seasonalMultiplier;

    return {
        predictedPrice: Math.round(predictedPrice / 50000) * 50000, // Round to nearest 50k
        confidence: 0.85,
        trend: seasonalMultiplier > 1.2 ? 'UPTREMD' : 'STABLE'
    };
}
