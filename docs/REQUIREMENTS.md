# KrishiSetu 2.0 (कृषि सेतु) — Production-Grade Requirements Specification

**Smart India Hackathon 2026 · Problem Statement ID: 26033**
**Title:** *Multiple intermediaries reduce farmers' earnings and increase consumer prices*
**Organization:** Ministry of Consumer Affairs, Food & Public Distribution
**Department:** Department of Consumer Affairs (DoCA)
**Category:** Software | **Theme:** Agriculture, FoodTech & Rural Development

| Doc Version | Date | Author | Status |
|---|---|---|---|
| 1.0 | 2026-09-14 | KrishiSetu Team | Draft for Review |

---

## 1. Problem Analysis

### 1.1 The Core Problem
India's agri-supply chain has **4–6 intermediary layers** between a farmer and the end consumer:

```
Farmer → Village Aggregator → APMC Mandi (commission agent/dalal)
      → Wholesaler → Semi-wholesaler → Retailer → Consumer
```

Consequences (nationally documented):
- **Farmer's share of the consumer rupee: only 25–35%** for perishables.
- **Consumer pays 60–100%+ above farmgate price** in metros.
- **Post-harvest losses: 5–13%** (₹1.5 lakh crore+/year), driven by fragmented transport, multiple handling, and no cold chain.
- **Price volatility:** farmers sell at gluts (no demand visibility); consumers pay peak prices (no supply smoothing).
- **eNAM limitation:** eNAM digitizes *mandi-to-mandi wholesale* — it does not connect farmgate to the end consumer, does not handle last-mile physical logistics, and still relies on commission agents.

### 1.2 Root Causes the Platform Must Attack
| # | Root Cause | KrishiSetu Countermeasure |
|---|---|---|
| RC1 | No direct market access for smallholders | B2C + B2B digital marketplace with verified farmer/FPO listings |
| RC2 | Fragmented smallholder volumes → high per-kg logistics cost | AI milk-run clustering (PostGIS DBSCAN) + VRP route optimization (OR-Tools) |
| RC3 | No demand visibility → gluts and distress sales | Prophet-based demand & price forecasting with harvest/sell advisories |
| RC4 | Trust deficit: quality disputes, payment delays | Digital assaying, escrow with OTP-verified release, batch traceability |
| RC5 | Price opacity | Transparent price-breakdown UI showing every rupee |
| RC6 | Language/digital-literacy barriers | 5-language vernacular UI + voice assistant + SMS gateway |
| RC7 | Payment risk to farmers | Escrow (85% split), dispute buffer, UPI/NEFT direct payout |

### 1.3 Success Metrics (KPIs)
| KPI | Baseline | Target |
|---|---|---|
| Farmer share of consumer rupee | 25–35% | **≥ 85%** |
| Farmer income uplift | — | **+70% vs mandi modal price** |
| Consumer price savings | — | **20–30% vs retail** |
| Logistics cost per kg | fragmented baseline | **−65%** (milk-run consolidation) |
| Transit spoilage | 8.4% | **≤ 1.5%** |
| Escrow payout time post-delivery | days/weeks | **< 1 hour** |
| Route optimization time (demo scale) | — | **< 2s** for ≤ 200 stops |

---

## 2. Users & Personas

| Persona | Description | Key Jobs-to-be-Done |
|---|---|---|
| **P1 — Farmer / FPO** | Smallholder or producer-org listing produce | List crops, see fair-price benchmarks vs mandi, get AI sell/hold advisories, track escrow payout, get SMS alerts in own language |
| **P2 — Consumer (B2C)** | Household or residential society group-buying | Browse verified produce, compare prices vs retail, trace origin, pay securely, receive delivery with OTP |
| **P3 — Bulk Buyer (B2B)** | Processors, caterers, hostels, institutions | Bulk orders with contract pricing, quality-grade assurance, scheduled logistics |
| **P4 — Logistics Dispatcher** | Fleet/hub operator | Run cluster aggregation, solve VRP routes, assign reefer EVs, track cold-chain, confirm pickups |
| **P5 — Policy / Admin (DoCA)** | Ministry observer | National impact dashboard: farmer-gain map, savings, intermediary elimination, eNAM comparison, audit logs |

---

## 3. Scope

