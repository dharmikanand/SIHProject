# KrishiSetu — Judge Q&A Battle Card (SIH 2026 · PS 26033)

20 hardest questions judges ask, with technically deep, honest answers.
Rule of thumb: **answer in 3 layers** — the one-liner, the mechanism, and the honest limitation + roadmap. Judges reward candour over bluffs.

---

## Category 1: The AI — "Is it real or fake?"

### Q1. "You say 'AI forecasting'. Did you actually train a model, or is this hardcoded Excel math?"

**Answer:** We implement a real **additive time-series decomposition** — the same statistical model class as Meta's Prophet: `y(t) = g(t) + s(t) + h(t) + ε` — trend, weekly seasonality, festive-event regressors, noise. The engine (`src/utils/prophetEngine.js`, mirrored server-side in `backend/engines.py`) fits the trend by piecewise-linear regression with changepoints, extracts per-weekday seasonal components by averaging, and models festival spikes as explicit regressors — which is exactly why our Diwali onion spike appears on the correct festival date, not a generic "October bump". We publish an **80% confidence interval** from residual variance, so the UI never shows a false-precision point forecast.

**What's honest to say:** the *parameters* are fitted on simulated seed data calibrated to real Agmarknet price ranges (onion ₹8–45/kg seasonal swings, tomato glut cycles). The **ingestion pipeline schema for live Agmarknet/data.gov.in feeds already exists** (`backend/agmarknet_ingest.py`) — swapping simulated history for real history changes zero model code.

**Why not the actual Prophet library?** Two reasons: (1) Prophet ships MATLAB-generated data files and Stan as a dependency — heavy for a demo that must survive offline judging; (2) the *decomposition* is ~200 lines of pure, unit-tested math we can explain line-by-line, which matters more in a 5-minute demo than a black box import.

---

### Q2. "How do you validate the forecast? What's your error metric?"

**Answer:** Two layers. (1) **Statistically**: residuals of the fitted model are checked for structure — if seasonality were missed, residuals would show periodicity. The CI bands are derived from residual standard deviation, so we can say "80% of observed points fell in this band" on the training series. (2) **Operationally**: the forecast feeds a *decision*, and we evaluate decisions, not curves — the sell-hold advisory is scored as "expected gain % if held N days" vs realized, and that number is what the farmer dashboard displays. In production the correct metric would be **MAPE on a walk-forward split** (train on months 1–3, predict month 4, roll forward) — walk-forward, not random-split, because random splits leak future information into time-series models. That evaluation harness is a stated roadmap item.

---

### Q3. "Explain your route optimization. Isn't greedy nearest-neighbor going to give terrible routes?"

**Answer:** The problem is **VRPTW** — Vehicle Routing with Time Windows: each farmgate pickup has a time window (cold chain — cut greens must reach the hub within ~4 hours), each vehicle has a weight capacity, and the depot is the FPO collection center. Our solver (`backend/engines.py`, browser twin `src/utils/ortoolsBridge.js`) is **greedy nearest-neighbor with feasibility pruning**: from the current stop, choose the nearest unvisited farm whose pickup window and vehicle capacity remain satisfiable; backtrack-infeasible. It's mirrored on Google OR-Tools' *interface* (nodes, time windows, capacity matrix, solution object) so swapping in OR-Tools' guided-local-search metaheuristic is a one-line solver change.

**Why greedy is defensible here:** VRPTW is NP-hard; OR-Tools itself only finds near-optimal solutions. But our instance shape saves us — DBSCAN produces compact, well-separated clusters of 6–12 farmgates, and for instances that small the greedy gap vs optimal is typically single-digit percent, while the *savings vs unoptimized* baseline (one truck per farm, the status quo) is ~65% fuel — the number that matters to the business case. We show both numbers honestly: route length, and savings vs baseline, not "optimality %".

**Follow-up if pushed:** "How would you improve it?" → 2-opt segment reversal + Or-opt segment moves as a local-search post-pass, then OR-Tools GLS for production.

---

### Q4. "Why DBSCAN and not k-means for clustering farms?"

