---
target: Home page (src/pages/Home.jsx) and site-wide chrome
total_score: 17
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
timestamp: 2026-08-16T03-41-44Z
slug: src-pages-home-jsx
---
Method: dual-agent (A: a493dbfdba18fa259 · B: a792b372a19a7dcc2)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Nav removes the current page from the link list instead of marking it active — no "you are here" cue anywhere |
| 2 | Match System / Real World | 3/4 | Real institutional voice throughout; "Acesse Nossos Links" reads slightly generic (Linktree-bio-page phrasing) |
| 3 | User Control and Freedom | 2/4 | 4 autoplaying hero videos + always-on Grainient background have no pause control and no `prefers-reduced-motion` guard |
| 4 | Consistency and Standards | 1/4 | `.btn-primary` renders as two visually unrelated UIs on the same page (solid square vs. translucent blurred pill) |
| 5 | Error Prevention | 1/4 | Contact form validates sequentially on submit via blocking modal; no inline hints before failure |
| 6 | Recognition Rather Than Recall | 3/4 | Consistent kicker/title/body rhythm aids pattern recognition across every section |
| 7 | Flexibility and Efficiency | n/a | Marketing/showcase surface; no power-user path expected (carousel's triple input redundancy — drag/wheel/keyboard — exceeds what's required here) |
| 8 | Aesthetic and Minimalist Design | 3/4 | Flat/mono/black system is disciplined where followed; blur/glass creep dilutes the "hard-edged, no-shadow" identity |
| 9 | Error Recovery | 1/4 | Generic error text, no field-level highlighting, no format examples shown up front |
| 10 | Help and Documentation | n/a | Not applicable to this marketing surface |
| **Total** | | **17/32** | **Acceptable** (2 heuristics n/a: 7, 10) |

## Design Specificity Verdict

**Split cleanly along a seam, and the detector independently confirms where.**

**LLM assessment:** The content layer is genuinely specific to LAMIT: real director names tied to real employers (Ford, TJBA, UCSal), four real 2026 events with real attendance counts, 11 real hackathon photos, a forced-uppercase mono "broadcast" voice, and a three-pillar mission that maps directly onto PRODUCT.md's stated positioning rather than generic "our values" copy. The secondary UI layer has drifted toward patterns any 2020s startup landing page could ship unchanged: `backdrop-filter: blur()` glass panels with 8–16px radius on the contact form, send button, carousel arrows, and closing CTA — none of which exist in DESIGN.md's documented component set, and all of which directly contradict its explicit "Flat-By-Force" and "no corner radius on buttons/inputs" rules. The specificity leaks out exactly on the highest-stakes conversion surfaces: the contact form and the join-community button.

**Deterministic scan:** 32 findings, all classified `advisory`, 0 blocking. DEGRADED run (HTML parser modules unavailable, regex fallback — undercount, not a clean bill). Breakdown: 27 font-size, 3 radius, 2 color — concentrated in `style.css` (21) and `home.css` (10). Critically, the detector's own advisory label undersells several of these: `.home-cta__button`'s 14px radius, `#form`'s 16px radius, and `input/textarea`'s 8px radius aren't just numeric drift from a ramp — they're direct violations of DESIGN.md's explicit "Don't add corner radius to buttons, inputs..." rule, and `#a3a3a3` directly contradicts the stated "no gray midtones as fills" principle. One flagged false positive: `.nav_home a`'s 1.2rem font-size is actually documented intentionally in DESIGN.md's `nav-link` component frontmatter — the detector only checks the five named type-ramp steps, not component-level overrides.

**Where A and B agree:** both independently converged on the same root issue — glassmorphism radius creep — from different angles (A via holistic judgment on button-identity consistency, B via mechanical token comparison against DESIGN.md). That convergence is the strongest signal in this report.

**Visual overlays:** Not available — no browser automation tool exposed in this session. CLI detector output only.

## Overall Impression

A strong, deliberately-authored content and narrative layer (real positioning, a real emotional arc, a genuine signature interaction in the carousel) undercut by a UI layer that drifted from its own documented rules — confirmed independently by both a human-style design read and a mechanical token scan — plus real motion-accessibility gaps that were solved once (the carousel) and never propagated to the site's two loudest, longest-running motion sources.

