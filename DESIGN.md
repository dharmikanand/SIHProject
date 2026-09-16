# KrishiSetu — DESIGN.md (Brand Contract)

> Design system for KrishiSetu 2.0 · SIH 2026 · PS 26033.
> Direction committed per the `frontend-design` skill: **one aesthetic, no AI slop.**

## Aesthetic direction: "Editorial Harvest"

A government-gazette-grade editorial canvas — warm ivory paper, ink typography,
hairline rules, and a single deep field-green accent. Think *premium farm journal
meets DoCA policy gazette*, not SaaS dashboard.

**Explicitly banned (anti-slop):** purple/blue gradient glows, glassmorphism blur
cards, rounded-3xl shadow-card rows, decorative blobs, emoji-as-iconography in
headings, interchangeable gradient hero banners.

## Color tokens

| Token | Value | Role |
|---|---|---|
| `--paper` | `#FAF7F0` | Page background (warm ivory) |
| `--paper-2` | `#F1ECE1` | Raised surfaces, wells |
| `--ink` | `#1C1917` | Primary text (warm near-black) |
| `--ink-2` | `#57534E` | Secondary text |
| `--ink-3` | `#A8A29E` | Tertiary/meta text |
| `--hairline` | `#E2DCD0` | 1px rules and borders (NOT shadows) |
| `--field` | `#2D5A3D` | Field green — primary accent, used sparingly |
| `--field-deep` | `#1E3D2A` | Dark green — dark sections, footer |
| `--harvest` | `#C4622D` | Terracotta — farmer/money emphasis, warnings |
| `--gold` | `#B8860B` | Escrow/ledger highlights |

**Rule:** accent covers ≤10% of any viewport. Paper + ink carries the page;
color is earned by meaning (green = farmer gain, terracotta = commerce, gold = escrow).

## Typography

- **Display / numerals:** `Fraunces` (serif, optical size axis) — headlines, big
  stat numbers, prices. This is the memorable quality: serif numerals on ivory.
- **Body / UI:** `Inter` — labels, body, controls (retained for utilitarian clarity).
- **Devanagari & scripts:** `Noto Sans Devanagari` fallback chain (existing).
- Scale: display 44/56 · h2 24/32 · body 14/22 · meta 11/16, tracking +0.06em uppercase for meta labels.

## Layout & components

- Density: editorial. Sections separated by **hairline rules**, not card shadows.
- Radii: `4px` small / `12px` media. Never 24px+ (anti-slop).
- Depth: borders only; shadow reserved for one elevation (modals/dropdowns).
- Buttons: rectangular-ish (6px), uppercase 12px bold for primary CTAs.
- Numerals: tabular-nums everywhere money appears.

## Motion

- 150–250ms ease-out; transforms/opacity only.
- One signature: numbers "settle" with a tiny translateY+fade on mount (respect `prefers-reduced-motion`).
