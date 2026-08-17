---
name: LAMIT
description: Institutional site for a Brazilian student tech league — broadcast-night energy rendered in flat, mono-type, black-canvas design.
colors:
  primary: "#0A3383"
  secondary: "#C17402"
  tertiary: "#d7c06b"
  neutral-black: "#000000"
  neutral-white: "#ffffff"
  signal-blue: "#164194"
  signal-orange: "#e84b13"
  gold-bright: "#ffbb00"
typography:
  display:
    fontFamily: "BB Mono Semi Regular, monospace"
    fontSize: "clamp(2.7rem, 6vw, 5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "normal"
  headline:
    fontFamily: "BB Mono Semi Regular, monospace"
    fontSize: "clamp(2rem, 4vw, 3.4rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  title:
    fontFamily: "BB Mono Semi Regular, monospace"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: "normal"
    letterSpacing: "normal"
  body:
    fontFamily: "BB Mono Semi Regular, monospace"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "normal"
  label:
    fontFamily: "BB Mono Semi Regular, monospace"
    fontSize: "0.9rem"
    fontWeight: 700
    lineHeight: "normal"
    letterSpacing: "0.2rem"
rounded:
  none: "0px"
  chip: "10px"
  media: "15px"
  glass-sm: "8px"
  glass-md: "10px"
  glass-lg: "14px"
  glass-xl: "16px"
components:
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.neutral-white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "65px"
    width: "100%"
  button-primary-hover:
    backgroundColor: "{colors.signal-orange}"
    textColor: "{colors.neutral-white}"
  button-secondary:
    backgroundColor: "{colors.neutral-black}"
    textColor: "{colors.neutral-white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    width: "50px"
    height: "40px"
  button-secondary-hover:
    backgroundColor: "{colors.neutral-white}"
    textColor: "{colors.neutral-black}"
  input-field:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-white}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "1vh"
  nav-link:
    textColor: "{colors.neutral-white}"
    typography: "{typography.label}"
    fontSize: "1.2rem"
  tilted-card-media:
    rounded: "{rounded.media}"
  tilted-card-caption:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-white}"
    rounded: "{rounded.chip}"
    padding: "4px 10px"
  button-cta-glass:
    backgroundColor: "rgba(255,255,255,0.08)"
    textColor: "{colors.neutral-white}"
    typography: "{typography.label}"
    rounded: "{rounded.glass-lg}"
    height: "56px"
  button-cta-glass-hover:
    backgroundColor: "rgba(232,75,19,0.2)"
  button-arrow-glass:
    backgroundColor: "rgba(255,255,255,0.08)"
    textColor: "{colors.neutral-white}"
    typography: "{typography.label}"
    rounded: "{rounded.glass-md}"
    width: "50px"
    height: "40px"
  button-arrow-glass-hover:
    backgroundColor: "rgba(232,75,19,0.22)"
  input-field-glass:
    backgroundColor: "rgba(255,255,255,0.06)"
    textColor: "{colors.neutral-white}"
    typography: "{typography.body}"
    rounded: "{rounded.glass-sm}"
    padding: "1.2vh 12px"
---

# Design System: LAMIT

## Overview

**Creative North Star: "The Hackathon Broadcast"**

LAMIT's site reads like a late-night competitive broadcast feed rather than an institutional brochure: a wall of looping video, a warping WebGL gradient behind every interior page, and type that stays locked in uppercase mono-terminal characters at all times. The voice is precise and institutional first — this is a formal academic league, not a nightclub — but the surface it's delivered on borrows its intensity from live competition coverage: black canvas, hard-edged chrome, and a single animated gradient doing the work that photography or illustration would do elsewhere.

Everything is deliberately flat. There is no drop shadow anywhere in the system — depth comes from the animated gradient's own warp and grain, from opacity masks fading video and photo edges into the black canvas, and from the one physical gesture the system allows itself: a spring-physics 3D tilt on the director photo cards. The palette stays narrow (deep cobalt, burnt amber, institutional gold, plus a CTA-anchor blue and an auxiliary highlight orange) so that the gradient and the tilt effect remain the most expressive things on screen.

