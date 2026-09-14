import { describe, it, expect } from 'vitest';
import { runPostGISDBSCAN, calculateHaversineDistanceKm } from './postgisCluster';

const farm = (id, lat, lng, weightKg = 1000, village = 'V') => ({
  id,
  coordinates: [lat, lng],
  weightKg,
  village,
});

describe('calculateHaversineDistanceKm', () => {
  it('is zero for identical coordinates', () => {
    expect(calculateHaversineDistanceKm([20.0, 73.0], [20.0, 73.0])).toBe(0);
  });

  it('matches known Nashik -> Mumbai great-circle distance (~140 km)', () => {
    const d = calculateHaversineDistanceKm([19.9975, 73.7898], [19.076, 72.8777]);
    expect(d).toBeGreaterThan(130);
    expect(d).toBeLessThan(150);
  });

  it('is symmetric', () => {
    const a = [20.1, 73.9];
    const b = [20.3, 74.1];
    expect(calculateHaversineDistanceKm(a, b)).toBe(calculateHaversineDistanceKm(b, a));
  });
});

describe('runPostGISDBSCAN', () => {
  it('groups nearby farmgates into one cluster with correct centroid and payload', () => {
    const farms = [
      farm('a', 20.175, 73.985, 2400, 'Pimpalgaon'),
      farm('b', 20.180, 73.990, 1800, 'Pimpalgaon East'),
    ];
    const r = runPostGISDBSCAN(farms, 8.5, 2);

    expect(r.clusters).toHaveLength(1);
    expect(r.noise).toHaveLength(0);
    expect(r.clusters[0].farmCount).toBe(2);
    expect(r.clusters[0].totalWeightKg).toBe(4200);
    // Centroid is the mean of both coordinates
    expect(r.clusters[0].centroid[0]).toBeCloseTo(20.178, 2);
    expect(r.clusters[0].centroid[1]).toBeCloseTo(73.988, 2);
  });

  it('marks isolated farmgates as noise when below minPts', () => {
    const farms = [
      farm('near-a', 20.175, 73.985),
      farm('near-b', 20.180, 73.990),
      farm('far', 13.003, 77.940), // Kolar — thousands of km away
    ];
    const r = runPostGISDBSCAN(farms, 8.5, 2);

    expect(r.clusters).toHaveLength(1);
    expect(r.noise.map((f) => f.id)).toEqual(['far']);
    expect(r.totalFarmsAggregated).toBe(2);
  });

  it('assigns 10T reefer to heavy clusters and 3.5T to light ones', () => {
    const heavy = runPostGISDBSCAN(
      [farm('h1', 20.1, 73.9, 6000), farm('h2', 20.11, 73.91, 5000)],
      8.5,
      2
    );
    const light = runPostGISDBSCAN(
      [farm('l1', 20.1, 73.9, 400), farm('l2', 20.11, 73.91, 500)],
      8.5,
      2
    );
    expect(heavy.clusters[0].assignedVehicleType).toBe('10-Tonne Reefer EV');
    expect(light.clusters[0].assignedVehicleType).toBe('3.5-Tonne Ace Reefer');
  });

  it('handles empty input gracefully', () => {
    const r = runPostGISDBSCAN([], 8.5, 2);
    expect(r.clusters).toHaveLength(0);
    expect(r.noise).toHaveLength(0);
  });
});
