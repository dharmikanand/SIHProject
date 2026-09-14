// Route Optimization & Cluster Aggregation Logic for KrishiSetu Logistics
// Solves multi-stop farm pickup (Milk-Run VRP) and compares with traditional fragmented trips

// Haversine formula for distance in kilometers between two [lat, lng] coordinates
export function calculateDistanceKm(coord1, coord2) {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Solves TSP using Nearest Neighbor heuristic starting from hub
export function optimizeMilkRunRoute(hubCoord, farms, destinationCoord) {
  const unvisited = [...farms];
  let currentCoord = hubCoord;
  const orderedStops = [];
  let totalDistanceKm = 0;

  // Visit all farms by picking nearest farm at each step
  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistanceKm(currentCoord, unvisited[i].coordinates);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = i;
      }
    }

    const nextStop = unvisited.splice(nearestIdx, 1)[0];
    totalDistanceKm += minDistance;
    orderedStops.push({
      ...nextStop,
      legDistanceKm: Math.round(minDistance * 10) / 10,
      cumulativeDistanceKm: Math.round(totalDistanceKm * 10) / 10
    });
    currentCoord = nextStop.coordinates;
  }

  // Final leg: from last farm back to Hub or to the Urban Destination
  const returnToHubDist = calculateDistanceKm(currentCoord, hubCoord);
  totalDistanceKm += returnToHubDist;

  // Transit to primary urban fulfillment hub
  const hubToUrbanDist = destinationCoord ? calculateDistanceKm(hubCoord, destinationCoord) : 0;

  // Baseline traditional fragmented stats (Each farmer travels individually to mandi)
  const traditionalTotalKm = farms.reduce((acc, f) => {
    // Round trip per farmer to local mandi (~20-25 km each)
    const dist = calculateDistanceKm(f.coordinates, hubCoord) * 2;
    return acc + dist;
  }, 0) + (destinationCoord ? calculateDistanceKm(hubCoord, destinationCoord) * 2.5 : 0);

  const totalCrates = farms.reduce((acc, f) => acc + (f.crates || 0), 0);
  const totalWeightKg = farms.reduce((acc, f) => acc + (f.weightKg || 0), 0);

  // Economic calculations
  const optimizedFuelCost = Math.round(totalDistanceKm * 28); // ₹28/km commercial freight rate
  const traditionalFuelCost = Math.round(traditionalTotalKm * 27); // multiple small pickups
  const fuelSavingsInr = traditionalFuelCost - optimizedFuelCost;
  const savingsPercent = Math.round(((traditionalFuelCost - optimizedFuelCost) / traditionalFuelCost) * 100);

  const carbonOptimizedKg = Math.round(totalDistanceKm * 0.26 * 10) / 10;
  const carbonTraditionalKg = Math.round(traditionalTotalKm * 0.31 * 10) / 10;
  const carbonSavedKg = Math.round((carbonTraditionalKg - carbonOptimizedKg) * 10) / 10;

  return {
    orderedStops,
    totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
    traditionalTotalKm: Math.round(traditionalTotalKm * 10) / 10,
    totalWeightKg,
    totalCrates,
    optimizedFuelCost,
    traditionalFuelCost,
    fuelSavingsInr,
    savingsPercent,
    carbonOptimizedKg,
    carbonTraditionalKg,
    carbonSavedKg,
    estimatedTimeHours: Math.round((totalDistanceKm / 35 + farms.length * 0.25) * 10) / 10
  };
}