### 3.1 In Scope (Prototype → Production Path)
1. Multi-persona digital marketplace (B2C + B2B) — farmgate listings with transparent pricing.
2. Farmer & FPO portal: listing management, earnings dashboard, escrow tracker.
3. Logistics module: DBSCAN farmgate clustering, OR-Tools VRPTW solving, live map (Leaflet), milk-run manifests, reefer/cold-chain status.
4. AI demand & price forecasting (Prophet additive decomposition) with vernacular advisories.
5. Escrow-protected checkout (Razorpay Route 85/10/5 split), OTP-verified delivery, dispute buffer.
6. Quality assaying workflow (digital gate-pass, computer-vision produce grading).
7. Traceability (batch code → farm → route → delivery OTP).
8. National impact dashboard with eNAM comparison.
9. Agmarknet/data.gov.in mandi price ingestion pipeline.
10. Vernacular UI (en/hi/mr/pa/ta), voice assistant, SMS + WhatsApp notification gateway.

### 3.2 Out of Scope for Prototype Phase
- Actual payment capture (Razorpay in demo/sandbox mode only).
- Real fleet telemetry/telematics hardware integration.
- Regulatory compliance filings (FPO KYC verification against actual registries — stubbed).

---

## 4. Functional Requirements

### 4.1 Marketplace & Discovery (FR-M)
- **FR-M1** The system SHALL display all active crop listings with farmer details, price, grade, quantity, harvest date, shelf life, and photos.
- **FR-M2** Users SHALL search by crop name, village, district, or category; filter by category and organic certification.
- **FR-M3** Users SHALL switch between B2C (retail/society group-buy) and B2B (institutional bulk) modes; B2B mode SHALL surface `minOrderBulk` thresholds and bulk pricing.
- **FR-M4** Every listing SHALL offer a **Transparent Price Breakdown** modal comparing: mandi modal price → traditional intermediary chain → KrishiSetu direct chain, with farmer-share-of-rupee %, farmer gain %, and consumer savings %.
- **FR-M5** Every listing SHALL offer **origin traceability**: farm profile, coordinates, FPO, batch code, storage condition.

### 4.2 Cart, Checkout & Escrow (FR-C)
- **FR-C1** Buyers SHALL add items with quantity (kg) and mode; cart SHALL aggregate quantities per crop.
- **FR-C2** Checkout SHALL create an order with: unique ID, itemized farmer price vs platform price, total, escrow status, delivery OTP, estimated arrival.
- **FR-C3** Payment SHALL route through escrow: **85% farmer share / 10% platform+logistics / 5% dispute buffer** (Razorpay Route in production; simulated in prototype).
- **FR-C4** Orders SHALL progress through escrow states: `LOCKED_IN_ESCROW → QUALITY_VERIFIED → RELEASED_TO_FARMER`.
- **FR-C5** Delivery confirmation SHALL require the buyer-side **delivery OTP**; upon verification, escrow SHALL auto-release to the farmer's UPI/bank account.
- **FR-C6** Farmers SHALL see all pending escrow amounts and release status on their dashboard.

### 4.3 Farmer / FPO Portal (FR-F)
- **FR-F1** Farmers SHALL list new produce: crop, variety, quantity (quintals), farmer price, mandi benchmark, grade, organic cert, batch code, storage, photos.
- **FR-F2** Dashboard SHALL show: active listings, sold volume, earnings, escrow-in-transit, price-gain vs mandi per crop.
- **FR-F3** Farmers SHALL receive AI advisories (sell now / hold N days) with projected price and confidence, generated per crop.
- **FR-F4** All critical alerts (order placed, pickup scheduled, escrow released) SHALL be sent via SMS/WhatsApp in the farmer's selected language.

### 4.4 Logistics & Route Optimization (FR-L)
- **FR-L1** The system SHALL ingest farmgate pickups (location, crop, weight, crates, ready-time window) for a hub region.
- **FR-L2** The system SHALL run **DBSCAN spatial clustering** (epsilon km, minPts) to group nearby farmgates into milk-run zones and display geofenced buffers on a map.
- **FR-L3** The system SHALL solve a **VRPTW** (time windows, vehicle capacity, service times) and produce an ordered manifest with arrival/departure times, cumulative load, and capacity utilization.
- **FR-L4** Dispatcher SHALL toggle optimized vs unoptimized (traditional fragmented) routes and see comparative KPIs: distance, fuel cost, transit time, spoilage rate, CO₂.
- **FR-L5** Dispatcher SHALL assign vehicle capacity (e.g., 10T reefer EV) and re-solve; solver MUST return in < 2s for demo scale.
- **FR-L6** Dispatch simulation SHALL animate route execution with stop-by-stop status and console-style solver log.

