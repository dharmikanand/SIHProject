// KrishiSetu API client — PS 26033, SIH 2026
//
// Talks to the FastAPI backend (backend/main.py). Every call degrades
// gracefully: if the backend is unreachable (offline demo, SIH judging
// environment), callers fall back to local computation / mock data so the
// UI never breaks (NFR-3 graceful degradation).

const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:8000';
const API_V1 = `${API_BASE}/api/v1`;

const TIMEOUT_MS = 4000;

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_V1}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      const err = new Error(detail.detail || `API ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** True when the backend answers the health probe. Cached for the session. */
let backendHealthy = null;
export async function isBackendHealthy() {
  if (backendHealthy !== null) return backendHealthy;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${API_V1}/health`, { signal: controller.signal });
    clearTimeout(timer);
    backendHealthy = res.ok;
  } catch {
    backendHealthy = false;
  }
  return backendHealthy;
}

// ---------------------------------------------------------------- listings
export async function fetchListings({ category, q } = {}) {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.set('category', category);
  if (q) params.set('q', q);
  const qs = params.toString();
  return request(`/listings${qs ? `?${qs}` : ''}`);
}

export async function fetchPriceBreakdown(listingId) {
  return request(`/listings/${listingId}/price-breakdown`);
}

// ---------------------------------------------------------------- orders
export async function checkout({ buyerName, buyerType, mode, items }) {
  return request('/cart/checkout', {
    method: 'POST',
    body: {
      buyer_name: buyerName,
      buyer_type: buyerType,
      mode,
      items: items.map((i) => ({ listing_id: i.listingId, quantity_kg: i.quantityKg })),
    },
  });
}

export async function confirmDelivery(orderId, otp) {
  return request(`/orders/${orderId}/confirm-delivery?otp=${encodeURIComponent(otp)}`, {
    method: 'POST',
  });
}

export async function fetchFarmerDashboard() {
  return request('/farmers/me/dashboard');
}

// ---------------------------------------------------------------- logistics
export async function solveVRPTW({ hubCoordinates, stops, vehicleCapacityKg }) {
  return request('/logistics/solve', {
    method: 'POST',
    body: {
      hub_coordinates: hubCoordinates,
      stops: stops.map((s) => ({
        id: s.id,
        farmer_name: s.farmerName,
        village: s.village,
        crop: s.crop,
        weight_kg: s.weightKg,
        crates: s.crates,
        coordinates: s.coordinates,
      })),
      vehicle_capacity_kg: vehicleCapacityKg,
    },
  });
}

// ---------------------------------------------------------------- forecast
export async function fetchForecast(commodity, { basePrice = 16.5, horizon = 30 } = {}) {
  return request(`/forecasts/${commodity}?base_price=${basePrice}&horizon=${horizon}`);
}

// ---------------------------------------------------------------- impact
export async function fetchNationalImpact() {
  return request('/impact/national');
}

export async function fetchEnamComparison() {
  return request('/impact/enam-comparison');
}

export { request as apiRequest };