**Key Characteristics:**
- Absolute black canvas (`#000000`) with white type and white 1-2px line borders — no gray midtones as fills.
- Single custom mono typeface, forced uppercase everywhere, carrying every role from display to label.
- Zero shadows, enforced globally; depth comes from gradient warp, grain, and mask fades instead.
- One animated WebGL gradient (cobalt → amber → cobalt, with grain and rotation) as the atmospheric layer behind every interior page.
- Fixed, persistent chrome (logo, nav, footer) that never scrolls away, reinforcing the "broadcast overlay" read.

## Colors

The palette is intentionally narrow: two brand hues carried by the animated gradient, one institutional gold reserved for leadership content, a CTA-anchor blue, and an auxiliary orange used to highlight interactive elements wherever emphasis is needed.

### Primary
- **Cobalto Profundo** (`#0A3383`): the gradient's cool anchor color (Grainient `color1`/`color3`) and the background of the TiltedCard cursor-tracking caption chip. This is the closest thing the system has to a "brand blue."

### Secondary
- **Âmbar Queimado** (`#C17402`): the gradient's warm counterpoint (Grainient `color2`). Never used as a flat fill outside the gradient itself — it exists to be blended, not applied as a solid.

### Tertiary
- **Ouro Institucional** (`#d7c06b`): reserved for the Diretoria page's kicker label and each director's index number/role label — a signal that "this is leadership content," distinct from the cobalt/amber gradient world.
- **Ouro Institucional — Bright** (`#ffbb00`): the brighter sibling used for the contact page's copyable email links; same family, higher chroma, reserved for actionable text.

### Neutral
- **Preto Absoluto** (`#000000`): the base background of every page and the resting fill of secondary buttons.
- **Branco** (`#ffffff`): all body text, borders, and the hover fill of secondary buttons.

### Named Rules
**The Signal Accent Rule.** The site now runs two CTAs with two deliberately different registers, not one "most important action" — a decision made explicit here rather than left ambiguous. Signal Blue (`#164194`) is the **opening gesture**: the hero CTA ("Acesse Nossos Links"), solid and full-bleed immediately after the video wall, hits with the same directness as the broadcast intro it follows — no subtlety, no translucency. The Glass Exception treatment, tinting to Signal Orange (`#e84b13`) on hover, is the **closing gesture**: the "Entrar na comunidade" CTA, arriving after the mission, competition proof, and hosting proof have all been shown, is an invitation rather than a command — a softer, translucent surface suits asking someone to join more than repeating the opening's hard color-flip would. Signal Blue owns the loud opening beat; the Glass + Signal Orange pairing owns the warm closing beat. Signal Orange also remains the system's general auxiliary highlight elsewhere (the nav link hover underline, and future interactive callouts) — it is not exclusive to the closing CTA, only Signal Blue's opening-beat role is exclusive.

## Typography

**Display/Body/Label Font:** BB Mono Semi Regular (custom `@font-face`, monospace fallback)

**Character:** A single mono-terminal typeface carries every role in the system — display headlines, body copy, and micro-labels alike — which is what gives the site its "broadcast overlay" texture. There is no second typeface for contrast; hierarchy comes entirely from size, weight, and letter-spacing.

### Hierarchy
- **Display** (400, `clamp(2.7rem, 6vw, 5rem)`, line-height 0.95): the Diretoria page's `Diretoria` headline — the largest text in the system, used once per page at most.
- **Headline** (400, `clamp(2rem, 4vw, 3.4rem)`, line-height 1): each director's name in the Diretoria showcase.
- **Title** (400, 1.5rem): page-level `h1`s outside Diretoria and Home (Contato).
- **Body** (400, 0.95–0.98rem, line-height 1.7–1.8): paragraph copy — the Home "Sobre nós" mission text and each director's description, capped near 480px measure.
- **Label** (700, 0.9rem, letter-spacing 0.18–0.36rem): nav links, the Diretoria kicker, and each director's index/role label — always uppercase, always wide-tracked.

### Named Rules
**The All-Caps Rule.** A global `text-transform: uppercase` is forced on every element (`* { text-transform: uppercase }`). Author copy in whatever case reads best in source; the render is uppercase unconditionally, so casing is never a design lever here.

## Layout

The site runs edge-to-edge with almost no max-width container; measure is controlled per-element with `clamp()` and viewport units rather than a global grid. Chrome is fixed and persistent: the logo is pinned top-left (72px tall, 40px from the edge), nav links are pinned top-center, and the footer row (credits bottom-left, copyright bottom-center, social icons bottom-right) stays fixed to the viewport across every page.