### 4.5 AI Forecasting (FR-A)
- **FR-A1** For each tracked commodity, the system SHALL produce a 15-day history + 30-day projection of mandi modal price using additive decomposition: `y(t) = g(t) + s(t) + h(t) + ε(t)` (trend, weekly seasonality, festive/rainfall shocks, error).
- **FR-A2** Projections SHALL include an 80% confidence band and mandi arrival volume (inverse elasticity).
- **FR-A3** Each commodity SHALL show driving factors with quantified impacts (festive spike, regional supply shocks, freight costs).
- **FR-A4** Advisories SHALL be actionable and language-localized; prototype must clearly label projections as model output.
- **FR-A5** In production, the backend SHALL ingest real Agmarknet/data.gov.in daily feeds and retrain/refresh forecasts on schedule (daily cron).

### 4.6 Quality & Compliance (FR-Q)
- **FR-Q1** Every pickup SHALL generate a **digital gate-pass** (QR) linking batch code, assayer, grade.
- **FR-Q2** A quality-assaying step (photo/CV-assisted grading) SHALL precede escrow release; disputes freeze the 5% buffer.
- **FR-Q3** Listings SHALL carry certification flags (organic/Jaivik Bharat, GI tags) verified at onboarding.

### 4.7 Notifications & Accessibility (FR-N)
- **FR-N1** The system SHALL support 5 languages (English, Hindi, Marathi, Punjabi, Tamil) across all primary navigation and key CTAs.
- **FR-N2** A voice assistant SHALL accept spoken commodity-price queries (Web Speech API in prototype; vernacular NLU in production).
- **FR-N3** Notification gateway modal SHALL demonstrate Twilio/MSG91 SMS templates per event type per language.
- **FR-N4** Toast notifications SHALL auto-dismiss and be screen-reader friendly (aria-live).

### 4.8 Impact & Governance (FR-I)
- **FR-I1** National impact dashboard SHALL aggregate: farmer payouts, consumer savings, intermediary margin eliminated, CO₂ saved, spoilage avoided — shown nationally and per state.
- **FR-I2** The system SHALL provide an **eNAM comparison** explaining architectural differentiation (farmgate→buyer vs mandi→mandi) with quantitative benchmarks.
- **FR-I3** All escrow transitions and dispatch events SHALL be audit-logged (immutable, timestamped) for DoCA oversight.

---

## 5. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | **Performance** | P95 page interactive < 2.5s on 3G-class rural networks; bundle ≤ 300 KB gzipped initial route (code-split Leaflet/Recharts). |
| NFR-2 | **Performance** | VRP solver < 2s for ≤ 200 stops; forecast generation < 500ms. |
| NFR-3 | **Availability** | ≥ 99.5% uptime; graceful degradation to cached prices if Agmarknet feed is down. |
| NFR-4 | **Scalability** | Stateless API services; horizontally scalable; support 1M listings, 100k concurrent demo users. |
| NFR-5 | **Security** | AADHAAR-masked KYC at onboarding; PCI-DSS SAQ-A via tokenized payments (no card data touches servers); OWASP ASVS L2; rate limiting; audit logs. |
| NFR-6 | **Security** | OTP and escrow operations require signed, short-TTL tokens; all financial state changes idempotent. |
| NFR-7 | **Privacy** | Data residency in India (MeitY empanelled cloud); farmer PII encrypted at rest (AES-256); DPDP Act 2023 compliance. |
| NFR-8 | **i18n** | All user-facing strings via translation dictionary; fonts support Devanagari/Gurmukhi/Tamil; RTL not required. |
| NFR-9 | **Reliability** | Solver fallback (pure-algorithmic nearest-neighbour) if OR-Tools service unavailable — already implemented; must be preserved. |
| NFR-10 | **Observability** | Structured logs, request tracing, solver/forecast metrics dashboards, alerting on escrow state anomalies. |
| NFR-11 | **Accessibility** | WCAG 2.1 AA; touch targets ≥ 44px; works on low-end Android (Chrome 90+). |
| NFR-12 | **Maintainability** | ≥ 70% unit test coverage on pricing/escrow/solver logic; CI typecheck+lint+build gates. |

