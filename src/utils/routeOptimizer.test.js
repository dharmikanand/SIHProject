import { describe, it, expect } from 'vitest';
import { optimizeMilkRunRoute, calculateDistanceKm } from './routeOptimizer';
import { LOGISTICS_CLUSTER_DATA } from '../data/mockData';

const hub = [20.175, 73.985];
const destination = [19.076, 73.007]; // Navi Mumbai Vashi
const farms = LOGISTICS_CLUSTER_DATA.farms;

describe('calculateDistanceKm', () => {
  it('returns 0 for the same point', () => {
    expect(calculateDistanceKm(hub, hub)).toBe(0);
  });

  it('rounds to one decimal place', () => {
    const d = calculateDistanceKm(hub, [20.215, 73.945]);
    expect(d).toBe(Math.round(d * 10) / 10);
  });
});

describe('optimizeMilkRunRoute', () => {
  const result = optimizeMilkRunRoute(hub, farms, destination);

  it('visits every farm exactly once', () => {
    expect(result.orderedStops).toHaveLength(farms.length);
    const ids = new Set(result.orderedStops.map((s) => s.id));
    expect(ids.size).toBe(farms.length);
  });

  it('accumulates leg distances into a monotonically increasing cumulative total', () => {
    let last = 0;
    for (const stop of result.orderedStops) {
      expect(stop.cumulativeDistanceKm).toBeGreaterThanOrEqual(last);
      last = stop.cumulativeDistanceKm;
    }
    // Final cumulative includes the return-to-hub leg
    expect(result.orderedStops[result.orderedStops.length - 1].cumulativeDistanceKm)
      .toBeLessThanOrEqual(result.totalDistanceKm);
  });

  it('milk-run beats the fragmented traditional baseline on distance', () => {
    expect(result.totalDistanceKm).toBeLessThan(result.traditionalTotalKm);
  });

  it('produces positive fuel savings and a sane savings percentage', () => {
    expect(result.fuelSavingsInr).toBeGreaterThan(0);
    expect(result.savingsPercent).toBeGreaterThan(0);
    expect(result.savingsPercent).toBeLessThanOrEqual(100);
  });

  it('optimized route emits less carbon than traditional', () => {
    expect(result.carbonSavedKg).toBeGreaterThan(0);
    expect(result.carbonOptimizedKg).toBeLessThan(result.carbonTraditionalKg);
  });

  it('aggregates total weight and crates across all farms', () => {
    const expectedWeight = farms.reduce((a, f) => a + f.weightKg, 0);
    const expectedCrates = farms.reduce((a, f) => a + f.crates, 0);
    expect(result.totalWeightKg).toBe(expectedWeight);
    expect(result.totalCrates).toBe(expectedCrates);
  });

  it('estimates realistic transit time (>= distance at 35 km/h + service stops)', () => {
    expect(result.estimatedTimeHours).toBeGreaterThan(result.totalDistanceKm / 35);
  });
});
