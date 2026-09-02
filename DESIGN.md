---
name: Brioso Empowered
description: Concrete-black talent & real estate site with champagne-gold streetwear energy.
colors:
  ink: "#0b0b0c"
  ink-2: "#121214"
  ink-3: "#191a1d"
  char: "#232428"
  gold: "#e0c064"
  gold-dp: "#a8862a"
  gold-lt: "#f2e0a6"
  champagne: "#f3e6c4"
  amber: "#d8a648"
  amber-lt: "#eccb84"
  bone: "#f4f4f0"
  bone-2: "#e2e2da"
typography:
  display:
    fontFamily: "'Archivo Black', 'Archivo', Impact, sans-serif"
    fontSize: "clamp(2.4rem, 10.5vw, 7.2rem)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.022em"
  body:
    fontFamily: "'Space Grotesk', system-ui, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Space Grotesk', system-ui, -apple-system, sans-serif"
    fontSize: "0.66rem"
    fontWeight: 700
    letterSpacing: "0.18em"
rounded:
  sm: "10px"
  md: "14px"
  pill: "999px"
spacing:
  gap: "1rem"
  pad-x: "clamp(1.15rem, 5vw, 2.5rem)"
  sec-y: "clamp(3.5rem, 9vw, 8rem)"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.9rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    rounded: "{rounded.pill}"
    padding: "0.9rem 1.5rem"
  card:
    backgroundColor: "{colors.ink-2}"
    rounded: "{rounded.md}"
    padding: "2.1rem 1.8rem 2.3rem"
  input:
    backgroundColor: "{colors.ink-2}"
    textColor: "{colors.bone}"
    rounded: "{rounded.sm}"
    padding: "0.95rem 1.05rem"
---

# Design System: Brioso Empowered

## Overview

**Creative North Star: "The Acid Court"**

Concrete black as the court, champagne gold as the trophy flashing under the lights. The system reads as confident streetwear luxury: bold, tactile, a little brash, built for a talent-management-and-real-estate firm that earns trust through relationships and receipts, not corporate polish. It explicitly rejects generic corporate-finance minimalism — no navy-and-white advisory-firm blandness, no soft SaaS gradients, no timid restraint. Gold is used with swagger, not sparingly: eyebrows, badges, and stat blocks all wear it loud.

The system is mobile-first and fluid throughout — type sizes and section rhythm scale with `clamp()` rather than stepping at breakpoints, so nothing looks under-designed at any width. Physicality is the throughline: tilted sticker badges, hard offset-shadow hovers, and grain/marquee texture all say "this was built by hand, not generated."

**Key Characteristics:**
- Concrete-black base with champagne-gold flash, warm amber used sparingly as a second voice
- Archivo Black display type in uppercase, tight tracking, paired with clean Space Grotesk body
- Pill-shaped buttons and badges, tilted at small deliberate angles (sticker energy)
- Hard offset-shadow hovers, not soft blur — physical, not ambient
- Fluid spacing/type via `clamp()`; almost no fixed breakpoint jumps

## Colors

Concrete-dark neutrals carry the page; a single loud gold does the persuading, with a warmer amber kept rare for secondary emphasis.

### Primary
- **Champagne Gold** (`#e0c064`, gradient to `#a8862a` / `#f7edd2` as `--gold-grad`): the signature accent — eyebrows, primary buttons, focus rings, selection color, stat-block background, section rules, scrollbar thumb. Used generously and without apology; it is the whole point of the palette.

### Secondary
- **Warm Amber** (`#d8a648`): kept rare, reserved for secondary emphasis moments — the step-indicator dot, stat-hover color shift. Its rarity is what keeps it a second voice rather than competing with gold.

### Neutral
- **Ink** (`#0b0b0c`): primary page background, text-on-gold.
- **Ink-2** (`#121214`) / **Ink-3** (`#191a1d`): card and raised-surface backgrounds, layered darker to lighter for subtle depth without shadows.
- **Char** (`#232428`): darkest incidental surface tone.
- **Bone** (`#f4f4f0`): primary text color on dark surfaces, and the background of "light" (`.light`) inverted sections.
- **Bone-2** (`#e2e2da`): secondary bone tone for light-section surfaces.
- **Line / Line-soft**: `rgba(224,192,100,0.28)` and `rgba(244,244,240,0.11)` — hairline borders on cards, inputs, and dividers; gold-tinted line reserved for higher-emphasis borders.