---

## 6. System Architecture

### 6.1 Current (Prototype) Architecture
```
┌────────────────────────── React 19 + Vite SPA ──────────────────────────┐
│  Personas: Buyer · Farmer · Logistics · AI Forecast · Impact            │
│  State: AppContext (crops, cart, orders, escrow, toasts, i18n)          │
│  Engines (in-browser JS): price breakdown · Prophet decomposition       │
│                           DBSCAN clustering · VRPTW nearest-neighbour   │
│  Maps: Leaflet + react-leaflet   Charts: Recharts   UI: Tailwind        │
└──────────────────────────────────────────────────────────────────────────┘
         ▲ mirrors
┌────────────────────────── Python reference services ────────────────────┐
│  backend/agmarknet_ingest.py   — data.gov.in feed schema + simulation   │
│  backend/prophet_forecast.py   — additive decomposition reference       │
│  backend/vrp_solver.py         — VRPTW fallback solver (stdlib only)    │
└──────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Target Production Architecture
```
Farmers/FPOs ──┐
Consumers ─────┤   PWA (React, code-split, offline cache)
Bulk Buyers ───┘        │ HTTPS/JSON
                        ▼
              ┌── API Gateway (authN/Z, rate limit) ──┐
              │                                        │
   ┌──────────┴──────────┬─────────────┬─────────────┐
   ▼                     ▼             ▼             ▼
 Listing Service    Order/Escrow   Logistics       Forecast
 (Postgres/         Service        Service         Service
  PostGIS)          (Razorpay      (OR-Tools       (Prophet/
   │                 Route,        microservice,   statsmodels,
   │                 idempotent     gRPC)          cron retrain)
   │                 ledger)          │                │
   └────► PostGIS ◄───┘                ▼                ▼
                            Telemetry/OTP events   Agmarknet ingestion
                                       │                (data.gov.in API)
                                       ▼
                        Notification Service (Twilio/MSG91, WhatsApp)
                        Audit Log (immutable, DoCA dashboard)
```

**Stack recommendation:** React 19 PWA · Node (NestJS/Fastify) or FastAPI BFF · PostgreSQL + PostGIS · Redis (queues/cache) · OR-Tools as a separate Python service · object storage for produce images · Docker + K8s · GitHub Actions CI.

### 6.3 Key Data Model (Postgres)
- `users(id, role[farmer|fpo|consumer|buyer|dispatcher|admin], kyc_status, language_pref, …)`
- `farms(id, owner_id, geo GEOMETRY(Point,4326), area_acres, fpo_id, …)`
- `listings(id, farm_id, crop, variety, grade, quantity_kg, farmer_price, platform_price, mandi_benchmark, organic_cert, gi_tag, batch_code, status, harvest_date, storage)`
- `orders(id, buyer_id, mode[B2C|B2B], total, farmer_payout, escrow_status, delivery_otp_hash, created_at, …)`
- `order_items(order_id, listing_id, qty_kg, unit_price, farmer_price)`
- `escrow_ledger(id, order_id, entry_type[LOCK|RELEASE|DISPUTE_HOLD], amount_paise, idempotency_key, actor, ts)` — append-only
- `routes(id, hub_id, vehicle_id, solver_meta_json, total_km, est_fuel_cost, status)`
- `route_stops(route_id, seq, farm_id, eta, etd, load_kg, gate_pass_qr)`
- `price_observations(source[AGMARKNET|MSP], state, district, market, commodity, variety, modal_price_qtl, arrival_qtl, observed_on)` — partitioned by month
- `forecasts(commodity, region, forecast_date, trend, seasonal, holiday, yhat, yhat_lo, yhat_hi, model_version)`
- `audit_events(id, actor, entity, entity_id, action, payload_json, prev_hash, ts)` — hash-chained

---

## 7. API Specification (v1, REST + JSON)

Auth: `Authorization: Bearer <JWT>`; all money in **paise**; all mutating endpoints accept `Idempotency-Key`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/listings?category=&q=&mode=&organic=` | Browse listings |
| POST | `/api/v1/listings` | Farmer creates listing |
| GET | `/api/v1/listings/{id}/price-breakdown` | Transparent margin split |
| GET | `/api/v1/listings/{id}/trace` | Batch traceability chain |
| POST | `/api/v1/cart/checkout` | Create escrow order (returns Razorpay order) |
| POST | `/api/v1/payments/webhook` | Razorpay signature-verified escrow lock |
| POST | `/api/v1/orders/{id}/confirm-delivery` | OTP verify → release escrow |
| GET | `/api/v1/farmers/me/dashboard` | Earnings + escrow summary |
| GET | `/api/v1/farmers/me/advisories` | AI sell/hold advisories |
| POST | `/api/v1/logistics/cluster` | DBSCAN clustering (body: farms, epsilon_km, min_pts) |
| POST | `/api/v1/logistics/solve` | VRPTW solve (body: hub, stops, capacity) |
| GET | `/api/v1/forecasts/{commodity}?horizon=30` | Forecast + CI + factors |
| GET | `/api/v1/impact/national` | Aggregate impact metrics |
| GET | `/api/v1/impact/enam-comparison` | Benchmark data |
| POST | `/api/v1/admin/ingest/agmarknet` | Trigger mandi feed ingestion |

