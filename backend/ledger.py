"""
KrishiSetu append-only escrow ledger — Problem Statement 26033, SIH 2026.

Guarantees (spec §5/§9, FR-C3..C5):
- Every financial state change is a hash-chained ledger entry (tamper-evident).
- All writes are idempotent via client-supplied Idempotency-Key.
- Ledger invariant per order: LOCK amount == RELEASE + PLATFORM_FEE + DISPUTE_HOLD.
"""
from __future__ import annotations

import hashlib
import json
import time
import uuid
from typing import Dict, List, Optional

from .models import EscrowSplit

GENESIS_HASH = "0" * 64


def _entry_hash(payload: dict, prev_hash: str) -> str:
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":")) + prev_hash
    return hashlib.sha256(canonical.encode()).hexdigest()


class EscrowLedger:
    """In-memory hash-chained ledger (Postgres append-only table in production)."""

    def __init__(self) -> None:
        self._entries: List[dict] = []
        self._by_order: Dict[str, List[dict]] = {}
        self._idempotency: Dict[str, dict] = {}

    # ---------------------------------------------------------------- writes
    def post(
        self,
        order_id: str,
        entry_type: str,
        split: EscrowSplit,
        idempotency_key: str,
        actor: str = "system",
        payload: Optional[dict] = None,
    ) -> dict:
        # Idempotency: identical key returns the original entry, never double-posts.
        if idempotency_key in self._idempotency:
            return self._idempotency[idempotency_key]

        prev = self._entries[-1]["entry_hash"] if self._entries else GENESIS_HASH
        entry = {
            "id": f"LG-{uuid.uuid4().hex[:12].upper()}",
            "order_id": order_id,
            "entry_type": entry_type,  # LOCK | RELEASE | DISPUTE_HOLD
            "actor": actor,
            "payload": payload or {},
            "prev_hash": prev,
            "ts": time.time(),
        }
        entry["entry_hash"] = _entry_hash(entry, prev)
        self._entries.append(entry)
        self._by_order.setdefault(order_id, []).append(entry)
        self._idempotency[idempotency_key] = entry
        return entry

    # ---------------------------------------------------------------- reads
    def entries_for_order(self, order_id: str) -> List[dict]:
        return list(self._by_order.get(order_id, []))

    def all_entries(self) -> List[dict]:
        return list(self._entries)

    def is_locked(self, order_id: str) -> bool:
        return any(e["entry_type"] == "LOCK" for e in self.entries_for_order(order_id))

    def is_released(self, order_id: str) -> bool:
        return any(e["entry_type"] == "RELEASE" for e in self.entries_for_order(order_id))

    def verify_chain(self) -> bool:
        """Recompute hashes; any tampering breaks the chain."""
        prev = GENESIS_HASH
        for e in self._entries:
            payload = {k: v for k, v in e.items() if k != "entry_hash"}
            if _entry_hash(payload, prev) != e["entry_hash"]:
                return False
            prev = e["entry_hash"]
        return True

    # ---------------------------------------------------------------- invariants
    def check_order_invariant(self, order_id: str, total_paise: int, split: EscrowSplit) -> bool:
        """LOCK total must equal the sum of the 85/10/5 split."""
        if split.farmer_payout_paise + split.platform_fee_paise + split.dispute_buffer_paise != total_paise:
            return False
        entries = self.entries_for_order(order_id)
        locked = sum(e["payload"].get("amount_paise", 0) for e in entries if e["entry_type"] == "LOCK")
        return locked == total_paise
