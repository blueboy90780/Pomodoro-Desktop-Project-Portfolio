---
name: AuraFocus
colors:
  surface: '#131316'
  surface-dim: '#131316'
  surface-bright: '#39393c'
  surface-container-lowest: '#0e0e11'
  surface-container-low: '#1b1b1e'
  surface-container: '#1f1f22'
  surface-container-high: '#2a2a2d'
  surface-container-highest: '#353438'
  on-surface: '#e4e1e6'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#e4e1e6'
  inverse-on-surface: '#303033'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#e29100'
  on-tertiary-container: '#523200'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#131316'
  on-background: '#e4e1e6'
  surface-variant: '#353438'
  canvas-base: '#09090b'
  surface-card: '#121215'
  surface-elevated: '#1c1c21'
  border-subtle: '#27272a'
  border-highlight: '#3f3f46'
  text-primary: '#f4f4f5'
  text-secondary: '#a1a1aa'
  text-tertiary: '#71717a'
  focus-emerald: '#10b981'
  focus-glow: rgba(16, 185, 129, 0.15)
  break-cyan: '#06b6d4'
  break-glow: rgba(6, 182, 212, 0.15)
  pause-amber: '#f59e0b'
typography:
  timer-display:
    fontFamily: JetBrains Mono
    fontSize: 56px
    fontWeight: '300'
    lineHeight: 56px
    letterSpacing: -0.04em
  timer-display-compact:
    fontFamily: JetBrains Mono
    fontSize: 40px
    fontWeight: '300'
    lineHeight: 40px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
  mono-metric:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 14px
  caption:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system establishes a high-performance, distraction-free environment for deep intellectual flow. Built for knowledge workers, developers, and writers running a dedicated desktop utility, the visual identity rejects decorative clutter, bright flashes, and invasive notifications in favor of quiet precision, deep dark surfaces, and subtle luminous feedback.

The aesthetic blends **Modern Technical Minimalism** with tactile, hardware-inspired control surfaces:
- **Atmospheric Darkness**: Pure, calm zinc and obsidian tones that visually recede into the desktop background, reducing eye strain during multi-hour focus sessions.
- **Micro-Luminescent Signals**: Chromatic light is reserved solely for state communication—an organic emerald glow for active focus, a calming cyan for breaks, and subtle warm amber for pause and transitions.
- **Instrument-Grade Tactility**: Sliders, dials, and counters behave with the physical predictability of studio mixing consoles and premium Swiss desktop instruments. Numerals are strictly monospaced and tabular, eliminating layout jitter.

## Colors

The palette is engineered specifically for prolonged, low-light desktop immersion. It anchors itself on deep zinc neutral tiers, reserving saturated spectral hues exclusively for timer status and track states.

- **Primary (`#10b981` / Emerald)**: Designates the active Focus phase, engaged audio tracks, and primary forward actions. Represents momentum, clarity, and sustained mental flow.
- **Secondary (`#06b6d4` / Cyan)**: Designated for Short Break and Long Break phases, providing an immediate cognitive shift from tension to restorative relaxation.
- **Tertiary (`#f59e0b` / Amber)**: Used for pause warnings, session interruptions, and low-priority system badges.
- **Neutral (`#18181b` / Deep Zinc Surface)**: Forms the mid-layer containers, cards, and interactive tracks above the `#09090b` canvas foundation.

### Palette Application Rules
- **Canvas (`#09090b`)**: Window frame background, system title bar, and recessed track slots.
- **Surface Level 1 (`#121215`)**: Mixer cards, bottom audio mini-player, and modal sheets.
- **Surface Level 2 (`#1c1c21`)**: Hover states, active segmented button pills, and floating tooltips.
- **Borders (`#27272a`)**: 1px crisp structural division lines with zero heavy drop-shadows.
- **Emissions & Glows**: Active states emit soft radial halos (`focus-glow` or `break-glow`) using `box-shadow: 0 0 20px -5px [color]`.

## Typography

The typographic hierarchy establishes rigorous visual order for compact desktop utility interfaces.

- **Primary Interface Font**: **Geist** provides sharp, neutral, and highly legible labels, card headings, and navigation triggers. It avoids humanist quirks that cause eye fatigue in dark modes.
- **Data & Numeric Font**: **JetBrains Mono** powers all countdown numerals, session cycles, percentages, and track gain indicators. `font-variant-numeric: tabular-nums` must be enforced across all mono instances to prevent layout shifting as digits cycle.
- **Letter Spacing**: Large displays use tight negative tracking (`-0.04em`) to fuse the timer digits into a unified glyph-like instrument. Metadata labels and status tags use expanded tracking (`+0.06em`) in all-caps for instant glanceability.

## Layout & Spacing

AuraFocus adheres to a fixed-aspect ratio container paradigm tailored for desktop window frames (standard viewport: `420px × 600px` fixed or constrained resize).

