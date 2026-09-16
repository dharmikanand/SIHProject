# 🌾 KrishiSetu (कृषि सेतु) — "The Farmer's Bridge"

**Direct Farmer-to-Consumer Agri-Marketplace with AI Logistics & Demand Intelligence**

> Smart India Hackathon 2026 · Problem Statement **26033**
> *Multiple intermediaries reduce farmers' earnings and increase consumer prices.*
> Ministry of Consumer Affairs, Food & Public Distribution · Department of Consumer Affairs (DoCA)
> Theme: Agriculture, FoodTech & Rural Development · Category: Software

---

## 📖 The Problem We Solve

In India, a tomato that leaves the farm at **₹16/kg** reaches the consumer at **₹45/kg**. The farmer's share of the consumer rupee is often under 35%. Why? **4–6 layers of intermediaries** — commission agents (dalals), mandi brokers, wholesalers, sub-wholesalers, retailers — each adding margin without adding value.

KrishiSetu removes every layer between the farm gate and the plate:

```
TRADITIONAL                       KRISHISETU
Farmer → Dalal → Mandi →          Farmer/FPO → Consumer/Bulk Buyer
Wholesaler → Retailer → You       (escrow-protected, AI-optimized logistics)
Farmer share: ~35%                Farmer share: 85%
Consumer price: ₹45/kg            Consumer price: ₹32/kg
```

**Result: farmers earn ~75% more than mandi rates while consumers save ~25–30% vs retail — every rupee is traceable.**

---

## ✨ What It Does — Feature Tour

### 🔐 Role-Based Portals (with Login)
The app opens on an **editorial login gate**: pick your language → pick your role → name + mobile → OTP (demo code: **4321**). Each role then sees *only* its own surfaces:

| Surface | 🛒 Buyer | 🌾 Farmer/FPO |
|---|:---:|:---:|
| Marketplace (browse, basket, checkout) | ✅ | — |
| Farmer Portal (List Crop, earnings, escrow payouts) | — | ✅ |
| **My Orders** (tracking, waiting-list, cancel + refund) | ✅ | ✅ (scoped) |
| Logistics (DBSCAN zones, VRP milk-runs, dispatch sim) | ✅ | ✅ |
| AI Forecast (role-aware: *when to sell* vs *when to buy*) | ✅ | ✅ |
| National Impact + eNAM policy benchmark | ✅ | ✅ |

Enforcement is two-layered: the navbar renders only that role's tabs, **and** an RBAC guard in the app shell snaps any disallowed state back to the role's home — a buyer cannot reach the farmer portal even by forcing state.

### 🛒 Buyer Marketplace
- **B2C + B2B modes** — household retail baskets or bulk FPO procurement
- **Transparent price breakdown** — tap any crop to see exactly where your rupee goes (farmer 85% · platform+logistics 10% · dispute buffer 5%) vs the traditional chain
- **Escrow-protected checkout** — funds lock in a hash-chained ledger, release only after OTP-verified delivery
- **Order lifecycle** — Waiting Confirmation → In Transit → Delivered, with **cancel + instant escrow refund** while funds are locked
- 16+ crops (onion, tomato, cauliflower, okra, brinjal, Ooty carrot, Kodaikanal GI garlic…) with batch traceability, GI tags, shelf-life and cold-chain flags

### 🌾 Farmer/FPO Portal
- **List New Crop** with ask-price vs mandi-rate comparison
- **Live earnings dashboard** — gross/net earnings and *Extra Profit vs Mandi* are **computed dynamically** from real orders and escrow release events (not static numbers)
- **AI sell advisories** — "hold onions 5 days, +24% expected" from the forecast engine

### 🚚 Logistics
- PostGIS-style **DBSCAN farmgate clustering** (Haversine metric)
- **VRPTW route optimization** (OR-Tools algorithm family) → milk-run manifests → **~65% fuel saving** per cluster
- Live Leaflet map, reefer cold-chain tracking, dispatch simulation

### 🔮 AI Demand Forecasting (role-aware)
- **Prophet-style additive decomposition**: `y(t) = trend + weekly seasonality + festive shocks` with 80% confidence bands (Navratri/Diwali spikes)
- **Farmer view**: *when to sell* — hold/liquidate advisories per commodity
- **Buyer view**: *when to procure* — "procure now, prices rising" / "wait, softening" — derived from the same signal
- Agmarknet ingestion pipeline schema included

### 🗣️ वाणी AI — Multilingual Voice Assistant
Floating mic button (bottom-right, on every page) that **first asks which language you speak**, greets you aloud in it, then handles price/route/forecast/listing queries — speaking its answers back in that language (TTS with correct locale: `hi-IN`, `mr-IN`, `pa-IN`, `ta-IN`, `te-IN`).

