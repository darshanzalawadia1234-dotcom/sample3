---
name: Polar Operations Deck
colors:
  surface: '#04132c'
  surface-dim: '#04132c'
  surface-bright: '#2c3953'
  surface-container-lowest: '#010d26'
  surface-container-low: '#0d1b34'
  surface-container: '#111f38'
  surface-container-high: '#1c2a43'
  surface-container-highest: '#27354f'
  on-surface: '#d8e2ff'
  on-surface-variant: '#bdc8d1'
  inverse-surface: '#d8e2ff'
  inverse-on-surface: '#23304a'
  outline: '#87929a'
  outline-variant: '#3e484f'
  surface-tint: '#7bd0ff'
  primary: '#8ed5ff'
  on-primary: '#00354a'
  primary-container: '#38bdf8'
  on-primary-container: '#004965'
  inverse-primary: '#00668a'
  secondary: '#89ceff'
  on-secondary: '#00344d'
  secondary-container: '#00a2e6'
  on-secondary-container: '#00344e'
  tertiary: '#ffc174'
  on-tertiary: '#472a00'
  tertiary-container: '#f59e0b'
  on-tertiary-container: '#613b00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#7bd0ff'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c69'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#04132c'
  on-background: '#d8e2ff'
  surface-variant: '#27354f'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  telemetry-display:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.02em
  telemetry-value:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 9px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.12em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-mobile: 0.5rem
  margin: 1rem
  margin-mobile: 0.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system serves the operations deck of extreme-latitude scientific expeditions, polar vessel navigators, and glaciological researchers. The visual tone balances mission-critical tactical clarity with the vast, quiet intensity of the Southern Ocean. It eliminates ambient visual noise to prioritize situational awareness under high-stress maritime conditions, variable ambient lighting (from midnight sun to total polar night), and bridge environments.

The aesthetic fuses **Tactical Technical Minimalism** with **Instrumental Glassmorphism**:
- Low-luminance, abyssal backdrops prevent night-blindness and eye fatigue during prolonged watchstanding.
- Precision lines, 1px radar-graticule guides, and monospaced telemetry values evoke mechanical chronometers, sonar arrays, and high-frequency radar screens.
- Micro-frosted overlays emulate cold glass observation portals, providing visual separation without disconnecting the user from spatial geospatial layers (bathymetry, SAR satellite overlays, vector flow fields).
- Status signposting uses strict marine navigational color codes: glacial cyan indicates nominal operational telemetry; warning amber marks drift drift-corridor convergences; restrained hazard vermilion signifies imminent vessel-iceberg collision vectors and structural hull stress limits.

## Colors

The palette is engineered around dark-adaptation preservation and spectral differentiation of polar oceanographic phenomena:

- **Abyssal Foundation (Base Surfaces):**
  - Surface Deep: `#040914` (Lowest canvas background, deep oceanic trench)
  - Surface Mid: `#081325` (Primary paneling and chart canvas base)
  - Surface Elevated: `#0f1d36` (Control clusters, tactical sidebar modules)
  - Surface Overlay: `rgba(15, 29, 54, 0.72)` (Floating instrument consoles, HUD HUD viewports)

- **Telemetry & Glacial Signals (Primary & Secondary):**
  - Glacial Cyan (`#38bdf8`): Nominal state, active sonar trace, drift track prediction, target acquisitions.
  - Oceanic Blue (`#0ea5e9`): Secondary vector arrows, pack-ice marginal zones, baseline route waypoints.
  - Deep Trench Accent (`#0284c7`): Subsea bathymetry contour lines, passive sensor coverage zones.

- **Polar Alert Tier (Tertiary & Semantic):**
  - Iceberg Caution Amber (`#f59e0b`): High-drift targets, 24h trajectory intersection corridors, floe compaction warnings.
  - Hazard Vermilion (`#ef4444`): Immediate collision alert, bergy bit proximity, hull shear stress threshold violations.
  - Safe Route Emerald (`#10b981`): Validated open leads, polynya channels, anchor points.

