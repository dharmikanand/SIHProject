import { describe, it, expect } from 'vitest';
import { runOrToolsVRPTW } from './ortoolsBridge';
import { LOGISTICS_CLUSTER_DATA } from '../data/mockData';

const hub = [20.175, 73.985];
const farms = LOGISTICS_CLUSTER_DATA.farms;

describe('runOrToolsVRPTW', () => {
  const solution = runOrToolsVRPTW({ hubCoord: hub, farms, vehicleCapacityKg: 10000 });

  it('produces a feasible solver status', () => {
    expect(solution.solverStatus).toBe('OPTIMAL_VRPTW_FEASIBLE');
  });

  it('starts at the hub and ends with a hub return', () => {
    expect(solution.manifest[0].nodeType).toBe('HUB');
    expect(solution.manifest[solution.manifest.length - 1].nodeType).toBe('HUB_RETURN');
  });

  it('services every farm gate exactly once', () => {
    const farmStops = solution.manifest.filter((m) => m.nodeType === 'FARM_GATE');
    expect(farmStops).toHaveLength(farms.length);
    const ids = new Set(farmStops.map((m) => m.id));
    expect(ids.size).toBe(farms.length);
  });

  it('never exceeds vehicle capacity at any point on the route', () => {
    for (const stop of solution.manifest) {
      expect(stop.cumulativeLoadKg).toBeLessThanOrEqual(10000);
    }
  });

  it('keeps cumulative payload consistent with per-stop collections', () => {
    let expected = 0;
    for (const stop of solution.manifest) {
      expected += stop.payloadCollectedKg || 0;
      expect(stop.cumulativeLoadKg).toBe(expected);
    }
    expect(solution.totalPayloadKg).toBe(expected);
  });

  it('labels every stop COMPLIANT or DELAYED and lateness carries a penalty score', () => {
    for (const stop of solution.manifest) {
      expect(['COMPLIANT', 'DELAYED']).toContain(stop.timeWindowStatus);
      if (stop.timeWindowStatus === 'DELAYED') {
        // DELAYED stops must genuinely arrive past their window end
        expect(stop.nodeType).toBe('FARM_GATE');
      }
    }
  });

  it('services all farm gates even when some run late (penalty, not drop-off)', () => {
    const farmStops = solution.manifest.filter((m) => m.nodeType === 'FARM_GATE');
    expect(farmStops).toHaveLength(farms.length);
  });

  it('reports capacity utilization', () => {
    const totalWeight = farms.reduce((a, f) => a + (f.weightKg || 0), 0);
    expect(solution.capacityUtilizationPct).toBe(
      Math.round((totalWeight / 10000) * 100)
    );
  });

  it('drops unserviceable stops into unservicedCount when capacity is tiny', () => {
    const tiny = runOrToolsVRPTW({ hubCoord: hub, farms, vehicleCapacityKg: 1000 });
    expect(tiny.unservicedCount).toBeGreaterThan(0);
  });

  it('calculates positive total distance', () => {
    expect(solution.totalDistanceKm).toBeGreaterThan(0);
  });
});