**Answer:** Because farm clusters are **agricultural, not geometric**. K-means (a) forces every cluster to be convex-ish around a centroid, (b) requires you to *pre-decide k*, and (c) assigns **every** point to some cluster — including the lone farmhouse 40 km from anyone, which would get its own wasteful route. DBSCAN groups by **density** with an ε-radius in Haversine distance (we use the great-circle formula, not Euclidean — at Indian latitudes 1° longitude ≠ 1° latitude in km), marks low-density outliers as **noise**, and those noise points are exactly what we deliberately attach to the nearest route as outlier-pickups or serve via rider top-up. `src/utils/postgisCluster.js` implements it; minPts and ε are the two honest tuning knobs (we use ε ≈ 8 km, minPts = 3 for village density).

---

## Category 2: Money & Trust — "Can this handle real money?"

### Q5. "Walk me through exactly what happens to ₹100 when a buyer orders."

**Answer:** Every monetary value is an **integer of paise** (₹100 = 10000p) — never floats, because `0.1 + 0.2 ≠ 0.3` in IEEE-754 and an escrow that drifts is a financial scandal. On checkout: (1) the buyer's ₹100 is **locked**, not transferred — escrow status `LOCKED_IN_ESCROW`; (2) the split is computed by integer division with explicit remainder assignment: **85p farmer / 10p platform+logistics / 5p dispute buffer** — the three parts sum to 100p by construction, and a pytest asserts the invariant `LOCK == RELEASE + PLATFORM_FEE + DISPUTE_HOLD` for every order; (3) on **OTP-verified delivery**, the farmer's 85 releases; (4) cancellation before delivery refunds the full lock atomically. The farmer's ask price is a hard floor — validation rejects any listing where platform price < farmer price, so the platform can never subsidize volume by underpaying farmers.

---

### Q6. "Your 'hash-chained ledger' — is that just a buzzword for a database table?"

**Answer:** No — and the difference is **tamper *evidence***. Each ledger entry stores: order data, amount, state transition, `prev_hash`, and `hash = SHA-256(prev_hash ‖ serialized_entry)`. To falsify yesterday's payout entry, you must also recompute every subsequent hash in the chain — and our verifier (`GET /api/v1/admin/ledger`) walks the whole chain and reports `ledger_chain_valid: false` on any mismatch. `test_main.py` **actually mutates an entry and asserts verification fails** — it's a tested property, not a claim.

**What we don't claim:** it's not a blockchain. There's no distributed consensus, so a full database administrator could rewrite the chain *and* the verifier if they controlled everything. The production answer is **periodic anchoring**: hash the ledger head into an external append-only witness (eNAM's ledger, a government timestamping service, or even a newspaper-class public notary) once per hour — then history is tamper-evident even against our own DBA. That's a 50-line cron job on the roadmap, and we can explain precisely why it works.

---

### Q7. "What stops double-spending or double-locking funds when the network retries?"

**Answer:** **Idempotency keys**, the same pattern Stripe uses. Every checkout request carries a client-generated `idempotency_key` (UUID). The backend keeps a registry; a retry with a seen key returns the **original response** without executing a second lock. Same for delivery confirmation — OTP re-submission after release is a no-op, not a second payout. This is tested: checkouts replayed with identical keys produce one ledger entry, not two. In a real deployment the key registry lives in Postgres with a unique constraint — the database enforces it even across concurrent requests racing each other.

---

### Q8. "Where's the payment gateway? Is this Razorpay integration real?"

**Answer:** The checkout flow is gateway-shaped: `CartCheckoutModal` → order creation → escrow lock → `RazorpayModal` UI is a **stubbed instrument layer** over the escrow engine. That's the honest split: the *hard, differentiating* logic (escrow, 85/10/5, hash chain, idempotency, OTP release) is fully implemented and tested; the *card/UPI plumbing* is a sandbox-stub because real integration needs a registered business entity and KYC'd keys — impossible in a hackathon repo, 2 days of work after it. Our architecture keeps them separated: the escrow ledger never talks to the gateway; the gateway just triggers `lock()` and `release()` transitions.

---

### Q9. "How does dispute resolution actually work? Who arbitrates?"