### 🌐 Full Internationalization — 6 Languages
**English · हिन्दी · मराठी · ਪੰਜਾਬੀ · தமிழ் · తెలుగు**
Every page, modal, toast, button and voice reply follows the chosen language instantly — 300+ translated keys. Language is chosen at login and switchable in the header anytime.

### 🧾 Trust Infrastructure (the judge-differentiator)
- **Hash-chained, append-only escrow ledger** — tamper-evident; any mutation breaks the chain (verified by tests)
- **Idempotent checkout** — retries never double-lock funds
- **Hash-chained DoCA audit trail** for regulatory oversight
- **eNAM benchmark** — "why we beat eNAM" policy comparison (inside Impact page)

---

## 🏗️ Architecture

```
┌──────────────────────── React 19 SPA (code-split) ───────────────────────┐
│  Login gate → role-scoped portals: Buyer · Farmer · Logistics ·          │
│  Forecast · Impact (+ eNAM overlay) · My Orders                           │
│  AppContext: auth, cart, escrow orders, i18n (6 lang), backend sync       │
│  In-browser engines: price breakdown · Prophet math · DBSCAN · VRPTW      │
└──────────────────────────────────┬────────────────────────────────────────┘
                                   │ REST /api/v1 (4s timeout, graceful fallback)
┌──────────────────────────────────▼────────────────────────────────────────┐
│  FastAPI backend (backend/main.py)                                        │
│  • Auth: OTP issue + verify (demo 4321) with audited sessions             │
│  • Listings + transparent price-breakdown API      (FR-M4)                │
│  • Idempotent checkout → 85/10/5 escrow split      (FR-C2/C3)             │
│  • Hash-chained append-only escrow ledger          (§9 tamper-evident)    │
│  • OTP-verified delivery → escrow release          (FR-C5)                │
│  • VRPTW solver endpoint (greedy feasible NN)      (FR-L3)                │
│  • Prophet additive forecast endpoint              (FR-A1/A2)             │
│  • National impact + eNAM benchmark endpoints      (FR-I1/I2)             │
│  • Hash-chained audit trail for DoCA oversight     (FR-I3)                │
│  Python engines: engines.py (VRPTW + forecast) · ledger.py · models.py    │
└───────────────────────────────────────────────────────────────────────────┘
```

**API surface:** `POST /api/v1/auth/otp` · `POST /api/v1/auth/verify` · `GET /api/v1/health` · `POST/GET /api/v1/listings` · `GET /api/v1/listings/{id}/price-breakdown` · `POST /api/v1/cart/checkout` · `POST /api/v1/orders/{id}/confirm-delivery` · `GET /api/v1/farmers/me/dashboard` · `POST /api/v1/logistics/solve` · `GET /api/v1/forecasts/{commodity}` · `GET /api/v1/impact/national` · `GET /api/v1/impact/enam-comparison` · `GET /api/v1/admin/audit` · `GET /api/v1/admin/ledger`

Interactive docs: **`http://localhost:8000/docs`** (Swagger UI).

---

## 🚀 Quick Start

**Prerequisites:** Node 18+ · Python 3.10+

### 1. Frontend
```bash
npm install
npm run dev          # http://localhost:5173
```

### 2. Backend (API + escrow ledger + AI engines)
```bash
pip install -r backend/requirements.txt
npm run backend      # http://localhost:8000 — Swagger docs at /docs
```
Start the backend **first**; its health endpoint confirms the ledger chain:
`curl http://localhost:8000/api/v1/health` → `{"status":"ok","ledger_chain_valid":true}`

> The frontend **auto-detects** the backend. With it running, checkout uses the real hash-chained escrow ledger; without it the app degrades gracefully to local demo escrow (offline SIH judging is safe).

### 3. Log in & explore
Any name + 10-digit mobile, OTP **4321**. Choose *Farmer/FPO* or *Buyer* — each opens its own portal.

### Tests
```bash
npm test                                  # 39 frontend unit tests (Vitest)
python -m pytest backend/test_main.py -v  # 15 backend integration tests (pytest)
```

### Production build
```bash
npm run build       # code-split output in dist/ (~109 KB gzipped initial)
npm run preview
```

---

## 📁 Repository Layout