### Rhythm & Proportions
- **Base Grid**: A disciplined 4px/8px incremental grid.
- **Canvas Padding (`margin`)**: Fixed at `1rem` (16px) around the app perimeter, providing an intimate framed canvas.
- **Mixer Grid**: 2-column equal-width layout with a `0.75rem` (12px) gutter. Cards maintain a compact vertical footprint to ensure 6-8 tracks remain visible without infinite scrolling.
- **Vertical Partitioning**:
  1. *Top Chrome* (40px): Drag region, traffic controls, preset dropdown, settings trigger.
  2. *Interactive Stage* (380px): Circular countdown timer and action triggers, or 2x3 soundboard grid.
  3. *Docked Master Deck* (64px): Pinned bottom bar housing master volume, active voice indicators, and global mute.

## Elevation & Depth

Visual hierarchy does not use diffuse, dramatic drop shadows that bleed outside window confines. Instead, depth is conveyed through **tonal surfacing**, **hairline inner borders**, and **localized luminescent blooms**.

### Surface Layers
1. **Level 0 (Canvas Base - `#09090b`)**: The app frame window.
2. **Level 1 (Dock & Card Base - `#121215`)**: Sound card tiles, settings drawer background, and bottom dock. Outlined with `1px solid #27272a`.
3. **Level 2 (Active/Hover Cards - `#18181b`)**: Elevated state on track interaction or hovered buttons. Outlined with `1px solid #3f3f46`.
4. **Level 3 (Modals & Overlays - `#1c1c21`)**: Floating menus and preset selector sheets. Bordered with `1px solid #52525b` with a shadow of `0 12px 32px -4px rgba(0, 0, 0, 0.7)`.

### Chromatic Bloom
When a sound track is active or the timer is running, the component emits a crisp, controlled glow:
- **Active Focus**: `box-shadow: 0 0 24px -4px rgba(16, 185, 129, 0.18)`
- **Active Break**: `box-shadow: 0 0 24px -4px rgba(6, 182, 212, 0.18)`
- **Knob/Thumb Handle**: `box-shadow: 0 0 8px rgba(255, 255, 255, 0.35)`

## Shapes

The interface embraces a **Soft Engineering (`roundedness: 1`)** geometry. Radii are modest, measured, and tight, reinforcing the impression of a purpose-built desktop tool rather than a generic touch-first mobile wrapper.

- **Window Canvas**: `rounded-xl` (12px) with macOS/Windows native-like soft bounds.
- **Mixer Cards & Panels**: `rounded-md` (6px) for compact boundary separation.
- **Action Buttons & Inputs**: `rounded-md` (6px) matching mixer panels.
- **Status Tags, Segmented Switches & Slider Thumbs**: `rounded-full` (pill) to communicate fluid toggleability and drag states.

## Components

### 1. Timer Hero & Circular Radial Ring
- **SVG Canvas**: 220px × 220px circular vector center.
- **Track Rail**: 3px stroke with `#27272a`.
- **Active Meter**: 4px stroke in `focus-emerald` (`#10b981`) or `break-cyan` (`#06b6d4`). Cap is `stroke-linecap: round`.
- **Center Typography**: Large `timer-display` (e.g., `24:59`) directly centered over a micro phase badge (`FOCUS`, `SHORT BREAK`) styled in `mono-label`.

### 2. Audio Mixer Cards
- **Dimensions**: Compact 2-column tiles, height 88px.
- **State Inactive**: `#121215` background, `#27272a` 1px border. Muted track icon and white 60% text.
- **State Active**: Surface tint elevated to `#18181b`, border shifts to `rgba(16, 185, 129, 0.4)`, icon tinted emerald.
- **Track Controls**:
  - Top row: Sound icon (Rain, Wind, Cafe), track name (`body-sm`), and minimal micro toggle switch.
  - Bottom row: Custom horizontal track slider spanning full interior width.

### 3. Precision Range Sliders
- **Track Rail**: 4px height, background `#27272a`, rounded-full.
- **Filled Progress Track**: Colored `focus-emerald` for active tracks, neutral `#71717a` for master volume.
- **Slider Thumb**: 12px × 12px circle, pure white `#ffffff`, with a subtle hover expansion to 14px. Transitions use `cubic-bezier(0.16, 1, 0.3, 1)`.

### 4. Primary & Secondary Control Buttons
- **Hero Play/Pause**: 48px × 48px circle, `#10b981` solid background with pure `#09090b` icon for maximum focus clarity. Includes active ambient halo.
- **Secondary Actions (Skip, Reset)**: 36px × 36px ghost circles, `#18181b` surface with `#27272a` border, `#a1a1aa` icon resting, white hover.

### 5. Status Badges & Segmented Tabs
- **Phase Indicator Pill**: Inline flex badge with 6px circular pulsing dot. Uses `mono-label` uppercase text with 8px horizontal padding and 3px vertical padding.
- **Preset Switcher**: Subtle select dropdown styled as a flat surface pill (`#18181b`) with a chevron indicator.

### 6. Bottom Master Deck
- **Container**: Pinned bottom bar with top hairline border (`1px solid #27272a`) and backdrop blur filter (`backdrop-blur-md bg-zinc-950/80`).
- **Layout**: Left status metric (`"3 ACTIVE"` in `mono-label`), center master gain slider, right quick-mute button with slash indicator.