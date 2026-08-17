# DESIGN.md — The Engineering Dossier

Design system for `yoshwanpathipati.com`. Written before any component code; the build follows
this document exactly. Revised once (see [Self-critique](#self-critique-against-the-banned-defaults)).

---

## 1. Concept

The site is a **precision technical document about a candidate**: part aerospace flight-test manual,
part security assessment report. The metaphor is not decoration, it is structure. Yoshwan builds a
satellite-constellation simulation testbed and runs vulnerability assessments, so document furniture
carries real meaning:

| Device | What it means here |
| --- | --- |
| Doc number / revision stamp | The résumé edition on file (`YP-2027`, `REV S26`) |
| Section codes (`SEC 04`) | Ordered sections of an assessment report |
| Hairline rules, corner ticks | Drawing-sheet margin of an engineering plate |
| Mono telemetry labels | Instrumentation readouts, the language of the testbed |
| Severity-style tags | The vocabulary of the vuln reports he actually writes |
| `FIG. 01` caption on the hero plot | The animation is a *figure in the document*, not a background |

The reader should feel they were handed a controlled document, not shown a website.

---

## 2. Color tokens

Cool paper white, near-black ink, one engineered accent. Six named tokens, defined once and remapped
for night ops so both themes are the **same identity**, not two designs.

### Light — "dossier" (default)

| Token | Hex | Role |
| --- | --- | --- |
| `--paper` | `#FAFAF8` | Page ground. Cool white, a shade off pure to read as stock, not screen. |
| `--panel` | `#F2F1EC` | Raised/inset panels: featured research, telemetry strip, project cards. |
| `--ink` | `#101214` | Primary text, rules at full strength, satellite marks. |
| `--ink-muted` | `#5C6069` | Secondary text, labels, graticule. 6.1:1 on paper. |
| `--hairline` | `#D9D8D1` | 1px rules, card borders, the document frame. |
| `--accent` | `#FF4F00` | International orange. Redlines, packet pulses, focus rings, active states. |
| `--accent-text` | `#C23B00` | Accent at body sizes where `#FF4F00` fails AA. 5.2:1 on paper. |

### Dark — "night ops"

Same accent, same structure, same rules. Only the ground and ink swap. It is the identical document
under a different lamp.

| Token | Hex | Note |
| --- | --- | --- |
| `--paper` | `#0C0E12` | Blue-black, not neutral black. Reads as a lit console, not a terminal. |
| `--panel` | `#14171C` | |
| `--ink` | `#EDEBE4` | Warm off-white, echoes the paper of light mode. 16:1. |
| `--ink-muted` | `#979CA6` | 7.0:1 on `--paper`. |
| `--hairline` | `#2A2E36` | |
| `--accent` | `#FF4F00` | Unchanged. 5.9:1 on `--paper`, so it is usable as text here. |
| `--accent-text` | `#FF6A2B` | Slightly lifted for small text on dark. |

**Accent rationale.** International orange is the color of flight-test instrumentation, high-visibility
airframe markings, and the Golden Gate Bridge's structural steel: it exists specifically to be legible
against sky and to mark *the thing you must not lose track of*. It is the correct accent for a document
about orbital simulation and finding critical severities. It is also, usefully, the opposite of every
banned palette below.

**Contrast contract.** `--accent` on `--paper` is 3.2:1 in light mode. That is AA for large text and UI
boundaries but not for body copy, so light mode uses `--accent-text` for anything under 24px/19px-bold.
This rule is enforced by only exposing `text-accent` in the type scale at display sizes.

---

## 3. Typography

Three faces, self-hosted through `next/font/google` (downloaded at build time, zero runtime requests,
`size-adjust` fallbacks so there is no shift on load).

### Display — **Archivo**, variable, run at `wdth 112–118` / `wght 800`

A grotesque with a real width axis. Pushed wide and black and set in caps, it stops looking like a UI
font and starts looking like the lettering silkscreened on an equipment panel: square terminals, tight
apertures, enormous presence at the H1. It carries the whole personality, which is why everything else
in the system is quiet.

Not Inter (the default of defaults), not Poppins (geometric friendliness, wrong register entirely), not
Space Grotesk (the house face of every 2023 dev portfolio).

### Body — **Instrument Sans**, variable

A neutral, slightly narrow grotesque with a taller x-height than its width suggests, so short paragraphs
stay dense and readable. Chosen precisely because it does not compete: next to expanded Archivo Black it
reads as the body text of a report.

### Mono — **IBM Plex Mono**, 400/500

A true mono with engineering provenance and unmistakable letterforms (the tailed `l`, the slab `i`).
Used *only* for document furniture: eyebrows, section codes, stamps, telemetry labels, tags, dates,
the colophon. Never for prose. The discipline of that rule is what keeps the dossier register from
becoming a costume.

### Scale

| Name | Size | Treatment |
| --- | --- | --- |
| `display-xl` | `clamp(3rem, 8vw, 6.25rem)` | Archivo 800, `wdth 116`, caps, `lh .92`, `ls -.021em` |
| `display-lg` | `clamp(1.5rem, 4.2vw, 3rem)` | Archivo 800, `wdth 112`, caps, `lh 1.0` |
| `display-md` | `clamp(1.35rem, 2.2vw, 1.9rem)` | Archivo 700, `wdth 106`, `lh 1.1` |
| `display-sm` | `1.0625rem` | Archivo 700, `wdth 104` |
| `body-lg` | `1.0625–1.1875rem` | Instrument Sans 400, `lh 1.6` |
| `body` | `0.9375–1rem` | Instrument Sans 400, `lh 1.65` |
| `label` | `0.6875rem` | Plex Mono 500, caps, `ls .18em` |
| `stamp` | `0.625rem` | Plex Mono 400, caps, `ls .22em` |

**Sized against the longest unbreakable word, not by eye.** Below 640px the H1 switches
to `wdth 100` and `clamp(1.6rem, 8.8vw, 3.5rem)`; the ceiling on each clamp is the size at which
"CONSTELLATIONS." (the longest single word in the headline) still fits the measure at 320px. The
section-title floor of `1.5rem` is set the same way, by "INSTRUMENTATION". Nothing on the page can
force a horizontal scroll at any width from 320px up.

---

## 4. Layout

A 12-column editorial grid inside a `1280px` container (`24px` gutters, `20px` on mobile). Desktop adds a
**margin rail** — a `8.5rem` left column that carries the section code, sticky to the top of its section,
exactly like the margin of a drawing sheet. Below `1024px` the rail collapses and the code moves inline
above the section title.

A **fixed document frame** sits over the viewport at all times: a hairline inset `10px` from each edge
with tick marks at the corners, the doc number stamped bottom-left, the revision bottom-right (both
desktop only, where the shell's padding guarantees they never cover text), and the scroll-progress line
riding the frame's top edge. It is `position: fixed`, `pointer-events: none`, and it is the single
element that makes the whole page read as one continuous sheet.

### Wireframe

```
┌ fixed frame ───────────────────────────────── scroll progress ▁▁▁▁▁▁ ┐
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ YP · CLOUD SECURITY        01 02 03 04 05 06 07 08    [◐ NIGHT]  │ │  nav (sticky, mono)
│ ├──────────────────────────────────────────────────────────────────┤ │
│ │        │                                                          │ │
│ │  RAIL  │  YOSHWAN PATHIPATI · CS @ VT '27 · AWS CERTIFIED  (mono) │ │
│ │        │                                                          │ │
│ │ SEC 01 │  I SECURE CLOUDS       ┌────────────────────────────────┐│ │
│ │  HERO  │  AND SIMULATE          │  ▓ equirectangular graticule   ││ │  ← SIGNATURE
│ │        │  SATELLITE             │  ╱╲  ground tracks, 3 planes   ││ │
│ │        │  CONSTELLATIONS.       │ ╱  ╲ 12 SV, ISL hairlines,     ││ │
│ │        │                        │      accent packet pulses      ││ │
│ │        │  Cybersecurity intern  └────────────────────────────────┘│ │
│ │        │  at Triple Point...     FIG. 01 / LEO MESH / 12 SV       │ │
│ │        │                                                          │ │
│ │        │  [ VIEW WORK ]  [ DOWNLOAD RÉSUMÉ ↓ ]                    │ │
│ ├────────┴──────────────────────────────────────────────────────────┤ │
│ │  100+          │  45→8 MIN     │  10+          │  AWS SA-C03      │ │  telemetry strip
│ │  FINDINGS      │  DEPLOY       │  RESEARCHERS  │  CERTIFIED       │ │  (counters, hairline cells)
│ ├────────┬──────────────────────────────────────────────────────────┤ │
│ │ SEC 02 │  PROFILE                                    ┌──────────┐ │ │
│ │        │  I'm a computer science student at ...      │ headshot │ │ │  (slot; grid collapses
│ │        │                                             │ optional │ │ │   cleanly when absent)
│ ├────────┼─────────────────────────────────────────────└──────────┘─┤ │
│ │ SEC 03 │  FIELD RECORD                                            │ │
│ │        │  ┌ MAY 2026 — PRESENT ┬ TRIPLE POINT SECURITY ─────────┐ │ │
│ │        │  │ HYBRID, BLACKSBURG │ Cybersecurity Intern           │ │ │  timeline: mono meta
│ │        │  │                    │ ▸ Architected a multi-cloud... │ │ │  left, record right,
│ │        │  └────────────────────┴────────────────────────────────┘ │ │  hairline between
│ │        │  ... 3 more primary entries ...                          │ │
│ │        │  ▸ SHOW EARLIER RECORD (2023)          [collapsed]       │ │
│ ├────────┼──────────────────────────────────────────────────────────┤ │
│ │ SEC 04 │  FEATURED RESEARCH        ── full-width panel, --panel ── │ │
│ │        │  SPACENET TESTBED                                        │ │
│ │        │  narrative ................  │ SPEC SHEET               │ │
│ │        │                              │ PLATFORM  Docker/Flask   │ │
│ │        │                              │ ROLE      Dockerization  │ │
│ │        │                              │ PRESENTED VT SRC 2026    │ │
│ ├────────┼──────────────────────────────────────────────────────────┤ │
│ │ SEC 05 │  SELECTED BUILDS                                         │ │
│ │        │  ┌ BLD-01 ─┐ ┌ BLD-02 ─┐ ┌ BLD-03 ─┐   hover: lift 2px  │ │
│ │        │  │ ▔▔▔▔▔▔▔ │ │         │ │         │   + accent redline │ │
│ │        │  └─────────┘ └─────────┘ └─────────┘   sweeps top edge  │ │
│ ├────────┼──────────────────────────────────────────────────────────┤ │
│ │ SEC 06 │  INSTRUMENTATION      4 groups, typographic, no bars     │ │
│ ├────────┼──────────────────────────────────────────────────────────┤ │
│ │ SEC 07 │  CERTIFICATIONS & EDUCATION          two compact columns │ │
│ ├────────┼──────────────────────────────────────────────────────────┤ │
│ │ SEC 08 │  ESTABLISH CONTACT                                       │ │
│ │        │  YOSHWANPATHIPATI@VT.EDU        ← display-xl, unmissable │ │
│ │        │  LINKEDIN / GITHUB      STATUS: OPEN TO 2027 ROLES       │ │
│ │        │  ── colophon ─────────────────── DOC YP-2027 / REV S26 ─ │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└ DOC NO. YP-2027 ──────────────────────────────────── REV S26 ────────┘
```

Breakpoints: `<640` single column, rail inline · `640–1024` two-up cards, rail inline ·
`≥1024` rail column active, hero splits, builds go three-up · `≥1280` nav shows section names.

The page runs to roughly 8,400px on a phone, so every plate below the hero carries
`content-visibility: auto` with a per-section `contain-intrinsic-size` hint measured from the real
layout (within ~0.4% of true document height, so the scrollbar barely drifts). Because that hint is
still an estimate, `Nav` releases it on the visitor's first `pointerdown` or `keydown`, which
necessarily precedes activating any link, so anchor scrolling always resolves against real layout.

---

## 5. Signature element — FIG. 01, the orbital ground-track plot

A `<canvas>` in the hero rendering a **live equirectangular ground-track plot** of a 12-satellite LEO
mesh. Equirectangular rather than a 3D globe on purpose: a flat plate is what an actual mission document
contains, and a spinning globe is what a template contains.

**What is drawn**

1. **Graticule** — meridians and parallels every 30°, hairline, `--ink-muted` at low alpha, with the
   equator slightly stronger. Corner ticks and `±180 / ±90` labels in `stamp` type.
2. **Ground tracks** — three orbital planes at 53° inclination, RAAN spaced 60°, four satellites each.
   Positions come from real spherical geometry, not a decorative sine:
   `lat = asin(sin i · sin u)`, `lon = atan2(cos i · sin u, cos u) + Ω − ω_earth·t`,
   which produces the correct westward-drifting sinusoid. Tracks are drawn as fine ink lines with
   segment-level alpha falloff behind each satellite, and split cleanly at the ±180° wrap.
3. **Satellites** — 12 small filled squares with a 1px crosshair, `--ink`.
4. **Inter-satellite links** — hairlines between in-plane neighbours and between cross-plane pairs
   within an angular threshold. Non-wrapping segments only.
5. **Packet pulses** — accent dots traveling link paths, max 8 concurrent, spawned on a timer.
6. **Cursor proximity** — links within ~120px of the pointer raise alpha and tint toward `--accent`;
   falls off smoothly. Pointer only, never required for meaning.

**How it stays cheap**

- Graticule + full track sinusoids render **once** to an offscreen canvas and are blitted per frame;
  only 12 sats, ~14 links and ≤8 pulses are recomputed.
- Work is throttled to ~30fps inside `requestAnimationFrame`.
- `IntersectionObserver` stops the loop when the hero leaves the viewport; `visibilitychange` stops it
  when the tab is hidden. Both re-seed time on resume so nothing jumps.
- DPR-aware backing store, capped at 2×. Canvas lives in a fixed-aspect box, so it contributes zero CLS.
- Redrawn on theme change by reading the resolved CSS custom properties.

**Reduced motion.** One frame at `t = 0`, no loop, no pointer response: complete tracks, all 12
satellites, every link drawn as a static hairline mesh, pulses placed at rest positions. The result is a
printed plate from the document, which is the honest static form of this idea rather than a degraded one.
The `FIG. 01` caption is identical in both modes.

---

## 6. Motion

| Element | Spec |
| --- | --- |
| Stamp-in | Full-bleed paper overlay, doc stamp draws in, wipes up. ≤800ms, once per session (`sessionStorage`), skipped entirely under reduced motion. |
| Section reveal | `translateY(14px)` + fade, 420ms, cubic-bezier(.2,.7,.2,1), 150–250ms stagger, `once: true`. |
| Heading decode | Mono character scramble resolving left→right, ~450ms, once, in-view. Real text stays in the accessibility tree via `aria-label`; scramble frames are `aria-hidden`. |
| Counters | Count up on first view, ~1.1s ease-out, `tabular-nums` so the box never reflows. |
| CTA magnetism | Primary CTA translates up to 6px toward the pointer, spring, releases on leave. Pointer-fine only. |
| Card hover | `translateY(-2px)` + accent redline scaling in from the left along the top edge, 260ms. |
| Scroll progress | Accent line on the frame's top edge, width = scroll fraction. |
| Easter egg | Typing `hire` anywhere stamps `APPROVED FOR INTERVIEW` as a rotated outline stamp with the doc number and a résumé link. Esc or click dismisses. Ignored while typing in a field. |

Every one of these is gated on `prefers-reduced-motion: reduce`, where the site renders in its final
state immediately: full opacity, no transforms, counters at final values, static plot. The reduced-motion
build is a finished design, not a stripped one.

---

## 7. Accessibility contract

- Landmarks: `header` / `nav` / `main` / `section[aria-labelledby]` / `footer`. Skip link first in tab order.
- Every text/ground pair verified ≥4.5:1 (≥3:1 for ≥24px display), per the contrast contract in §2.
- Focus: 2px `--accent` outline with 2px offset, visible in both themes, never removed.
- The canvas is `role="img"` with a written description; it carries no information not stated in text.
- Theme toggle is a real `button` with `aria-pressed`; the collapsed experience entry is a native `<details>`.
- Full keyboard traversal, logical order, no traps, no positive `tabindex`.

---

## 8. Self-critique against the banned defaults

| Banned | Status |
| --- | --- |
| Indigo/purple gradient SaaS hero | No gradients anywhere. Flat paper, one orange. |
| Glassmorphism cards | Cards are hairline-bordered flat panels. No blur, no translucency. |
| Warm cream + serif + terracotta | Ground is *cool* (`#FAFAF8`, blue-leaning), zero serifs, accent is saturated orange-red at 100% chroma, nowhere near `#D97757`. |
| Near-black + neon acid-green terminal | Light mode is the default identity; dark mode is blue-black with the same orange, and there is no green in the system. |
| Particle network background | The plot is a foreground **figure** with a caption, deterministic orbital geometry, fixed 12 nodes. Not a random particle field, and not behind the text. |
| Matrix rain / typing-cursor headline | H1 is set type. The decode effect is a 450ms one-shot on section headings only, and never on the H1. |
| Emoji icons, skill bars, star ratings | Skills are typographic lists. No icons except two inline SVG glyphs (arrow, theme). |
| Stock photos, testimonials, lorem ipsum | None. Headshot slot is optional and real or absent. |
| Invented facts | All content is imported from `content.ts`, transcribed from the brief. No metric appears that was not supplied. |

**Revisions made during review.**

1. The first pass had a full-viewport hero canvas sitting *behind* the headline. That is the
   particle-background pattern wearing a costume, and it would have been the most generic thing on the
   page. It is now a bounded, captioned figure with a `FIG. 01` caption, which is both more distinctive
   and more honest to the document concept.
2. The headline was originally set beside the plot in a half-width column, where it wrapped to six
   ragged lines at 100px. It now takes the full measure of the sheet above a two-column band, so the
   type reads at full scale and the plot sits beneath it.
3. Cut during the restraint pass: the margin rail's second line (`Personnel`, `Priority`, `4 primary
   entries`). It was label-shaped filler that added a word without adding information, and the rail is
   stronger carrying only the section code and a hairline. The frame's scroll-progress readout lost its
   numeric percentage for the same reason: the line already says it. Section padding came down from
   `clamp(3.5rem, 9vh, 6.5rem)` to `clamp(3rem, 7vh, 5.5rem)`, because the gaps between plates were
   reading as voids on a phone rather than as breathing room.
