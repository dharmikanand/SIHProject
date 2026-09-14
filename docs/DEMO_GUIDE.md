# KrishiSetu — Judge Demo Guide (SIH 2026 · PS 26033)

Total time: **7 minutes** (5-min walkthrough + 2-min buffer for questions).
Golden rule: **start the backend FIRST, verify it's green, then touch the UI.**

---

## 0. The Night Before (Checklist)

- [ ] `npm install` and `pip install -r backend/requirements.txt` run clean on the demo laptop
- [ ] `npm test` → 39 passed; `python -m pytest backend/test_main.py -v` → 15 passed
- [ ] `npm run build` succeeds
- [ ] Chrome installed, bookmarks bar pinned: `localhost:5173`, `localhost:8000/docs`
- [ ] Screen recording of the full demo (backup if Wi-Fi/projector dies)
- [ ] This file + `docs/REQUIREMENTS.md` open in tabs
- [ ] Laptop: sleep OFF, notifications OFF (Focus Assist / Do Not Disturb), zoom 110%

**Wi-Fi failsafe:** everything runs on localhost. No internet needed during the demo — maps tiles are the only external call, and the app works without them.

---

## 1. Startup Sequence (do this 10 min before judging)

Open **two terminals** in the project folder:

**Terminal 1 — backend:**
```bash
npm run backend
```
Wait for: `Uvicorn running on http://127.0.0.1:8000`

**Terminal 2 — frontend:**
```bash
npm run dev
```
Wait for: `Local: http://localhost:5173/`

**Verify (30 sec):**
1. Open `http://localhost:8000/docs` — Swagger UI loads, `GET /api/v1/health` → click **Try it out → Execute** → `"status": "ok", "ledger_chain_valid": true`. **Leave this tab open** — judges love it.
2. Open `http://localhost:5173` — marketplace loads.

**Green light check:** in the browser console (F12) on the frontend, there should be no red errors from `/api/v1/health`.

---

## 2. The 5-Minute Walkthrough (say this as you click)

### Minute 0:30 — The Problem (talk over the marketplace hero)
> "Every ₹1 a consumer spends on vegetables, the farmer keeps only 25–35 paise. Four to six middlemen sit in between. eNAM tried to fix this but it's mandi-to-mandi wholesale — the farmer still never meets the end buyer. KrishiSetu is farmgate-to-buyer direct."

Point at the hero stats: **+75% farmer gain, −25% consumer price.**

### Minute 1:30 — Transparent Pricing (THE killer feature)
1. Click **"Transparent Price Breakdown"** on any crop card.
2. Show the two bars: traditional chain (farmer share ~36%) vs KrishiSetu (farmer share ~88%).
3. Say: *"This modal IS our thesis. Every rupee is accounted for — no hidden margins."*
4. Close. Click **"Trace Origin"** briefly — farm profile, FPO, batch code.

### Minute 2:30 — Escrow Checkout (trust infrastructure)
1. Add 2 crops to basket → open basket → **Checkout**.
2. Emphasize: *"Payment doesn't go to us. It locks in escrow — 85% farmer, 10% platform+logistics, 5% dispute buffer. The farmer is paid the moment delivery OTP is verified. This is the #1 reason farmers sell outside mandis today: payment risk."*

### Minute 3:15 — Show the backend proving it (the credibility moment)
1. Switch to the **Swagger tab**.
2. `GET /api/v1/admin/ledger` → Execute.
3. Say: *"Here's the actual escrow ledger — every financial event is a hash-chained entry. If anyone tampers with one rupee, the chain breaks and we know instantly. This is DoCA-auditable by design."*
4. `GET /api/v1/admin/audit` → Execute → *"Same idea for every action on the platform."*

### Minute 4:00 — Logistics & AI Routing
1. Click **Smart Logistics & AI Routing** in the navbar.
2. Click **optimize/solve** — watch the milk-run route draw on the map.
3. Say: *"Five scattered farms, one 10-tonne reefer EV. We cluster farmgates with DBSCAN and solve a Vehicle Routing Problem with time windows — pickups must happen before 9:30 AM or produce wilts. Result: 65% less fuel, spoilage from 8.4% to 1.2%."*
4. Point at the unoptimized-vs-optimized comparison numbers.

### Minute 4:40 — AI Forecast + Vernacular
1. Click **AI Demand Advisory**.
2. Show onion: *"Prophet-style decomposition — trend plus weekly seasonality plus festive shocks. See the Navratri and Diwali spikes with confidence bands. The advisory tells the farmer: hold 5 days, +24% expected."*
3. Show tomato: *"...and here it says sell NOW — supply glut incoming. This is what kills distress sales."*
4. Back on any page: switch language to **मराठी** or **ਪੰਜਾਬੀ** — *"Five languages built in, because the user who needs this most isn't an English speaker."*

### Minute 5:00 — Impact (close strong)
Click **National Impact**.
> "Everything you saw rolls up here: farmer payouts, consumer savings, intermediary margin eliminated, CO₂ avoided — computed live from the ledger, not hardcoded. That's the DoCA dashboard. We beat eNAM because we own the physical layer: clustering, assaying, cold chain, and last mile."

---

## 3. Likely Judge Questions & Your Answers

**Q: "What's real vs mock?"**
> "The frontend engines — pricing math, DBSCAN, VRPTW, Prophet decomposition — are real algorithms running in-browser and mirrored server-side. The backend is a real FastAPI service with a hash-chained escrow ledger, idempotent checkout, and OTP release — all covered by 54 automated tests. What's mocked: payment capture (Razorpay sandbox in production), SMS sending, and the Agmarknet feed is schema-ready but currently seeded."

**Q: "How is this different from eNAM?"**
> "eNAM digitizes APMC wholesale — buyer is still a trader. We connect farmgate directly to consumers and institutions, and we own logistics: DBSCAN pickup clustering, doorstep assaying, reefer fleet. eNAM has no escrow for consumers, no last-mile, no B2C."

**Q: "Why will a farmer trust this?"**
> "Three reasons: (1) price transparency — they SEE the consumer price and their share; (2) escrow — zero payment risk, funds locked before they ship; (3) SMS in their language for every event."

**Q: "Does it scale?"**
> "Architecture is stateless API + Postgres/PostGIS-ready — the ledger and stores are designed to swap from in-memory to Postgres without API changes. VRPTW solves in <2s at 200 stops. That's in the requirements doc, section 6."

**Q: "What about farmer digital literacy?"**
> "Voice assistant, 5 languages, SMS-first notifications, and FPOs act as aggregation points — one FPO onboards 200 farmers."

**Q: "Business model?"**
> "10% platform+logistics fee — visible in the escrow split. Cheaper than the 40–60% intermediary margin it replaces. Farmers win, consumers win, platform is sustainable."

---

## 4. If Something Breaks Live

| Symptom | Fix (say calmly) |
|---|---|
| Backend tab red | `npm run backend` not running — restart Terminal 1. App still works in demo mode (mention graceful degradation — it's a feature!) |
| Frontend blank | Check Terminal 2, hard refresh (Ctrl+Shift+R) |
| Map tiles blank | No internet — tiles are external; route lines and manifests still render |
| Projector dies | Play the backup screen recording |
| Judge asks something you don't know | "Great question — it's in our requirements doc, section 6/13. Short answer: [pivot to strength]" |

---

## 5. The One-Liner Close

> *"KrishiSetu is the only platform where the farmer's 85% is locked in a tamper-evident ledger before the truck leaves, the consumer sees exactly where every rupee goes, and AI decides when to sell — in the farmer's own language."*

Then stop talking and let them click around. Confidence > perfection.