---

## 8. AI/ML Requirements

1. **Demand/price forecasting:** additive model (trend + weekly seasonality + Indian festive/holiday regressors + IMD rainfall shocks); 80% CI; per-commodity-per-region; daily retraining; drift monitoring (MAPE alerting > 15%).
2. **Route optimization:** capacitated VRPTW; objective = minimize weighted sum of travel time + waiting + perishability decay penalty; hard constraints: capacity, time windows; fallback heuristic guaranteed.
3. **Spatial aggregation:** DBSCAN with per-crop epsilon presets; noise points handled as solo stops.
4. **Quality grading (production):** CV model on produce images (grade, defects, ripeness) with human assayer confirmation loop.
5. **Model governance:** every forecast stores `model_version`; projections clearly labeled to end users as estimates.

---

## 9. Security, Privacy & Compliance
- DPDP Act 2023 compliance; consent-led data collection; farmer PII encrypted at rest; masked Aadhaar KYC only.
- PCI-DSS SAQ-A scope: payments fully tokenized via Razorpay; signature-verified webhooks; **idempotency keys on all ledger writes**.
- Hash-chained audit log for escrow + dispatch events (DoCA auditability).
- Role-based access: farmer sees own data; dispatcher sees assigned routes; admin aggregate-only.
- Rate limiting, bot protection, dependency scanning in CI.

---

## 10. DevOps & Delivery
- **CI/CD:** GitHub Actions — lint (oxlint) + typecheck + unit tests + build on every PR; staging auto-deploy; prod gated.
- **Environments:** dev → staging → prod; secrets in vault, never in repo.
- **Containers:** Docker for API services, OR-Tools solver, forecast worker; K8s manifests or compose for SIH demo.
- **Backups:** Postgres PITR; RPO 15 min / RTO 2 h.
- **Monitoring:** Prometheus + Grafana; Sentry for frontend; synthetic OTP/escrow smoke tests.

---

## 11. Testing Strategy
| Layer | Coverage |
|---|---|
| Unit | Price-breakdown math (farmer gain %, savings %), Prophet decomposition math, DBSCAN, VRPTW feasibility (time windows, capacity) |
| Property | Escrow ledger invariants: total locked = farmer payout + platform + buffer; release only after verified OTP |
| Integration | Checkout → webhook → OTP → release happy path; Agmarknet ingestion idempotency |
| E2E | Persona journeys: farmer lists → buyer buys → dispatcher routes → escrow releases |
| Load | 100k concurrent browse; 50 solves/sec |

---