## What's Working

1. **The three-pillar structure in `AboutSection.jsx` is positioning, not filler.** `Competição` / `Conexões` / `Inovação` map exactly onto PRODUCT.md's three-factor differentiator rather than generic "our values" copy — a landing-page mission section that's actually load-bearing content.
2. **`HackathonCarousel` is a crafted interaction, not a slider plugin.** The infinite clone-strip supports drag, wheel, keyboard, and click converging on one `step` state, with a "scanning a contact sheet" feel that suits the broadcast concept. It's also the *only* motion-heavy component that correctly implements `useReducedMotion()` — proof the team knows the right pattern, which makes its absence elsewhere read as an oversight rather than a decision.
3. **`DirectorBanner`'s full-bleed alternating layout is a genuine signature component.** Breaking container width, alternating photo/content order, pairing it with `TiltedCard`'s spring-physics tilt — exactly the "one physical gesture the system allows itself" DESIGN.md calls for. The concept is strong; its mobile/keyboard execution is the site's biggest single defect (see P0 below).

## Priority Issues

**[P0] Director credibility content (Ford/TJBA/professor) is invisible to every touch or keyboard visitor, with no fallback.**
- **Why it matters:** `DirectorBanner.jsx` never renders the `experience` field in `.director-banner__content` — it only reaches `TiltedCard`'s `captionText`, revealed exclusively via a mouse `onMouseEnter` opacity spring (no `onFocus`, no touch handler). PRODUCT.md names this exact credential as one of three pillars of LAMIT's entire positioning against being seen as an informal club. On a phone — likely most of this audience — that evidence never surfaces.
- **Fix:** Render `experience` as static, always-visible text in `.director-banner__content` (a secondary line under the name), independent of the hover/tilt interaction.
- **Suggested command:** `/impeccable harden`

**[P1] The site's one "primary button" class renders as two unrelated UIs — and the detector independently caught the same components.**
- **Why it matters:** DESIGN.md documents `.btn-primary` as Signal-Blue fill, 0 radius, 65px tall. The hero CTA matches it exactly; `CommunityCTA.jsx`'s `.home-cta__button` overrides it to a translucent blurred pill at 14px radius — turning the site's actual conversion moment into a visually *lower*-commitment control than the mid-page Linktree link. The detector flagged the same component's radius (14px) plus `#form` (16px) and `input/textarea` (8px) as direct rule violations, not just drift.
- **Fix:** Either restore the documented Signal-Blue square style for the closing CTA, or formally add a second button variant to DESIGN.md and apply it consistently to `#sendBtn` and `.home-carousel__arrow` too, which share the same drift.
- **Suggested command:** `/impeccable harden`

**[P1] The two loudest, longest-running motion sources on the site have no pause and no reduced-motion guard.**
- **Why it matters:** The 4 looping hero videos and the always-on animated Grainient background (Diretoria/Contato) run indefinitely with zero UI pause control and no `prefers-reduced-motion` handling — a WCAG 2.2.2 (Pause, Stop, Hide) gap. `HackathonCarousel.jsx` proves the team knows this pattern (`useReducedMotion()`); it just never got extended to these two.
- **Fix:** Freeze the Grainient's warp/rotation and pause/hold-frame the hero videos under `prefers-reduced-motion: reduce`, matching the carousel's existing implementation.
- **Suggested command:** `/impeccable harden`

**[P2] The top-of-page Linktree CTA exits the narrative before it starts.**
- **Why it matters:** The bare hero CTA link uses Signal Blue — the color DESIGN.md explicitly reserves for "the one action that matters most" — to send a first-time visitor off-site to a generic link-in-bio page before they've read the mission or seen any proof. This undercuts the site's own documented emotional arc by offering the exit ramp first.
- **Fix:** Demote this link to secondary styling, or relocate it to the footer/nav tier, reserving Signal Blue exclusively for "Entrar na comunidade."
- **Suggested command:** `/impeccable clarify`

