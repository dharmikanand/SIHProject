import { describe, it, expect } from 'vitest';
import { getProphetDecomposition } from './prophetEngine';

describe('getProphetDecomposition', () => {
  const series = getProphetDecomposition('onion', 16.5);

  it('returns a full series of 20 points', () => {
    expect(series).toHaveLength(20);
  });

  it('marks the first 12 points as history and the rest as projections', () => {
    expect(series.filter((p) => !p.isProjected)).toHaveLength(12);
    expect(series.filter((p) => p.isProjected)).toHaveLength(8);
  });

  it('decomposition components sum to the modal price for every point', () => {
    for (const p of series) {
      expect(p.modalPrice).toBeCloseTo(p.trend + p.seasonality + p.holidayShock, 5);
    }
  });

  it('direct price stays above modal price (platform adds logistics, not middlemen)', () => {
    for (const p of series) {
      expect(p.directPrice).toBeGreaterThan(p.modalPrice);
    }
  });

  it('confidence band always brackets the modal price', () => {
    for (const p of series) {
      expect(p.lowerCI).toBeLessThanOrEqual(p.modalPrice);
      expect(p.upperCI).toBeGreaterThanOrEqual(p.modalPrice);
    }
  });

  it('applies festive shocks with sign matching the event', () => {
    const diwali = series.find((p) => p.eventName === 'Diwali Stocking');
    const transit = series.find((p) => p.eventName === 'Transit Holiday');
    expect(diwali.holidayShock).toBeGreaterThan(0);
    expect(transit.holidayShock).toBeLessThan(0);
  });

  it('scales mandi arrival volumes per commodity baseline', () => {
    const onion = getProphetDecomposition('onion');
    const tomato = getProphetDecomposition('tomato');
    // Onion baseline 14000 vs tomato 18000 quintals
    const onionMax = Math.max(...onion.map((p) => p.arrivalQuintals));
    const tomatoMax = Math.max(...tomato.map((p) => p.arrivalQuintals));
    expect(tomatoMax).toBeGreaterThan(onionMax);
  });
});