- **Home** is an 85vh hero split into four equal-width autoplay video columns, each masked to fade in from transparent at the top and bottom edge; a full-bleed, wrapping photo gallery follows below.
- **Diretoria** breaks its rows out to full viewport width (`margin-left: calc(50% - 50vw)`) regardless of any parent container, alternating a photo/content grid (roughly 45/55, reversing order every other row) down the page.
- Section rhythm is expressed in real values rather than a token scale: Diretoria's page padding is `110px 0 120px`, and each director's content block pads `48px clamp(32px, 6vw, 96px)`.
- Two responsive breakpoints: **920px** (paired with short viewports ≤720px tall) collapses the base type scale and swaps in the mobile icon/link set; **760px** stacks the Diretoria grid to one column and switches the photo mask to a bottom-only fade.

## Elevation & Depth

There is no shadow system — `box-shadow: none !important` is forced globally, so no component may introduce one. Depth is conveyed three other ways: the animated Grainient background's own color warp, rotation, and procedural grain sit behind interior-page content like atmosphere; linear-gradient opacity masks fade video and photo edges into the black canvas instead of cutting them off hard; and TiltedCard's spring-physics 3D tilt (up to 20° rotation, 1.1x scale on hover) stands in for a hover-elevation cue on the one interactive photographic element in the system.

### Named Rules
**The Flat-By-Force Rule.** Shadows are not a stylistic choice here — they're structurally impossible. Never attempt to add `box-shadow` to a new component; express emphasis or depth through the gradient, a mask, or the tilt interaction instead.

