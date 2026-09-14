"""
KrishiSetu domain models (Pydantic) — Problem Statement 26033, SIH 2026.

Money is always in **paise** (int) to avoid floating-point drift.
Escrow split: 85% farmer / 10% platform+logistics / 5% dispute buffer.
"""
from __future__ import annotations

import hashlib
import time
import uuid
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


# ---------------------------------------------------------------- enums
class EscrowStatus(str, Enum):
    LOCKED_IN_ESCROW = "LOCKED_IN_ESCROW"
    QUALITY_VERIFIED = "QUALITY_VERIFIED"
    RELEASED_TO_FARMER = "RELEASED_TO_FARMER"
    DISPUTED = "DISPUTED"


class LogisticsStatus(str, Enum):
    SCHEDULED = "SCHEDULED"
    PICKED_UP = "PICKED_UP"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"


class OrderMode(str, Enum):
    B2C = "B2C"
    B2B = "B2B"


# ---------------------------------------------------------------- listings
class FarmerProfile(BaseModel):
    name: str
    village: str
    district: str
    state: str
    fpo: Optional[str] = None
    rating: float = Field(default=4.5, ge=0, le=5)
    coordinates: Optional[List[float]] = None  # [lat, lng]


class ListingCreate(BaseModel):
    name: str = Field(min_length=3, max_length=120)
    category: str
    variety: Optional[str] = None
    farmer: FarmerProfile
    quantity_quintals: float = Field(gt=0)
    farmer_price_paise: int = Field(gt=0, description="₹/kg in paise, e.g. 2800 = ₹28/kg")
    mandi_price_paise: int = Field(gt=0)
    retail_price_paise: int = Field(gt=0)
    platform_price_paise: int = Field(gt=0, description="Consumer price on KrishiSetu")
    organic_cert: bool = False
    quality_grade: str = "Grade A"
    batch_code: str
    shelf_life_days: int = 30
    storage_condition: str = "Ambient"
    description: Optional[str] = None

    @field_validator("platform_price_paise")
    @classmethod
    def platform_price_covers_farmer(cls, v: int, info):
        farmer = info.data.get("farmer_price_paise")
        if farmer is not None and v < farmer:
            raise ValueError(
                "platform_price_paise must be >= farmer_price_paise "
                "(farmers are never paid below their ask)"
            )
        return v


class Listing(ListingCreate):
    id: str
    farmer_gain_pct: float = 0.0
    consumer_savings_pct: float = 0.0
    created_ts: float = 0.0


# ---------------------------------------------------------------- orders
class CheckoutItem(BaseModel):
    listing_id: str
    quantity_kg: float = Field(gt=0)


class CheckoutRequest(BaseModel):
    buyer_name: str
    buyer_type: str = "Consumer Direct"
    mode: OrderMode = OrderMode.B2C
    items: List[CheckoutItem] = Field(min_length=1)
    idempotency_key: str = Field(
        default_factory=lambda: f"idem-{uuid.uuid4()}",
        description="Client-generated key; retries with the same key return the same order",
    )


class EscrowSplit(BaseModel):
    farmer_payout_paise: int
    platform_fee_paise: int
    dispute_buffer_paise: int


class Order(BaseModel):
    id: str
    buyer_name: str
    buyer_type: str
    mode: OrderMode
    items: List[dict]
    total_paise: int
    split: EscrowSplit
    escrow_status: EscrowStatus = EscrowStatus.LOCKED_IN_ESCROW
    logistics_status: LogisticsStatus = LogisticsStatus.SCHEDULED
    delivery_otp_hash: str
    created_ts: float


# ---------------------------------------------------------------- logistics
class FarmStop(BaseModel):
    id: str
    farmer_name: str
    village: str
    crop: str
    weight_kg: float = Field(ge=0)
    crates: int = 0
    coordinates: List[float]  # [lat, lng]


class SolveRequest(BaseModel):
    hub_coordinates: List[float]
    stops: List[FarmStop] = Field(min_length=1)
    vehicle_capacity_kg: float = Field(default=10000, gt=0)
    service_minutes_per_stop: int = Field(default=18, ge=0, le=120)
    start_hour: int = Field(default=6, ge=0, le=23)


class ForecastPoint(BaseModel):
    date: str
    modal_price: float
    direct_price: float
    trend_g_t: float
    seasonality_s_t: float
    holiday_shock_h_t: float
    confidence_lower: float
    confidence_upper: float
    is_projection: bool
    active_event: Optional[str] = None


# ---------------------------------------------------------------- audit
class AuditEvent(BaseModel):
    id: str
    actor: str
    entity: str
    entity_id: str
    action: str
    payload: dict = {}
    prev_hash: str
    entry_hash: str
    ts: float


def new_id(prefix: str) -> str:
    return f"{prefix}-{time.strftime('%Y%m')}-{uuid.uuid4().hex[:8].upper()}"


def hash_otp(otp: str) -> str:
    """Production would use HMAC with a server secret; sha256 keeps the demo honest."""
    return hashlib.sha256(otp.encode()).hexdigest()
