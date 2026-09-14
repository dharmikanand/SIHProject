import { describe, it, expect } from 'vitest';
import { calculatePriceBreakdown } from './aiForecast';

describe('calculatePriceBreakdown', () => {
  const crop = {
    farmerPrice: 28,
    mandiPrice: 16,
    retailPrice: 45,
    krishiSetuPrice: 32,
  };

  it('uses the provided crop prices', () => {
    const r = calculatePriceBreakdown(crop);
    expect(r.traditional.farmerShare).toBe(16);
    expect(r.traditional.finalConsumerPrice).toBe(45);
    expect(r.direct.farmerShare).toBe(28);
    expect(r.direct.finalConsumerPrice).toBe(32);
  });

  it('splits the traditional intermediary margin across 4 layers summing to the spread (within rounding)', () => {
    const r = calculatePriceBreakdown(crop);
    const spread = 45 - 16; // 29
    const layers =
      r.traditional.villageAggregator +
      r.traditional.mandiCommissionDalal +
      r.traditional.transportAndSpoilageLoss +
      r.traditional.wholesalerAndRetailerMargin;
    // Layers are 15/22/25/38% of the spread, each rounded to 1 decimal
    expect(layers).toBeCloseTo(spread, 0);
  });

  it('computes farmer share of the consumer rupee for both chains', () => {
    const r = calculatePriceBreakdown(crop);
    // Traditional: 16/45 = 35.5% -> 36 (rounded)
    expect(r.traditional.farmerPercentOfRupee).toBe(36);
    // Direct: 28/32 = 87.5% -> 88
    expect(r.direct.farmerPercentOfRupee).toBe(88);
  });

  it('computes farmer gain percentage vs mandi', () => {
    const r = calculatePriceBreakdown(crop);
    // (28-16)/16 = 75%
    expect(r.direct.farmerGainPercentage).toBe(75);
  });

  it('computes consumer savings in rupees and percent', () => {
    const r = calculatePriceBreakdown(crop);
    expect(r.direct.consumerSavings).toBe(13); // 45-32
    // 13/45 = 28.9% -> 29
    expect(r.direct.consumerSavingsPercentage).toBe(29);
  });

  it('falls back to sensible defaults when fields are missing', () => {
    const r = calculatePriceBreakdown({});
    expect(r.traditional.farmerShare).toBe(14);
    expect(r.traditional.finalConsumerPrice).toBe(45);
    expect(r.direct.finalConsumerPrice).toBe(32);
  });
});