## 12. Delivery Milestones
| Phase | Duration | Deliverable |
|---|---|---|
| P0 — Prototype hardening | Week 1 | Code-splitting, bug-fix pass, seed data freeze, demo script |
| P1 — Persistence | Weeks 2–3 | Postgres+PostGIS schema, API layer replacing mock data, auth |
| P2 — Payments | Week 4 | Razorpay sandbox escrow E2E, idempotent ledger, webhooks |
| P3 — AI services live | Weeks 5–6 | OR-Tools microservice, Prophet service, Agmarknet cron |
| P4 — Hardening | Week 7 | Load tests, security review, observability |
| P5 — SIH Demo Ready | Week 8 | Evaluation-mode demo data, judge walkthrough, pitch deck |

---

## 13. Gap Analysis — Current Codebase vs This Spec

### What already exists and is strong ✅
- Full 6-persona SPA with polished Tailwind UI, 5-language i18n dictionary, toasts, modals.
- Transparent price-breakdown engine (`aiForecast.js`) computing farmer-share-of-rupee, gain %, savings %.
- Working in-browser solvers: Haversine, nearest-neighbour TSP, DBSCAN, VRPTW with time windows & capacity (`routeOptimizer.js`, `postgisCluster.js`, `ortoolsBridge.js`).
- Prophet-style additive decomposition in JS (`prophetEngine.js`) with festive shocks + CI bands.
- Escrow order lifecycle in `AppContext` (lock → verify → release, OTP, payout).
- Python reference implementations (Agmarknet schema, Prophet math, stdlib VRPTW fallback) — good for the "we also built the backend math" story.
- Build passes (`vite build` OK); 0 lint errors.

### Gaps to close for production grade 🔧
| # | Gap | Priority | Reference |
|---|---|---|---|
| G1 | **No persistence/backend API** — all state is in-memory mock data; refresh loses orders/listings | P0-P1 | §6.2, §7 |
| G2 | **No authentication/KYC** — personas are client-side switches | P1 | §5, §9 |
| G3 | **Payments simulated** — Razorpay modal is demo; no real escrow ledger or webhook verification | P2 | FR-C3–C5, §9 |
| G4 | **Frontend "AI" is deterministic mock math**, not trained on real data; Agmarknet ingestion is a hardcoded array, not a live feed | P3 | FR-A5, §8 |
| G5 | **No tests** (0 test files detected) despite pricing/escrow/solver logic being pure and highly testable | P0 | §11 |
| G6 | **Single 978 KB JS chunk** — no code splitting; Leaflet + Recharts loaded upfront; hurts NFR-1 on rural 3G | P0 | NFR-1 |
| G7 | **91 lint warnings** (unused vars/params etc.) | P3 | NFR-12 |
| G8 | No audit log, no observability, no error boundaries | P4 | NFR-10, FR-I3 |
| G9 | Voice assistant / SMS gateway are demo modals, not wired to real APIs | P3-P4 | FR-N2/N3 |
| G10 | README is the default Vite template — no setup, architecture, or demo docs | P0 | §14 |

### Recommended immediate next actions
1. Code-split with `React.lazy` per persona page (fixes G6 in one afternoon).
2. Add Vitest unit tests for `aiForecast.calculatePriceBreakdown`, `prophetEngine`, `postgisCluster.runPostGISDBSCAN`, `ortoolsBridge.runOrToolsVRPTW` (fixes G5; these are pure functions — highest ROI).
3. Rewrite README as a real project document (fixes G10).
4. Stand up a FastAPI/Node BFF + Postgres/PostGIS and swap mock data for API calls (G1–G2).
5. Razorpay sandbox integration with idempotent escrow ledger (G3).

---

## 14. Demo Script (SIH Evaluation Flow)
1. **Buyer persona:** browse → price-breakdown modal ("farmer gets 85% of your rupee vs 28% in mandi chain") → add to cart → checkout → escrow locked, OTP shown.
2. **Farmer persona:** listing + earnings dashboard → AI advisory ("hold onions 5 days, +24% expected") → SMS template preview in Marathi.
3. **Logistics persona:** run DBSCAN → solve VRPTW → show 65% fuel saving vs fragmented trips → dispatch simulation with reefer telemetry.
4. **AI forecast persona:** Prophet chart with Navratri/Diwali festive shocks and CI bands → advisory flip for tomato glut.
5. **Impact persona:** national dashboard + "why we beat eNAM" comparison → DoCA audit-trail slide.