**Answer:** The 5% **dispute buffer** is the economic reserve, and the ledger makes the *state machine* enforceable: an order can transition `LOCKED → DISPUTED`, which freezes the split — nothing releases until resolution. The arbitration itself is deliberately **out of platform scope**: our model is DoCA-regulated, so disputes route to the existing Consumer Affairs grievance machinery (District Consumer Commissions / e-Daakhil), which is the same regime that governs e-commerce today. What we provide is the **evidence layer**: hash-chained quality-assay certificates at listing, pickup photos, GPS-stamped delivery OTP, and an immutable audit trail — so the arbitrator's decision is data-driven and neither side can fabricate history. Platform-mediated arbitration (like Amazon A-to-z) is the commercial roadmap; regulatory routing is the defensible MVP.

---

## Category 3: Security & Auth

### Q10. "OTP 4321 is hardcoded — so your auth is fake?"

**Answer:** The auth *architecture* is real; the SMS channel is stubbed — necessarily, because sending real SMS needs a DLT-registered template and a gateway account. The flow is the production flow: `POST /api/v1/auth/otp` issues an OTP bound to the mobile + TTL, `POST /api/v1/auth/verify` checks it, and **both issue and failure events land in the hash-chained audit trail** (we show a wrong-OTP attempt appearing in the DoCA audit log live). The demo constant `4321` is one line to replace with a 6-digit random + SMS gateway call. We can also speak to what's deliberately out of MVP scope and why: refresh-token rotation, device binding, and rate-limiting the OTP endpoint (which in production must be per-MSISDN throttled to block SMS-pumping fraud).

**Why no passwords?** Deliberate: our users are often first-time smartphone users with vernacular preferences; mobile-OTP is the RBI/UIDAI-normalized identity pattern in India. Passwords would *reduce* security in practice (reuse, sharing).

---

### Q11. "A buyer can just open devtools and force the farmer page. What's your access control really?"

**Answer:** Two layers, and we can demo the second. Layer 1 is UI-level: the navbar renders only the role's surfaces. Layer 2 is the **RBAC guard in the app shell**: on every render, persona-vs-role is checked server-of-truth style, and a disallowed persona snaps back to the role's home — so forcing state doesn't expose data. The honest limitation: in this SPA prototype, *data* still ships in the bundle; the enforceable boundary in production is **server-side** — every `/api/v1` endpoint must take the session token and filter by role (e.g., `GET /farmers/me/dashboard` already scopes to the authenticated farmer's ID — that pattern just extends to the rest). We say this plainly: client-side RBAC is UX; server-side RBAC is security; the API surface is already structured for the latter.

---

## Category 4: Architecture & Engineering

### Q12. "Why two implementations of the same engines (JS in-browser AND Python on server)? Isn't that duplicated logic that will drift?"

**Answer:** Yes, it's duplication — **deliberate, bounded duplication** with a reason: the demo must be **judging-proof**. If venue Wi-Fi dies, the browser engines (Prophet math, DBSCAN, VRPTW, price breakdown — all pure functions under `src/utils/`, 39 Vitest unit tests) keep the full experience alive via graceful degradation: `services/api.js` has a 4-second timeout and silently falls back to local demo escrow. The server mirrors (15 pytest tests) prove the same logic works as a real API. Drift risk is real and we manage it the way you manage any duplicated invariant: **shared golden test vectors** — the same cluster coordinates and price series produce the same outputs in both runtimes, asserted by tests. Production consolidation path: browser engines become progressive-enhancement caching only, server becomes the single source of truth.

---

### Q13. "Why is money in integers? Explain like I'm a CS freshman."

**Answer:** Floats store numbers as binary fractions. ₹0.10 has no exact binary representation — it's stored as something like 0.1000000000000000055. One order is fine; a million escrow operations accumulate drift, and one day `farmer_share + platform_fee + buffer ≠ total`. So all money is **integer paise**. The 85/10/5 split uses integer division with the remainder assigned by explicit rule (e.g., farmer gets the odd paisa): `farmer = amount * 85 // 100; farmer += amount - (farmer + platform + buffer)` — the split sums **exactly by construction**, and a test asserts the invariant for arbitrary amounts. This is why banks, Stripe, and every payment system on earth uses integer minor units.

---

### Q14. "Your frontend state is one giant Context. Why not Redux/Zustand? Doesn't everything re-render?"