- **Luminance & Readability (Neutrals & Content):**
  - Pure Glacial White (`#f0f6fc`): Primary headings, current speed over ground (SOG), bearing indicators.
  - Cold Ice Mist (`#94a3b8`): Descriptive copy, axis titles, secondary status metadata.
  - Polar Dusk (`#475569`): Lat/Long graticule lines, disabled telemetry nodes, dormant sensor channels.
  - Structural Outline (`rgba(30, 41, 59, 0.7)`): 1px structural partitions and telemetry data fences.

## Typography

The typographic hierarchy enforces absolute clarity between narrative operational intelligence and hard scientific readouts.

- **Headline Font (`Space Grotesk`):** Chosen for its structural, forward-leaning geometric character. Used for sector headings, operational status summaries, vessel names, and high-level geographic entities (e.g., *WEDDELL SEA - SECTOR 4*).
- **Body Font (`Geist`):** Delivers clean, unpretentious legibility for operational briefings, risk notes, and multi-line communication logs.
- **Instrument Font (`JetBrains Mono`):** Non-negotiable for all numeric datasets, coordinates (WGS 84 / Polar Stereographic), heading angles, drift velocities, radar cross-sections, and UTC timestamps. It ensures character alignment across vertically stacked tactical readouts, preventing optical jitter during high-frequency data refresh rates. All labels use uppercase styling with expanded letter-spacing to emulate naval avionics displays.

## Layout & Spacing

The control center interface operates on a high-density, screen-filling layout philosophy. Because tactical bridge workstations host ultra-wide multi-display setups alongside ruggedized polar field tablets, the layout avoids unnecessary margins and emphasizes continuous real-time data flow.

- **Grid Architecture:** A 24-column fluid micro-grid on tactical workstations (minimum viewport width 1440px) allowing fine-grained dashboard modularity:
  - Geospatial Cartography View: Spans 14 to 18 columns.
  - Telemetry Telemetry Sidebar: 6 to 8 columns.
  - Bottom Acoustic & Radar Depth Strip: Full-span fluid tray.
- **Form-Factor Adaptations:**
  - **Desktop / Ultra-Wide Console (>= 1440px):** Fixed left nav rail (48px width), fluid map canvas, docked dual-side inspector panels, 12px gutter system.
  - **Bridge Terminal / Field Tablet (768px - 1439px):** Collapsible telemetry panels, single persistent instrument tray, contextual swipe-up hazard cards.
  - **Tactical Handheld (<= 767px):** Single-column stacked stream. Critical navigational heads-up stats (SOG, Drift, CPA/TCPA) pinned permanently to the top 64px viewport band.

## Elevation & Depth

To sustain deep dark-adaptation and prevent ambient light pollution on the ship's bridge, visual hierarchy does not use diffuse, light-scattering drop shadows. Depth is achieved entirely through **dark-tonal stratification, subtle optical refraction, and luminous edge lighting**:

- **Layer 0 (Base Bathymetric Map / Radar Layer):** Flat `#040914`. Non-interactive graticule lines rendered at 15% opacity.
- **Layer 1 (Standard Panels & Structural Docking):** Solid `#081325` with a 1px perimeter outline of `rgba(30, 41, 59, 0.7)`.
- **Layer 2 (Floating Command Consoles & HUD Tools):** Back-illuminated glass panels using `rgba(15, 29, 54, 0.75)` combined with a 12px background blur (`backdrop-filter: blur(12px)`). Outlines brighten to `rgba(56, 189, 248, 0.2)` when containing active focal points.
- **Layer 3 (Modal Overlays, Critical Collision Alert HUDs):** High-opacity background `rgba(4, 9, 20, 0.92)` with an intense inner glow border: `0 0 0 1px #ef4444, inset 0 0 16px rgba(239, 68, 68, 0.15)`.

Elevation is communicated strictly as physical closeness to the operator's eye: lower layers are opaque and recessed; top layers gain optical glass refraction and crisp accent luminescence.

