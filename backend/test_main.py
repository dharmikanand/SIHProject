"""
KrishiSetu backend test suite (pytest + FastAPI TestClient).

Run:  python -m pytest backend/test_main.py -v
"""
import pytest
from fastapi.testclient import TestClient

from backend.main import app, LEDGER, LISTINGS, ORDERS, AUDIT

client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_state():
    LISTINGS.clear()
    ORDERS.clear()
    AUDIT.clear()
    LEDGER._entries.clear()
    LEDGER._by_order.clear()
    LEDGER._idempotency.clear()
    yield


def _make_listing(**overrides):
    body = {
        "name": "Nashik Red Onion",
        "category": "Vegetables",
        "farmer": {
            "name": "Rameshwar Patil",
            "village": "Pimpalgaon",
            "district": "Nashik",
            "state": "Maharashtra",
        },
        "quantity_quintals": 120,
        "farmer_price_paise": 2800,
        "mandi_price_paise": 1600,
        "retail_price_paise": 4500,
        "platform_price_paise": 3200,
        "batch_code": "NSK-2026-ON-094",
    }
    body.update(overrides)
    return client.post("/api/v1/listings", json=body)


def test_health():
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_create_listing_computes_gain_and_savings():
    r = _make_listing()
    assert r.status_code == 201
    data = r.json()
    # gain: (2800-1600)/1600 = 75%
    assert data["farmer_gain_pct"] == 75.0
    # savings: (4500-3200)/4500 = 28.9% -> 28.9
    assert data["consumer_savings_pct"] == pytest.approx(28.9, abs=0.1)


def test_rejects_platform_price_below_farmer_price():
    r = _make_listing(platform_price_paise=2000, farmer_price_paise=2800)
    assert r.status_code == 422


def test_price_breakdown_percentages():
    listing_id = _make_listing().json()["id"]
    r = client.get(f"/api/v1/listings/{listing_id}/price-breakdown")
    assert r.status_code == 200
    d = r.json()
    assert d["direct"]["farmer_gain_pct"] == 75.0
    assert d["traditional"]["final_consumer_price_paise"] == 4500
    assert d["direct"]["final_consumer_price_paise"] == 3200


def test_checkout_creates_exact_85_10_5_split():
    listing_id = _make_listing().json()["id"]
    r = client.post(
        "/api/v1/cart/checkout",
        json={
            "buyer_name": "Greenwood Society",
            "items": [{"listing_id": listing_id, "quantity_kg": 100}],
        },
    )
    assert r.status_code == 201
    o = r.json()
    assert o["total_paise"] == 3200 * 100
    s = o["split"]
    assert s["farmer_payout_paise"] + s["platform_fee_paise"] + s["dispute_buffer_paise"] == o["total_paise"]
    assert s["farmer_payout_paise"] == round(o["total_paise"] * 0.85)
    assert LEDGER.is_locked(o["id"])


def test_checkout_is_idempotent():
    listing_id = _make_listing().json()["id"]
    body = {
        "buyer_name": "Haldiram Foods",
        "idempotency_key": "fixed-key-123",
        "items": [{"listing_id": listing_id, "quantity_kg": 500}],
    }
    r1 = client.post("/api/v1/cart/checkout", json=body)
    r2 = client.post("/api/v1/cart/checkout", json=body)
    assert r1.json()["id"] == r2.json()["id"]
    # And the ledger has exactly one LOCK despite two checkout calls
    locks = [e for e in LEDGER.entries_for_order(r1.json()["id"]) if e["entry_type"] == "LOCK"]
    assert len(locks) == 1


def test_checkout_rejects_insufficient_stock():
    listing_id = _make_listing(quantity_quintals=1).json()["id"]
    r = client.post(
        "/api/v1/cart/checkout",
        json={"buyer_name": "X", "items": [{"listing_id": listing_id, "quantity_kg": 500}]},
    )
    assert r.status_code == 409


def test_confirm_delivery_releases_escrow_with_valid_otp():
    listing_id = _make_listing().json()["id"]
    order = client.post(
        "/api/v1/cart/checkout",
        json={"buyer_name": "Buyer", "items": [{"listing_id": listing_id, "quantity_kg": 50}]},
    ).json()

    # Wrong OTP must be rejected and audited
    bad = client.post(f"/api/v1/orders/{order['id']}/confirm-delivery", params={"otp": "0000"})
    assert bad.status_code == 403

    # Extract the raw OTP from the prototype-only order attribute
    raw_otp = ORDERS[order["id"]].__dict__.get("_raw_otp")
    assert raw_otp, "prototype must retain raw OTP for demo"
    good = client.post(f"/api/v1/orders/{order['id']}/confirm-delivery", params={"otp": raw_otp})
    assert good.status_code == 200
    assert good.json()["escrow_status"] == "RELEASED_TO_FARMER"
    assert good.json()["logistics_status"] == "DELIVERED"
    assert LEDGER.is_released(order["id"])

    # Re-confirm is idempotent
    again = client.post(f"/api/v1/orders/{order['id']}/confirm-delivery", params={"otp": raw_otp})
    assert again.status_code == 200


