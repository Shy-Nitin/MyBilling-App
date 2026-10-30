---
name: Executive Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464554'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777586'
  outline-variant: '#c7c4d7'
  surface-tint: '#5148d7'
  primary: '#2a14b4'
  on-primary: '#ffffff'
  primary-container: '#4338ca'
  on-primary-container: '#c1beff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#00442d'
  on-tertiary: '#ffffff'
  tertiary-container: '#005e40'
  on-tertiary-container: '#66daa8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#100069'
  on-primary-fixed-variant: '#372abf'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  label-numeric:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.02em
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  label-badge:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-dense: 0.5rem
  margin: 1.5rem
  margin-mobile: 0.75rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

The design system marries the unyielding speed and structural precision of high-tier enterprise ERP platforms with a sharp, contemporary voice. Tailored for retail operators, business founders, and modern finance directors, it strips away bureaucratic visual clutter to prioritize density, legibility, and sub-second operational rhythm. 

The aesthetic is 90% modern utilitarian enterprise SaaS: razor-sharp geometry, strict alignment grids, crisp high-contrast data cards, and rapid-entry ergonomic hotkeys. The remaining 10% manifests exclusively through subtle, hyper-confident microcopy cues—punchy acknowledgments ("Let's Cook", "All squared away, Boss", "Run it back") paired with crisp micro-interactions that elevate daily accounting from a chore to a state of flow. Visual noise, saturated decorative illustrations, and emojis are strictly banned in favor of functional Lucide line iconography, precise monospaced tabular figures, and uncompromising information hierarchy.

## Colors

The palette establishes an authoritative, high-efficiency data environment:
- **Primary (`#4338CA` - Electric Indigo):** Anchors operational focus. Reserved for terminal actions, primary submission CTAs, active billing row accents, and high-priority keyboard focus states.
- **Secondary (`#0F172A` - Midnight Slate):** Serves as structural grounding for deep utility navigation, high-contrast metric headers, and secondary toolbar buttons.
- **Tertiary / Success (`#059669` - Emerald):** Denotes positive financial flow, paid status, healthy margins, and reconciled batches.
- **Neutral (`#64748B` - Slate):** Powers structural borders (`#E2E8F0`), secondary metadata, table column headers, and muted label tiers without reducing screen contrast.
- **Domain Accents:**
  - **Pending / Udhar Credit (`#D97706` - Amber):** Highlights outstanding payables, pending settlement cycles, and awaiting approvals.
  - **Overdue / Destructive (`#E11D48` - Rose Crimson):** Alerts to hard stops, unrecoverable deletes, ledger imbalances, and past-due invoices.

Canvas layers default to light mode: an ultra-subtle slate canvas (`#F8FAFC`) hosts stark, brilliant white cards (`#FFFFFF`) framed by disciplined borders (`#E2E8F0`).

## Typography

Typographic scale is calibrated for high information density, rapid scanning, and precision accounting.
- **Primary Typeface (Geist):** Handles all narrative, interface actions, form inputs, and structural hierarchy with mechanical clarity, neutral geometry, and superior vertical metrics.
- **Technical Tabular Typeface (JetBrains Mono):** Mandated across financial totals, ledger line items, POS SKU numbers, currency strings, tax rates, and keyboard shortcut legends (`[F8]`, `[CMD+K]`). `font-variant-numeric: tabular-nums` is globally enforced to maintain perfect visual column alignment during fast numerical entry.
- **Scale Restraint:** Display sizes above 24px are strictly confined to dashboard analytics and daily register overviews. Transaction tables and billing entry grids rely almost entirely on `body-md` (13px) and `label-numeric` (13px) to maximize screen payload without inducing ocular fatigue.

## Layout & Spacing

The layout is built on a 12-column fluid grid system optimized for widescreen desktop cash-counters and multi-pane ERP management:
- **Desktop Architecture (>= 1280px):** Fixed condensed left navigation bar (64px collapsed, 240px expanded), followed by a dynamic dual-pane split: 70% live line-item invoice ledger and 30% persistent right-side payment checkout summary / fast actions panel.
- **Fluid Grid Rhythm:** Columns feature a `1rem` standard gutter, with a specialized `gutter-dense` (`0.5rem`) layout for transaction rows, SKU lookup matrices, and inventory quantity increments.
- **Adaptive Breakpoints:**
  - **Desktop (>= 1024px):** Dual-pane persistent workflow; full keyboard traversal active.
  - **Tablet (768px - 1023px):** Collapsible right drawer for checkout summaries; single-column table layout with sticky bottom checkout dock.
  - **Mobile (< 768px):** Reflows to full-width card streams, replacing horizontal billing sheets with sequential multi-step card entry.