## Shapes

The design system employs a **Soft Technical (`roundedness: 1`)** geometry. 

- Core containers, panels, and telemetry cells feature subtle 4px (`0.25rem`) corner rounding, matching precision-milled aluminum marine instrumentation.
- Floating HUD badges and modal sheets utilize `rounded-lg` (8px / `0.5rem`).
- Sharp 0px corners are reserved strictly for crosshair reticles, dynamic polygon bounding boxes around identified icebergs, and spatial vector markers to emphasize geometric exactness.
- Pill shapes are prohibited across the system to prevent a casual or consumer-software tone; data indicators must convey structural rigor.

## Components

### Buttons & Trigger Controls
- **Tactical Action Button:** Default state uses `bg-surface-elevated` (`#0f1d36`) with a 1px border of `rgba(56, 189, 248, 0.3)` and uppercase `JetBrains Mono` label (`label-md`). Hover transitions to a low-intensity cyan flood (`rgba(56, 189, 248, 0.1)`) and border `#38bdf8`.
- **Primary / Engage Button:** High-visibility glacial cyan fill (`#38bdf8`), text `#040914` with font-weight `600`. Active/press state darkens to `#0ea5e9`.
- **Emergency / Hazard Override:** Border `#ef4444`, background `rgba(239, 68, 68, 0.15)`, text `#ef4444`. Pulsing 1px outline during urgent unacknowledged state.

### Telemetry & Metadata Chips
- Encapsulated within 22px height bounds. Background is `rgba(8, 19, 37, 0.9)` paired with a 1px border.
- Layout: Fixed monospace prefix (e.g., `CONC:` or `THICK:`) in `Polar Dusk` (`#475569`) followed by the live sensor value in `Glacial White` or `Glacial Cyan`.

### Telemetry Lists & Data Grids
- Tabular data renders in alternating zebra rows of `transparent` and `rgba(15, 29, 54, 0.4)`.
- Row height: 28px (compact) to 36px (standard).
- Hover states add an edge marker: a 2px vertical cyan line along the left border to guide the eye across wide coordinate tables without disrupting dark adaptation.

### Inputs & Vector Fields
- Recessed background `#040914` with 1px border `rgba(71, 85, 105, 0.5)`. Text in `JetBrains Mono`.
- Active focus state: border shifts to `#38bdf8` accompanied by a localized faint glow (`box-shadow: 0 0 8px rgba(56, 189, 248, 0.2)`).
- Clear coordinate step controls (+ / -) sized for gloved touch on rugged bridge screens (minimum 44x44px hit-target boundaries).

### Checkboxes, Radios, & Layer Toggles
- Custom square checkboxes (14x14px) with 1px slate-600 borders. Checked state features a centered 6x6px icy cyan square dot (not a checkmark), simulating digital hardware matrix toggles.
- Layer visibilities (e.g., SAR Ice Imagery, Scatterometer Wind Vectors) use illuminated toggle buttons with a 4px green or cyan LED-style micro-indicator pip on the right edge.

### Instrument & Target Cards
- Standard cards feature a top title ribbon with `label-sm` technical tags, target identification (e.g., `TARGET A-76A`), and a right-aligned live ping indicator.
- Internal layout uses a strict key-value grid system: keys in `Cold Ice Mist` (`#94a3b8`), values right-aligned in `telemetry-value`.

### Specialized Polar System Components
- **Vector Drift Indicator:** Graphical widget showing heading vs. true current drift, combining an SVG rose dial with cyan and amber overlay vectors.
- **Ice Concentration Bar:** Segmented 10-tier micro-gauge (WMO egg-code standard) showing tenths (1/10 to 10/10 coverage) with dynamically shifting fills from deep navy to bright pack-ice white.
- **CPA / TCPA Threat Banner:** Persistent pinned banner flashing amber or vermilion when target iceberg Closest Point of Approach falls inside the safety exclusion contour.