### Named Rules
**The Loud Gold Rule.** Champagne gold is not a rare accent here — it's allowed to dominate eyebrows, buttons, and stat blocks at once. Don't dilute it toward a "10% accent" convention; that reads as generic SaaS, not Acid Court.

## Typography

**Display Font:** Archivo Black (with Archivo, Impact, sans-serif fallback)
**Body Font:** Space Grotesk (with system-ui, -apple-system, sans-serif fallback)

**Character:** A heavy, condensed-feeling display face in permanent uppercase against a clean geometric sans body — poster typography over a functional reading face.

### Hierarchy
- **Display** (weight 400, `clamp(2.4rem, 10.5vw, 7.2rem)` at `.h-xl`, line-height 0.94, letter-spacing -0.022em, uppercase): hero headlines and section titles. Always uppercase, always tight-tracked.
- **Display — medium** (`.h-lg`, `clamp(1.85rem, 7vw, 4.4rem)`): secondary section headings.
- **Display — small** (`.h-md`, `clamp(1.35rem, 4.5vw, 2.3rem)`): card/component titles (service headings, feature stats).
- **Body / lede** (weight 400, `1rem`–`1.05rem`, line-height 1.6, max-width 52ch): paragraph copy, capped for readability.
- **Label** (weight 700, `0.66rem`–`0.72rem`, letter-spacing 0.12em–0.18em, uppercase): eyebrows, button labels, stat captions, nav links — always uppercase, always wide-tracked.

### Named Rules
**The Uppercase Display Rule.** Every `.display` element is uppercase with negative letter-spacing, never sentence case. Mixing case in display type breaks the poster feel.

## Layout

Mobile-first throughout: base rules target the smallest phone, and every media query is `min-width` only (480 / 600 / 700 / 900 / 1000 / 1100px named `sm/md/lg/xl` conceptually in the README, expressed as raw breakpoints in CSS). Section rhythm (`--sec-y`) and horizontal padding (`--pad-x`) are fluid via `clamp()`, so there is no visible "jump" at breakpoints for spacing — grids reflow (1→2→3 or 1→2→4 columns) but rhythm stays continuous. Content max-width is 1320px (`.wrap`). Minimum tap target is 44px. Hover-only effects are gated behind `@media (hover: hover) and (pointer: fine)` so touch devices never get stuck hover states.

## Elevation & Depth

Depth is structural and physical, not ambient. Surfaces are flat at rest — dark cards sit on a darker page via tonal layering (`--ink` → `--ink-2` → `--ink-3`), not shadow. On hover/interaction, elements physically shift and cast a hard, unblurred offset shadow.

### Shadow Vocabulary
- **Gold offset** (`box-shadow: 6px 6px 0 0 var(--gold)`, paired with `transform: translate(-4px, -4px)`): the primary hover treatment for cards and service tiles — the element visibly lifts off the page toward the viewer.
- **Deep-gold offset** (`box-shadow: 5px 5px 0 0 var(--gold-dp)`): buttons' hover state, same physical-lift language at a smaller scale.
- **Ink offset** (`box-shadow: 6px 6px 0 0 #111`, on light/`.light` sections): the same rule inverted for light backgrounds.

### Named Rules
**The Hard Shadow Rule.** Shadows are never soft or blurred (`0 4px 24px rgba(...)` ambient glows do not belong here). Every shadow is a flat, unblurred offset (`Npx Npx 0 0 color`) paired with a `translate()` on hover — it reads as a sticker lifting off a surface, not light falling on a surface. This is deliberate and structural: don't soften it toward conventional ambient elevation.

## Shapes

Two competing geometries, used deliberately: soft-rounded surfaces (`--r: 14px/16px`, `--r-sm: 10px`) for cards, inputs, and images; fully pill-shaped (`--pill: 999px`) for anything actionable or label-like — buttons, badges, eyebrows, tags. Small deliberate rotation (`-1.5deg` to `-2.5deg`) on badges and the featured-portrait backing slab gives a hand-placed, sticker feel rather than a perfectly grid-locked one. Borders are consistently 2px (`--bd`).