```
├── src/
│   ├── i18n.js               # 300+ keys × 6 languages (single source of truth)
│   ├── pages/                # Login, BuyerMarketplace, FarmerDashboard,
│   │                         # MyOrders, Logistics, AIForecast, Impact (lazy-loaded)
│   ├── components/           # Navbar, VoiceFab, VoiceAssistantModal,
│   │                         # Cart/Checkout, AddCrop, Traceability, QualityAssay,
│   │                         # Razorpay, NotificationGateway, PriceBreakdown modals
│   ├── context/AppContext.jsx # auth, cart, escrow orders, toasts, i18n, RBAC
│   ├── services/api.js       # REST client with timeout + offline fallback
│   ├── utils/                # Pure engines (all unit-tested)
│   │   ├── aiForecast.js        # price-breakdown + advisories
│   │   ├── prophetEngine.js     # additive decomposition
│   │   ├── postgisCluster.js    # DBSCAN + Haversine
│   │   ├── ortoolsBridge.js     # VRPTW solver
│   │   └── routeOptimizer.js    # milk-run optimization + savings math
│   └── data/mockData.js      # 16+ seed listings, clusters, farmer profiles
├── backend/
│   ├── main.py               # FastAPI app — all /api/v1 endpoints incl. auth
│   ├── models.py             # Pydantic models (money in paise, validation)
│   ├── ledger.py             # Hash-chained append-only escrow ledger
│   ├── engines.py            # Server VRPTW solver + Prophet forecast
│   ├── test_main.py          # 15 pytest integration tests
│   ├── agmarknet_ingest.py   # Agmarknet/data.gov.in feed schema
│   ├── prophet_forecast.py   # standalone forecast reference
│   └── vrp_solver.py         # stdlib VRPTW fallback (offline evals)
├── public/img/               # Local authentic farmer portraits + vegetable photos
│                             # (offline-safe demo, no external rate limits)
├── docs/REQUIREMENTS.md      # Full production-grade spec (§1-§14)
├── DESIGN.md                 # "Editorial Harvest" design system
├── DEMO_GUIDE.md             # 7-minute judge walkthrough script + Q&A prep
└── index.html
```

---

## 🎨 Design System — "Editorial Harvest"

Inspired by Indian agricultural mandarins and newspaper mastheads (per the `nexu-io/open-design` skill):

- **Ink + paper palette** — near-black ink strips, warm paper background, field-green primary, gold reserved for escrow, terracotta for gains
- **Serif display (Fraunces)** for headlines & ₹ numerals; grotesk for UI
- **Hairline dividers, uppercase tracked labels, rectangular CTAs** — no gradients, no rounded-pill buttons
- One consistent token system across every persona portal

---

## 🔑 Key Engineering Guarantees

1. **Escrow integrity** — every order's split (85% farmer / 10% platform / 5% dispute buffer) sums exactly to the total; ledger invariants verified by tests.
2. **Idempotency** — checkout retries with the same `idempotency_key` never double-lock funds; OTP re-confirmation is a no-op after release.
3. **Tamper evidence** — both the escrow ledger and the audit trail are hash-chained; any mutation breaks verification (tested).
4. **Never pay below ask** — model validation rejects listings where platform price < farmer price.
5. **Graceful degradation** — backend down or offline? The UI switches to local demo escrow automatically.
6. **Rural-network performance** — code-split personas, ~109 KB gzipped initial route, 4s API timeouts, local images (zero external requests).

---

## 🎤 SIH 2026 Judge Demo Flow (5 min)

1. **Login gate** — pick తెలుగు or हिन्दी → the *entire* app follows → choose Buyer.
2. **Buyer** — browse → transparent price breakdown (farmer gets 85% of your rupee) → checkout → escrow locked → My Orders → tracking → cancel (refund demo).
3. **Farmer** (new session, same language) — List Crop → dynamic earnings move as escrow releases → AI sell advisory.
4. **Logistics** — DBSCAN zones → solve VRP → 65% fuel saving → dispatch simulation.
5. **Forecast** — festive CI bands; farmer "sell now" vs buyer "procure now" advisories.
6. **Impact** — national metrics + eNAM benchmark + hash-chained DoCA audit trail.
7. **वाणी AI** — tap the floating mic → it asks your language → ask "tomato price?" → spoken answer + navigation.

---

## ✅ Verification

| Check | Status |
|---|---|
| Frontend unit tests (Vitest) | ✅ 39/39 |
| Backend integration tests (pytest) | ✅ 15/15 |
| Lint (oxlint) | ✅ 0 errors |
| Production build | ✅ code-split, no chunk warnings |
| i18n coverage | ✅ 6 languages, every surface |

---

## 🗺️ Roadmap (post-hackathon)

- Real payment gateway integration (Razorpay production keys) + UPI collect
- Actual PostGIS + pgRouting deployment; FPO onboarding with DigiLocker KYC
- Live Agmarknet/data.gov.in ingestion with scheduled jobs
- WhatsApp Business API for the notification gateway
- Offline-first PWA with service-worker caching for low-connectivity taluks

---

Built with ❤️ for Indian farmers and consumers — **KrishiSetu Team, SIH 2026**.