**Answer:** AppContext holds auth, language, cart, orders, and toasts — cross-cutting state that ~every component legitimately reads; that's exactly the use case Context exists for. The re-render cost concern is real, and our mitigations are structural: pages are **route-level lazy chunks** (so state updates never re-parse unrelated personas), heavy computations are **memoized pure functions** (`useMemo` over derived stats — the dynamic earnings calculation recomputes only when orders change, not on every keystroke), and modals are separate components so their local state doesn't churn the tree. At this app's scale (~25 screens, low-frequency updates — cart clicks, not mousemove), Context is measurably fine; introducing Redux would add a dependency and boilerplate without solving a measured problem. The migration path if we hit scale: slice the context (AuthContext / CartContext) or adopt Zustand's selector-based subscriptions — a mechanical refactor, not a redesign.

---

### Q15. "How does the app behave when the backend is down? Prove it."

**Answer:** `src/services/api.js` wraps every call in a **4-second AbortController timeout**; on failure the context flags `backendOnline: false` and switches checkout to the **local demo escrow** — same state machine, same 85/10/5, same toasts, silently. No error toast scares the user (we learned this the hard way — an early build showed "Escrow Sync Failed" on demo crops; we fixed it to distinguish server-synced listings from local ones and only escalate errors for genuinely server-side failures). Judges see the identical flow online or offline; the only visible difference is the health dot. This is deliberate architecture — *degrade the tier, never the story*.

---

### Q16. "How would this scale to 100,000 farmers? What breaks first?"

**Answer:** Ordered by what breaks first: (1) **In-memory demo state** — the ledger/listings live in process memory; the very first production change is Postgres with the *same schemas* (Pydantic models map 1:1 to tables), and the ledger's append-only nature makes it an ideal insert-only table partitioned by month. (2) **Synchronous VRPTW solving** — solve requests become Celery/RQ background jobs with progress polling; clustering runs nightly per district, not per request. (3) **Forecast compute** — precompute per-commodity forecasts on a schedule; serving is then a cache read. (4) **The API layer** — FastAPI behind uvicorn workers scales horizontally; it's stateless once state is in Postgres. What *doesn't* break early: the escrow design — append-only ledger + idempotency keys is exactly how you scale financial writes safely. So the scaling story is "boring infrastructure work," not "rearchitect."

---

## Category 5: Product & Domain — "Do you understand farming?"

### Q17. "Farmers don't have reliable internet or smartphones. Who exactly is your user?"

**Answer:** We're precise about this: the primary mobile user is the **FPO (Farmer Producer Organization)** — a registered cooperative of typically 500–2,000 farmers with a manager who has a smartphone, a bank account, and literacy. India has 10,000+ FPOs under the government's FPO scheme — they are the aggregation layer *and* the trust layer (the farmer trusts his cooperative more than any app). The individual farmer interacts through the FPO at the collection center; our **वाणी voice assistant in 6 languages and the offline-tolerant architecture** serve the FPO manager in low-connectivity mandis. The buyer side (consumers, bulk buyers like Haldiram-type processors) is smartphone-native already. This FPO-first go-to-market isn't a dodge — it's how actual agri-tech (DeHaat, Arya) achieved adoption, and our escrow model maps cleanly onto FPO-level settlement.

**Q17b. "What if no farmer trusts your app with their produce?"** — Trust bootstraps through (1) FPO mediation, (2) escrow *visibility*: the farmer sees "₹42,500 LOCKED" before shipping — the vault is the pitch; (3) quality assays at pickup preventing the classic "buyer claims bad quality, pays less" cheat; (4) DoCA's regulatory umbrella — a government-anchored marketplace has credibility a startup can't buy.

---

### Q18. "Why would anyone use this instead of eNAM? What's actually different?"

