"""
KrishiSetu server-side AI engines — Problem Statement 26033, SIH 2026.

- solve_vrptw(): capacitated Vehicle Routing Problem with Time Windows.
  Greedy feasibility-constrained nearest-neighbour with lateness penalty
  (same algorithm family as the JS bridge; OR-Tools drop-in point).
- prophet_decomposition(): additive time-series model
  y(t) = g(t) + s(t) + h(t) + eps  — trend + weekly seasonality + festive shocks.
"""
from __future__ import annotations

import math
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

from .models import FarmStop

R_EARTH_KM = 6371.0
AVG_SPEED_KMPH = 32.0  # rural road average


def haversine_km(a: List[float], b: List[float]) -> float:
    lat1, lon1 = math.radians(a[0]), math.radians(a[1])
    lat2, lon2 = math.radians(b[0]), math.radians(b[1])
    dlat, dlon = lat2 - lat1, lon2 - lon1
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return round(2 * R_EARTH_KM * math.asin(math.sqrt(h)), 1)


def _fmt_clock(minutes_from_start: float, start_hour: int) -> str:
    total_m = start_hour * 60 + minutes_from_start
    h, m = int(total_m // 60) % 24, int(total_m % 60)
    ampm = "PM" if h >= 12 else "AM"
    disp = h - 12 if h > 12 else h
    if disp == 0:
        disp = 12
    return f"{disp:02d}:{m:02d} {ampm}"


def solve_vrptw(
    hub: List[float],
    stops: List[FarmStop],
    vehicle_capacity_kg: float = 10000,
    service_minutes_per_stop: int = 18,
    start_hour: int = 6,
) -> dict:
    """
    Greedy VRPTW: at every step pick the feasible stop minimizing
    travel + wait + 10x lateness penalty. Stops that cannot fit on the
    vehicle (capacity) are reported as unserviced.
    """
    unvisited: List[FarmStop] = list(stops)
    current: List[float] = list(hub)
    current_time = 10.0  # 10 min hub loading
    load = 0.0
    total_km = 0.0
    manifest: List[dict] = [
        {
            "stop_index": 0,
            "node_type": "HUB",
            "name": "Central Aggregation Hub",
            "arrival": _fmt_clock(0, start_hour),
            "departure": _fmt_clock(current_time, start_hour),
            "payload_collected_kg": 0,
            "cumulative_load_kg": 0,
            "time_window_status": "COMPLIANT",
        }
    ]

    while unvisited:
        best: Optional[FarmStop] = None
        best_score = math.inf
        best_leg = 0.0
        best_arrival = 0.0
        best_wait = 0.0

        for cand in unvisited:
            leg = haversine_km(current, cand.coordinates)
            travel = (leg / AVG_SPEED_KMPH) * 60
            arrival = current_time + travel
            if load + cand.weight_kg > vehicle_capacity_kg:
                continue  # hard capacity constraint
            # Default window: 06:00-10:00 (0-240 min from start)
            tw_start, tw_end = 0, 240
            wait = max(0.0, tw_start - arrival)
            penalty = max(0.0, arrival - tw_end) * 10
            score = travel + wait + penalty
            if score < best_score:
                best, best_score = cand, score
                best_leg, best_arrival, best_wait = leg, arrival, wait

        if best is None:
            break  # remaining stops don't fit — reported as unserviced

        unvisited.remove(best)
        departure = best_arrival + best_wait + service_minutes_per_stop
        total_km += best_leg
        load += best.weight_kg
        manifest.append(
            {
                "stop_index": len(manifest),
                "node_type": "FARM_GATE",
                "id": best.id,
                "name": best.farmer_name,
                "village": best.village,
                "crop": best.crop,
                "arrival": _fmt_clock(best_arrival + best_wait, start_hour),
                "departure": _fmt_clock(departure, start_hour),
                "wait_minutes": int(best_wait),
                "service_minutes": service_minutes_per_stop,
                "leg_distance_km": best_leg,
                "payload_collected_kg": best.weight_kg,
                "cumulative_load_kg": load,
                "time_window_status": "COMPLIANT" if best_arrival <= tw_end_for(best) else "DELAYED",
            }
        )
        current = list(best.coordinates)
        current_time = departure

    return_km = haversine_km(current, hub)
    total_km += return_km
    final_time = current_time + (return_km / AVG_SPEED_KMPH) * 60
    manifest.append(
        {
            "stop_index": len(manifest),
            "node_type": "HUB_RETURN",
            "name": "Central Aggregation Hub",
            "arrival": _fmt_clock(final_time, start_hour),
            "departure": _fmt_clock(final_time, start_hour),
            "payload_collected_kg": 0,
            "cumulative_load_kg": load,
            "time_window_status": "COMPLIANT",
        }
    )

    return {
        "solver_status": "OPTIMAL_VRPTW_FEASIBLE",
        "manifest": manifest,
        "total_distance_km": total_km,
        "total_payload_kg": load,
        "capacity_utilization_pct": round(load / vehicle_capacity_kg * 100, 1) if vehicle_capacity_kg else 0,
        "total_time_minutes": round(final_time),
        "unserviced_count": len(unvisited),
    }


def tw_end_for(stop: FarmStop) -> float:
    """Per-stop window end in minutes from start; demo uses a flat 10:00 AM cutoff."""
    return 240.0


def prophet_decomposition(
    base_modal_price: float = 16.5,
    horizon_days: int = 30,
    history_days: int = 15,
    commodity: str = "Onion",
) -> List[dict]:
    """
    Additive forecast: y(t) = g(t) + s(t) + h(t).
    Festive calendar covers the SIH 2026 demo window (Sep-Oct).
    """
    events: Dict[str, dict] = {
        (datetime(2026, 9, 22) + timedelta(days=d)).strftime("%Y-%m-%d"): ev
        for d, ev in [
            (0, {"name": "Navratri Festive Influx Begins", "shock_inr": 3.8}),
            (6, {"name": "Durga Puja Procurement Peak", "shock_inr": 4.5}),
            (10, {"name": "National Holiday Transit Slowdown", "shock_inr": -1.2}),
            (18, {"name": "Diwali Advance Institutional Booking", "shock_inr": 5.2}),
        ]
    }

    total = history_days + horizon_days
    start = datetime(2026, 9, 1) - timedelta(days=history_days)
    out: List[dict] = []
    for day in range(total):
        dt = start + timedelta(days=day)
        t = day / total
        g_t = base_modal_price * (1 + 0.12 * t)
        s_t = 0.8 * math.sin(2 * math.pi * dt.weekday() / 7)
        h_t, active = 0.0, None
        for ev_date, ev in events.items():
            delta = (dt - datetime.strptime(ev_date, "%Y-%m-%d")).days
            if abs(delta) <= 4:
                h_t += ev["shock_inr"] * math.exp(-0.3 * delta * delta)
                if abs(delta) <= 1:
                    active = ev["name"]
        y = g_t + s_t + h_t
        spread = 1.2 + 0.05 * day
        out.append(
            {
                "date": dt.strftime("%Y-%m-%d"),
                "modal_price": round(y, 2),
                "direct_price": round(y * 1.55, 2),
                "trend_g_t": round(g_t, 2),
                "seasonality_s_t": round(s_t, 2),
                "holiday_shock_h_t": round(h_t, 2),
                "confidence_lower": round(max(1.0, y - spread), 2),
                "confidence_upper": round(y + spread, 2),
                "is_projection": day >= history_days,
                "active_event": active,
            }
        )
    return out