**The Glass Exception.** A small, explicitly scoped set of interactive controls breaks from Flat-By-Force on purpose, by direct request: the closing "Entrar na comunidade" CTA, the entire contact form panel (`#form`) and its input/textarea fields, the contact form's send button, and the hackathon-carousel's prev/next arrows. Each uses a translucent white fill (6-8% alpha at rest, tinting to Signal Orange at 20-22% alpha on hover/focus), `backdrop-filter: blur()` (10-18px depending on the component's size and prominence), and a soft white border (18-25% alpha) in place of the solid-fill/hard-line treatment used everywhere else. `box-shadow` still does not apply — the glass reads through blur and translucency alone, never a cast shadow. This is a deliberate, requested departure, not drift: it stays confined to this component family and does not extend to the hero CTA, TiltedCard, DirectorBanner, or any other page-level surface.

## Shapes

Square-edged by default: buttons, inputs, nav chrome, and the footer all sit at 0 radius, with a 1-2px solid white line as the only boundary treatment — never a filled background or a shadow to delimit an interactive element. Curvature is reserved for two families: the photographic TiltedCards, whose image gets a 15px radius (paired with a top/bottom gradient mask) and whose cursor-following caption chip gets a 10px radius; and the Glass Exception family (see Elevation & Depth), which ranges 8-16px depending on the component — the contact form panel at 16px, its fields at 8px, the closing CTA at 14px, the carousel arrows and send button at 10px. Every other surface stays at 0 radius. Full-bleed breakout is a recurring silhouette move — both the Home video banner and the Diretoria showcase escape their container to span the entire viewport width.

## Components

### Buttons
- **Shape:** square (0 radius) by default; the only boundary is a solid white line, never a filled outline. The Glass Exception family below is the sole departure.
- **Primary** (`liveButton`, hero CTA "Acesse Nossos Links"): Signal Blue (`#164194`) fill, white top/bottom border only (no side borders), full-width, 65px tall, uppercase bold label.
- **Hover:** fills Signal Orange (`#e84b13`), text weight jumps to 900, 0.5s ease transition — a deliberately aggressive color flip rather than a subtle shift.
- **Primary — glass variant** (closing "Entrar na comunidade" CTA only, `.home-cta__button`): translucent white fill (8% alpha), `backdrop-filter: blur(16px)`, 1px white border (25% alpha), 14px radius, auto-width with 40px horizontal padding (not full-bleed like the hero CTA — this is the one button in the system sized to its own label). Hover tints the fill to Signal Orange (20% alpha) and the border to solid Signal Orange, rather than the hero CTA's hard color flip.
- **Secondary — glass** (`sendBtn`, the contact form submit): translucent white fill (8% alpha), `backdrop-filter: blur(14px)`, 1px white border (25% alpha), 10px radius, auto-width. Hover tints to Signal Orange (22% alpha fill, solid border) — replaces an earlier solid-black/white-flip treatment.
- **Carousel arrow — glass** (`.home-carousel__arrow`, prev/next on the hackathon carousel): same glass treatment as the send button — translucent white fill (8% alpha), `blur(14px)`, 25%-alpha white border, 10px radius, 50×40px. Same Signal Orange hover tint.

### Inputs / Fields
- **Style — glass:** translucent white fill (6% alpha), `backdrop-filter: blur(10px)`, 1px white border (22% alpha), 8px radius, white mono text; placeholder/label copy is the only place `text-transform` is turned back to normal case (form field values render as typed, not forced uppercase).
- **Focus:** border tints to Signal Orange, fill brightens slightly (10% alpha) — the system's one real focus treatment beyond the browser default.
- **Form panel** (`#form`, the container around all contact fields): same family at a larger scale — translucent white fill (6% alpha), `backdrop-filter: blur(18px)`, 1px white border (18% alpha), 16px radius — the whole form reads as one glass card sitting on the page's animated gradient.

### Cards / Containers — TiltedCard
- **Corner style:** 15px radius on the image, 10px on the caption chip; the only rounded surfaces in the system.
- **Behavior:** desktop-only spring-physics 3D tilt (damping 30, stiffness 100, mass 2) up to 20° rotation and 1.1x scale on hover, with a cursor-following caption chip (Cobalto Profundo fill) that fades in on hover and reads the director's experience/title.
- **Masking:** top and bottom gradient fade so the photo blends into the surrounding black rather than showing a hard rectangular edge.

### Director Banner (signature component)
- **Layout:** full-bleed alternating row — photo on one side, content (index, role label, name, description) on the other — flipping order every other entry via a `reverse` flag.
- **Typography:** index number and role label in Ouro Institucional, wide letter-spacing; name in the Headline role; description in Body.
- **Edge treatment:** the first and last row in the showcase get an extra top/bottom mask so the whole sequence fades into the page rather than starting or ending abruptly.

### Navigation
- **Style:** logo fixed top-left, links fixed top-center, all uppercase bold mono, no active/current-page styling — the current page is simply omitted from the link list instead of being highlighted.
- **Hover:** a 2px Signal Orange underline grows in from the center (`scaleX(0)` → `1`, 0.3s ease-in-out) beneath a link on hover — the nav's only interactive feedback, since there's no active-page indicator.
- **Mobile:** breakpoint swaps icon sizes and link spacing down; layout position stays fixed rather than collapsing into a drawer.

## Do's and Don'ts

### Do:
- **Do** treat the animated Grainient (Cobalto Profundo → Âmbar Queimado, with grain and warp) as the default atmospheric background for any new interior page — it's the system's substitute for photography or illustration on non-Home pages.
- **Do** use border-only outlines (1-2px solid white) to delimit new interactive elements instead of a filled background or a shadow.
- **Do** apply a top/bottom (or edge-appropriate) gradient mask to any new full-bleed video or photo element so it blends into the black canvas rather than cutting hard.
- **Do** author copy in natural case in source; the global uppercase transform handles the rendering.

### Don't:
- **Don't** add `box-shadow` to any component — it's globally overridden to `none` and will not render even if written, glass family included.
- **Don't** introduce a second typeface. BB Mono Semi Regular is the only face in the system, across every role.
- **Don't** add corner radius to buttons, inputs, or nav/footer chrome outside the two named exceptions — the TiltedCard photo family (15px/10px) and the Glass Exception family (8-16px, see Elevation & Depth and Components). Every other surface stays at 0 radius.
- **Don't** extend the glass treatment (translucent fill + blur + soft border) beyond its current scope — the closing CTA, the contact form panel and fields, the send button, and the carousel arrows — without a deliberate decision to widen it. It is not the system's new default button/input style.
- **Don't** invent new accent hues outside Cobalto Profundo, Âmbar Queimado, Ouro Institucional, Signal Blue, and Signal Orange — the narrow palette is load-bearing for how the gradient reads as distinctive. Signal Orange is the one color free to travel to new interactive-emphasis uses; the other four stay put.