## Components

**Feel:** tactile and confident — pill buttons, hard shadows, tilted stickers; the interface behaves like something physical you could pick up, not a flat screen of information.

### Buttons
- **Shape:** full pill (`border-radius: 999px`), min-height 44px (tap target), padding `0.9rem 1.5rem` (desktop `0.95rem 1.7rem`).
- **Primary (`.btn-gold`):** champagne-gold gradient background, ink text. Hover: lifts `translate(-3px,-3px)` with a deep-gold hard offset shadow.
- **Ghost (`.btn-ghost`):** transparent with a 2px `rgba(bone, 0.28)` border, bone text. Hover: inverts to solid bone background with ink text, same physical lift + shadow as primary.
- **Line (`.btn-line`):** no fill or border — an animated underline that sweeps in from the right on hover, gold text, used for lighter-weight inline links/CTAs.
- **Label style:** always uppercase, 0.72–0.74rem, letter-spacing 0.12em, weight 700.

### Cards / Containers
- **Corner Style:** 14–16px radius (`--r`).
- **Background:** `--ink-2` on dark sections, layering to `--ink-3` on hover.
- **Border:** 2px solid `--line-soft` at rest.
- **Shadow Strategy:** flat at rest; hard gold offset shadow + physical lift on hover (see Elevation).
- **Internal Padding:** `1.7rem 1.4rem 1.9rem` mobile, `2.1rem 1.8rem 2.3rem` at 700px+.
- **Signature detail:** an oversized, near-invisible index numeral (`.idx`, `rgba(bone,0.07)`) sits top-right on service cards, brightening to gold-tinted on hover — a quiet editorial touch under the loud gold.

### Inputs / Fields
- **Style:** `--ink-2` background, 2px `--line-soft` border, `--r-sm` (10px) radius, Space Grotesk font. 16px font size on mobile specifically to prevent iOS Safari auto-zoom on focus.
- **Focus:** border/ring shifts to gold (consistent with the global `:focus-visible` outline rule: 3px solid gold, 3px offset).
- **Textarea:** vertical-resize only, 92px minimum height.
- **Select:** custom-styled (native appearance removed), muted text color until a value is chosen.

### Navigation
- Sticky nav that compresses padding once `.stuck`. Desktop nav links are pill-shaped on hover (gold background, ink text). Mobile collapses to a drawer; the primary CTA button is hidden below the desktop breakpoint and lives in the drawer instead.

### Badges / Tags (Signature Component)
Tilted sticker-style pills (`.eyebrow`, `.feature-tag`) — gold or ink background depending on section polarity, small rotation (`-1.5deg` to `-2deg`), a diamond glyph (`◆`) prefix on eyebrows. This is the system's most recognizable signature: every section opens with one.

## Do's and Don'ts

### Do:
- **Do** use the hard, unblurred offset shadow (`Npx Npx 0 0 color` + `translate()`) for every interactive lift — it's the system's core physical signature.
- **Do** keep display type uppercase with tight negative tracking; never mix in sentence case for headings.
- **Do** let gold be loud — eyebrows, buttons, and stat blocks can all carry it in the same viewport.
- **Do** apply small deliberate rotation (`-1.5deg` to `-2.5deg`) to badges and stickers for the hand-placed feel.
- **Do** gate all hover-only effects behind `(hover: hover) and (pointer: fine)` so touch never gets a stuck hover state.

### Don't:
- **Don't** use soft/blurred ambient shadows anywhere — it breaks the sticker-on-concrete physicality that defines this system.
- **Don't** default to navy/corporate-advisory minimalism as a "safer" direction; that is the explicit anti-reference for this brand.
- **Don't** treat amber as a second primary — it stays rare, reserved for secondary emphasis only (step dots, stat hover), or it stops reading as a deliberate second voice.
- **Don't** introduce a step-based (non-fluid) spacing or type scale; rhythm here is `clamp()`-driven and continuous by design.
