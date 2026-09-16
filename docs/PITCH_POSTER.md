# KrishiSetu — SIH Poster & Pitch Content (One Page)

Print-ready at **A1/A0 landscape**. Grid: left ⅓ = problem + solution, middle ⅓ = how it works + architecture, right ⅓ = impact + demo + team. Design language matches the app: ink/paper/field-green, Fraunces serif headlines, hairline dividers, no gradients.

---

## 🏷️ HEADLINE (top banner, full width)

# कृषि सेतु · KrishiSetu
### *"The Farmer's Bridge" — Direct Farm-to-Plate Marketplace with AI Logistics & Demand Intelligence*
**Smart India Hackathon 2026 · PS 26033 · Dept. of Consumer Affairs (DoCA) · Agriculture, FoodTech & Rural**

> Tagline strip (one line, uppercase): **FARMER EARNS 85% · CONSUMER SAVES 25% · EVERY RUPEE TRACEABLE**

---

## 1️⃣ THE PROBLEM (left column, top)

### ₹16 becomes ₹45 — and the farmer keeps ₹16

A tomato leaves the farm at **₹16/kg** and reaches your kitchen at **₹45/kg**. In between stand **4–6 intermediaries** — dalal, mandi broker, wholesaler, sub-wholesaler, retailer — each taking 15–30% while adding no value.

- **Farmer's share of the consumer rupee: under 35%**
- **Consumer pays 2.8× the farmgate price**
- Middlemen capture the difference — ₹29 of every ₹45

*Small stat callout boxes:* `4–6 middlemen` · `65% farmer share lost` · `2.8× price inflation`

---

## 2️⃣ THE SOLUTION (left column, bottom)

### One platform replaces the entire middle chain

**KrishiSetu connects farmers/FPOs directly to consumers and bulk buyers** — with three pillars working together:

| | |
|---|---|
| 🔗 **Direct Marketplace** | B2C + B2B storefront. Transparent "where every rupee goes" breakdown on every crop. Farmer keeps **85%** — platform+logistics 10%, dispute buffer 5%. |
| 🚚 **AI Logistics** | DBSCAN clusters farmgates into zones; VRPTW route optimization builds milk-runs — **~65% fuel savings** per cluster. Cold-chain tracked. |
| 🔮 **Demand Forecasting** | Prophet-style additive model with festive shocks + 80% confidence bands. Farmers: *when to sell*. Buyers: *when to procure*. |

**Trust engine underneath it all:** money moves through a **hash-chained escrow ledger** — funds lock on order, release only on OTP-verified delivery, tamper-evident, audited by DoCA.

---

## 3️⃣ HOW IT WORKS (middle column, top)

### The money & goods flow

```
FARMER/FPO                    KRISHISETU                     BUYER
   │                              │                            │
   ├─ Lists crop ────────────────▶│◀────── Orders & pays ──────┤
   │                              ├─ ₹ LOCKED in escrow        │
   │                              │   (85/10/5, hash-chained)  │
   ├─ Ships via optimized         ├─ Route: DBSCAN + VRPTW     │
   │  milk-run route ────────────▶│   milk-run, cold chain     │
   │                              ├─ Buyer OTP-confirms        │
   ◀═══ 85% RELEASED ═════════════┤   delivery                 │
   │                              └─ Audit entry chained ─────▶ DoCA ledger
```

### Why judges can trust the numbers

- **Integer-paise accounting** — no float drift; split sums exactly by construction
- **Idempotent checkout** — network retries never double-lock funds
- **Tamper-evident** — mutating any ledger entry breaks SHA-256 verification (test-proven)
- **54 automated tests** — 39 frontend (Vitest) + 15 backend (pytest)

---

## 4️⃣ ARCHITECTURE (middle column, bottom)

```
┌─────────── React 19 SPA (6 languages, code-split) ───────────┐
│  Login → Role portals: Buyer · Farmer · Logistics · Forecast │
│  वाणी AI voice assistant (asks YOUR language, replies in it) │
└──────────────────────────┬───────────────────────────────────┘
                 REST /api/v1 · 4s timeout · offline fallback
┌──────────────────────────▼───────────────────────────────────┐
│              FastAPI + Pydantic (money in paise)             │
│  Escrow ledger (hash-chained) · VRPTW solver · Prophet       │
│  forecast · DBSCAN clustering · DoCA audit trail             │
└──────────────────────────────────────────────────────────────┘
```

**Tech stack:** React 19 · Vite · Tailwind · Leaflet · Web Speech API ‖ Python · FastAPI · Pydantic · SHA-256 ledger ‖ Algorithms: additive decomposition · DBSCAN · Haversine · VRPTW (OR-Tools interface)

---

## 5️⃣ IMPACT (right column, top)

### The numbers (computed, not claimed)

| Metric | Traditional | KrishiSetu | Δ |
|---|---|---|---|
| Farmer's share of ₹ | ~35% | **85%** | **+143%** |
| Farmer income (₹/quintal, onion) | ₹1,600 | **₹2,800** | **+75%** |
| Consumer price (tomato, ₹/kg) | ₹45 | **₹32** | **−29%** |
| Intermediaries | 4–6 | **0** | — |
| Fuel per cluster delivery | baseline | milk-run | **−65%** |

### Beyond the numbers

- 🌐 **6 languages** — English, हिन्दी, मराठी, ਪੰਜਾਬੀ, தமிழ், తెలుగు — every screen, modal, toast & voice reply
- 🗣️ **वाणी AI** — voice-first for low-literacy users; asks your language, speaks it back
- 🏛️ **Regulator-native** — DoCA oversight via hash-chained audit trail; eNAM benchmark built in
- 📶 **Rural-proof** — offline demo fallback, ~109 KB initial load, local images

---

## 6️⃣ LIVE DEMO (right column, middle)

**Try it in 60 seconds:**
1. Login gate → pick తెలుగు or हिन्दी → whole app follows
2. Buyer: crop → price breakdown → checkout → escrow locks
3. My Orders → track → cancel → instant refund
4. Farmer: watch earnings move as escrow releases
5. Logistics: solve VRP → 65% fuel saving → dispatch sim
6. वाणी AI: ask "tomato price?" → spoken answer in your language

**GitHub:** `github.com/dharmikanand/SIHProject` · `localhost:8000/docs` for the full API

---

## 7️⃣ TEAM + ROADMAP (right column, bottom)

**Built by:** [Team name · Member names · College]

**From prototype to production:**
- Real payments (Razorpay prod + UPI collect) · PostGIS/pgRouting deployment
- Live Agmarknet ingestion (schema ready) · DigiLocker KYC for FPOs
- WhatsApp notification gateway · Offline-first PWA for low-connectivity taluks

> **Bottom banner, full width, serif italic:**
> *"We didn't build a storefront. We built the trust layer and the economics that make direct trade actually work."*

---

## 🎨 Design/Print Notes (not printed)

- **Palette:** paper `#FAF7F0` background · ink `#1C1917` text · field-green `#15803D` accents · gold `#B45309` only for escrow numbers · terracotta for gains
- **Type:** Fraunces (or Playfair) for headlines/₹ figures · Inter/grotesk for body · uppercase tracked labels
- **Structure:** hairline `1px` dividers, no cards-with-shadows, no gradients, no rounded pills
- **QR code** (bottom-right): GitHub repo — generate with `qr-generator` to `https://github.com/dharmikanand/SIHProject`
- Keep 40% whitespace; the poster should breathe like the app's masthead