def test_ledger_chain_survives_and_detects_tampering():
    listing_id = _make_listing().json()["id"]
    order = client.post(
        "/api/v1/cart/checkout",
        json={"buyer_name": "Buyer", "items": [{"listing_id": listing_id, "quantity_kg": 10}]},
    ).json()
    assert LEDGER.verify_chain() is True

    # Tamper with an entry -> chain must break
    LEDGER._entries[0]["payload"]["amount_paise"] = 1
    assert LEDGER.verify_chain() is False


def test_farmer_dashboard_aggregates_escrow():
    listing_id = _make_listing().json()["id"]
    client.post(
        "/api/v1/cart/checkout",
        json={"buyer_name": "B1", "items": [{"listing_id": listing_id, "quantity_kg": 100}]},
    )
    r = client.get("/api/v1/farmers/me/dashboard")
    assert r.status_code == 200
    d = r.json()
    assert d["active_orders"] == 1
    assert d["active_escrow_paise"] == round(3200 * 100 * 0.85)


def test_vrp_solve_returns_feasible_manifest():
    r = client.post(
        "/api/v1/logistics/solve",
        json={
            "hub_coordinates": [20.175, 73.985],
            "stops": [
                {
                    "id": "f1",
                    "farmer_name": "Rameshwar Patil",
                    "village": "Pimpalgaon",
                    "crop": "Onion",
                    "weight_kg": 2400,
                    "coordinates": [20.215, 73.945],
                },
                {
                    "id": "f2",
                    "farmer_name": "Sunita Deshmukh",
                    "village": "Sukhana",
                    "crop": "Tomato",
                    "weight_kg": 1800,
                    "coordinates": [20.155, 73.910],
                },
            ],
            "vehicle_capacity_kg": 10000,
        },
    )
    assert r.status_code == 200
    d = r.json()
    assert d["solver_status"] == "OPTIMAL_VRPTW_FEASIBLE"
    assert d["manifest"][0]["node_type"] == "HUB"
    assert d["manifest"][-1]["node_type"] == "HUB_RETURN"
    assert d["total_payload_kg"] == 4200
    assert d["unserviced_count"] == 0


def test_vrp_reports_unserviced_when_capacity_tiny():
    r = client.post(
        "/api/v1/logistics/solve",
        json={
            "hub_coordinates": [20.175, 73.985],
            "stops": [
                {
                    "id": f"f{i}",
                    "farmer_name": f"Farmer {i}",
                    "village": "V",
                    "crop": "Onion",
                    "weight_kg": 2000,
                    "coordinates": [20.1 + i * 0.01, 73.9 + i * 0.01],
                }
                for i in range(4)
            ],
            "vehicle_capacity_kg": 3000,
        },
    )
    d = r.json()
    assert d["unserviced_count"] > 0


def test_forecast_shape_and_confidence_band():
    r = client.get("/api/v1/forecasts/onion?base_price=16.5")
    assert r.status_code == 200
    d = r.json()
    series = d["series"]
    assert len(series) == 45  # 15 history + 30 projection
    assert sum(1 for p in series if p["is_projection"]) == 30
    for p in series:
        assert p["confidence_lower"] <= p["modal_price"] <= p["confidence_upper"]


def test_enam_comparison_benchmarks():
    r = client.get("/api/v1/impact/enam-comparison")
    assert r.status_code == 200
    d = r.json()
    assert d["enam"]["farmer_share_of_rupee_pct"] < d["krishisetu"]["farmer_share_of_rupee_pct"]


def test_audit_chain_valid_after_full_journey():
    listing_id = _make_listing().json()["id"]
    order = client.post(
        "/api/v1/cart/checkout",
        json={"buyer_name": "Buyer", "items": [{"listing_id": listing_id, "quantity_kg": 20}]},
    ).json()
    raw_otp = ORDERS[order["id"]].__dict__.get("_raw_otp")
    client.post(f"/api/v1/orders/{order['id']}/confirm-delivery", params={"otp": raw_otp})

    r = client.get("/api/v1/admin/audit")
    assert r.json()["chain_valid"] is True
    actions = [e["action"] for e in r.json()["events"]]
    assert "CREATED" in actions and "ESCROW_LOCKED" in actions and "ESCROW_RELEASED" in actions