**[P2] Contact form errors are sequential, generic, and blocking — and the detector caught a rule-breaking gray fill in the same area.**
- **Why it matters:** Validation fires one field at a time on submit via a blocking modal, generic text ("Por favor insira um telefone válido"), no field highlighting, no format example. A user with two typos must submit twice. Separately, the detector flagged `#a3a3a3` (style.css:737, in this same mobile contact area) as a literal gray fill — DESIGN.md states "no gray midtones as fills" as a load-bearing rule, so this isn't just an error-handling gap, it's also an on-brand-color violation in the same UI region.
- **Fix:** Validate on blur, highlight the specific invalid field, surface an inline format hint; replace the `#a3a3a3` fill with a documented token.
- **Suggested command:** `/impeccable clarify`

## Persona Red Flags

**Jordan (first-timer).** Lands on Home and the first interactive element after the hero is a full-width Signal-Blue bar pointing to Linktree — before Jordan has learned what LAMIT even is. Separately, opening the mobile hamburger on Home shows only DIRETORIA / SHOP / CONTATO — Home is silently missing from the list with no visual explanation, reading as a broken menu rather than a "you are here" convention.

**Casey (distracted mobile user).** Two failures compound: the Ford/TJBA credibility line never appears on Diretoria (hover-only, see P0); and Home's hero — the site's signature "wall of looping video" — collapses to a single video under 920px width, so mobile Casey gets a fraction of the intended visual impact of the design system's own defining image.

**Sam (accessibility-dependent, keyboard/screen-reader).** `TiltedCard.jsx` has no `tabIndex`, `onFocus`/`onBlur`, or `role` — a keyboard-only user cannot trigger the tilt or caption reveal at all. Partial mitigation: the caption text is real DOM content in a `<figcaption>`, so screen readers still announce it — but a sighted keyboard user gets nothing. The lack of `prefers-reduced-motion` support on hero videos/Grainient (see P1) is a direct risk for vestibular-sensitive visitors.

## Minor Observations

- `TiltedCard.jsx` still ships an unused `showMobileWarning` prop and warning string, always disabled via `showMobileWarning={false}` — dead code suggesting an unmodified third-party component.
- Hackathon photo alt text is near-identical across all 11 images ("Equipe da LAMIT em um hackathon (foto N de 11)") — compliant but gives screen-reader users no sense of what differs between photos.
- `#downElements` (copyright text) uses `z-index: 9999` vs. the mobile nav overlay's `z-index: 15` — unconfirmed without a live render, but worth checking that the copyright text doesn't render on top of the open mobile menu.
- `isPhoneValid` mixes Brazilian DDD prefixes with a US-phone regex branch — harmless for a BR-only audience but a tell of a copy-pasted generic validator.
- `.home-carousel__title` / `.home-events__title` force `white-space: nowrap` against a `clamp(1rem, 6vw, 3rem)` floor — works for current short headlines but fragile against a longer future one.
- DESIGN.md's Layout section still describes Home as "an 85vh hero... a full-bleed, wrapping photo gallery follows below" — that no longer matches the shipped Home (About → Carousel → Events → CTA); worth refreshing alongside any fixes from this critique.
- `tilted-card-caption`'s 10px font-size is flagged by the detector, but every other property of that component (radius, background, padding) matches DESIGN.md exactly — DESIGN.md's own component entry just never specified a `typography` field. A documentation gap, not code drift.

## Questions to Consider

1. DESIGN.md's "Signal Accent Rule" says Signal Blue is reserved for "the one action that matters most" — which action is that, actually? Right now it's on two visually unrelated buttons (a mid-page Linktree exit and a bottom-page WhatsApp join) that don't even share a visual family.
2. The Diretoria page hides its single strongest credibility signal behind a desktop-only mouse hover. If that line is genuinely central to LAMIT's pitch to sponsors and the university, why is it optional at all?
3. "Nossos eventos" is entirely retrospective — four past events. Given the roadmap already plans to centralize an events hub here, should Home already be teasing "next," so the visitor's actual next action is more concrete than "join a WhatsApp group and wait"?