**Answer:** eNAM is a **digital tender for mandi auctions** — it digitizes the *existing* APMC structure: buyer bids, trade happens at the mandi, the middlemen ecosystem still extracts margin between mandi and plate, and settlement is trader-centric. KrishiSetu changes three structural things: (1) **price transparency *downstream*** — eNAM shows the mandi price; we show the consumer the full "where every rupee goes" breakdown, making middleman margin visible and competitive; (2) **escrow, not credit** — eNAM settlement still leaves farmers bearing payment risk; our hash-chained escrow means the farmer ships only when money is locked; (3) **logistics as a first-class service** — eNAM stops at the mandi gate; our DBSCAN+VRPTW milk-runs move produce from farmgate to buyer at ~65% fuel savings, which is what makes small-lot direct trade economical at all. The Impact page contains our **eNAM benchmark audit** with these deltas quantified — it's a policy argument in the app, and it's the kind of systems thinking DoCA (the department that *runs* eNAM's parent ecosystem) is asking PS 26033 about.

---

### Q19. "Supply and demand on a two-sided marketplace — how do you solve cold start? No buyers, no farmers."

**Answer:** Classic chicken-and-egg; our answer is **seed one side with institutional demand**: (1) Start with **B2B bulk buyers** (processors, caterers, temple/langar networks, hostel canteens) whose demand is contractually predictable — one Haldiram-type anchor buyer = 200 FPOs' worth of listings justified; our B2B mode exists in the product precisely for this. (2) **Geo-narrow launch**: one district, one crop cluster (e.g., Nashik onion) — density beats breadth for logistics economics. (3) The **forecast engine doubles as a liquidity tool**: predicted glut windows (the tomato-crash scenario) are when we recruit buyers with below-retail pricing — sellers are most motivated exactly when our value is most visible. (4) DoCA's regulatory backing and FPO scheme integration provide the credibility a startup lacks. Cold-start for payments/marketplaces is a known science; what we add is that our logistics savings and price transparency give both sides a *quantified* reason to show up on day one.

---

### Q20. "What's the single biggest weakness of your prototype? Be honest."

**Answer (deliver this with confidence — honesty reads as maturity):** Three, ranked. (1) **Simulated data end-to-end**: prices, farmers, and orders are seeded; the models are real, the data isn't — the production unblock is the already-schematized Agmarknet ingestion plus a district pilot. (2) **No persistence layer**: in-memory state means a server restart forgets orders; the Pydantic models are already table-shaped, so Postgres is days, not months. (3) **Server-side authorization isn't uniformly enforced yet** — the API is *shaped* for it (session-scoped endpoints exist), but a production audit would harden every route. What we deliberately did *not* compromise: the financial correctness core — integer-paise accounting, idempotency, the hash-chained ledger invariants, and the OTP-gated release are fully implemented and test-enforced (54 tests across both stacks), because those are the parts where a prototype lie is unforgivable.

**Killer closer if asked "why should you win?":** "Most teams demoed a storefront. We built the two things that make direct trade *actually work* — trust (tamper-evident escrow money) and economics (AI logistics + forecasting that quantifiably beat the mandi chain). Every number on our screen is computed and test-verified, every claim has a mechanism behind it, and every limitation we just told you before you asked."

---

## Rapid-Fire Bonus Answers (30 seconds each)

| Question | Answer |
|---|---|
| "Why React and not Angular/Vue?" | Team fluency + the ecosystem for i18n/maps/speech; state shape (single AppContext) is portable to any framework. |
| "Why FastAPI over Django?" | Pydantic validation at the boundary, auto Swagger for judges, async, and no ORM/ admin baggage we wouldn't use in a 2-week build. |
| "Monolith or microservices?" | Deliberate modular monolith — engines, ledger, API are cleanly separated *modules*; microservices at this scale is resume-driven development. |
| "Where's the database?" | In-memory for the prototype; schemas are Pydantic-defined and map 1:1 to Postgres tables; ledger becomes insert-only partitioned table. |
| "How is the voice assistant free?" | Web Speech API (SpeechRecognition + speechSynthesis) — on-device browser capability, zero cloud, works offline for TTS. |
| "6 languages — how do you maintain them?" | One dictionary file, 300+ keys, English as base; missing keys fall back to English so nothing renders blank; a lint/test can enforce key parity. |
| "What's your unit of testing?" | Pure engines get unit tests (price splits, Haversine, decomposition); API gets pytest integration tests incl. failure injection (tamper, wrong OTP, idempotent replay). |
| "Accessibility?" | Semantic headings, focus-visible states, `prefers-reduced-motion` respected, full keyboard flow, color+text (never color alone) for status. |
| "Offline PWA?" | Roadmap item — service-worker caching of the SPA shell + engines already run client-side; the architecture is offline-shaped by design. |
| "Revenue model?" | The 10% platform+logistics slice — capped, transparent, and *visible to the buyer* (that visibility is the competitive moat vs hidden dalal margins). |