- **Vertical Spacing:** Kept tight using `space-xs` (4px) and `space-sm` (8px) for related form fields and line-item rows, reserving `space-xl` (24px) for major module boundaries.

## Elevation & Depth

Visual separation avoids heavy, muddy drop shadows to maintain razor-sharp operational focus:
- **Baseline Foundation:** Canvas sits at ground level (`#F8FAFC`).
- **Surface Elevation (Cards & Panels):** Elevated via pure white surfaces (`#FFFFFF`) bound by precise, 1px low-contrast structural outlines (`#E2E8F0`). A faint hairline shadow (`0 1px 2px 0 rgba(15, 23, 42, 0.04)`) separates data modules from the canvas.
- **Active Focus & Selection:** High-density table rows and focused inputs drop shadows entirely in favor of high-contrast 1.5px focus rings in Electric Indigo (`#4338CA`) or subtle surface tinting (`#F1F5F9`).
- **Overlays, Command Palettes (`Cmd+K`), & Drawers:** Modal sheets and quick-billing flyouts use pure white backing, crisp borders (`#CBD5E1`), and an ambient directional shadow (`0 12px 32px -4px rgba(15, 23, 42, 0.12)`), backed by a low-opacity dimming backdrop (`rgba(15, 23, 42, 0.4)` with 4px blur).

## Shapes

The design system enforces a disciplined, compact shape language (`level 1 - Soft`):
- **Base Components:** Input fields, buttons, table cell wrappers, and line-item badges utilize `0.25rem` (4px) corner radii. This maintains geometric alignment with tabular data columns and eliminates wasted corner space.
- **Containers & Cards:** Primary invoice modules, drawer containers, and modal dialogs step up to `rounded-lg` (`0.5rem` / 8px).
- **Status Badges & Command Keys:** Keyboard shortcut caps (`[F2]`, `[ESC]`) and status pills use precise `0.25rem` rounding with rigid borders rather than pill geometry to preserve an engineering-grade aesthetic.

## Components

### Buttons
- **Primary Action (e.g., "Charge [F9]", "Let's Cook"):** Solid `#4338CA`, text `#FFFFFF`, font-weight 600, height 36px (POS entry: 40px), padding 0 16px. Inline trailing hotkey badge in semi-transparent white container. Active: `#3730A3`.
- **Secondary Action:** White background, `#0F172A` text, 1px `#E2E8F0` border. Hover: `#F8FAFC`, border `#CBD5E1`.
- **Destructive Action:** Subtle rose tint `#FFF1F2`, `#E11D48` text, 1px `#FECDD3` border. Hover: `#E11D48` solid with white text.
- **Iconography:** Exclusively Lucide icons, stroke-width 1.75px, size 16px.

### Input Fields & Rapid POS Inputs
- **Base Style:** 36px height, pure white background, 1px `#CBD5E1` border, 4px border-radius, font-size 13px. 
- **Keyboard Traversal & Focus:** Active state triggers a 1.5px solid `#4338CA` border with an explicit zero-offset outline.
- **Integrated Unit Badges:** Trailing add-ons (e.g., `PCS`, `KG`, `%`, `USD`) displayed in `label-code` format with subtle slate fill (`#F1F5F9`).

### Tables & Live Billing Sheets
- **Header:** Height 32px, text-transform uppercase, font-size 11px, tracking +0.05em, text `#64748B`, background `#F8FAFC`, border-bottom 1px `#E2E8F0`.
- **Row:** Height 40px default (compact 32px toggleable). Bottom border 1px `#F1F5F9`. Hover: `#F8FAFC`. Active keyboard-selected row: `#EEF2FF` with a 2px left border in `#4338CA`.
- **Numeric Alignment:** All currency, inventory, and discount cells strictly align right using tabular monospaced numbers.

### Status Chips & Badges
- **Paid / Cleared:** Background `#ECFDF5`, text `#065F46`, border 1px `#A7F3D0`.
- **Pending / Udhar Credit:** Background `#FFFBEB`, text `#92400E`, border 1px `#FDE68A`.
- **Overdue / Voided:** Background `#FFF1F2`, text `#9F1239`, border 1px `#FECDD3`.
- **Geometry:** 20px height, 6px horizontal padding, font-size 11px, font-weight 600. No full-pill radius.

### Checkboxes & Radios
- **Checkbox:** 16px square, 3px border-radius, 1.5px `#94A3B8` border. Checked state: `#4338CA` background with white check icon. Focus ring: 2px `#C7D2FE`.

### POS Quick-Key Dock (Domain Component)
- Bottom-anchored or card-level toolstrip rendering essential system shortcuts (`[F1] Add Item`, `[F4] Split Pay`, `[F8] Discount`, `[F9] Print & Finalize`). Rendered with monospaced keyboard cap styles (`#F1F5F9` background, `#334155` text, 1px `#CBD5E1` border).