# BuildWithMustafa Design System, Style Guide, and Implementation Spec

This document records the actual design rules, interaction decisions, and implementation details used in this portfolio. It is both a visual style guide and an engineering reference.

Scope:
- Global visual language (theme, type, spacing, ambient layers)
- Frosted-glass surfaces and 3D tilt cards (exact implementation model)
- Motion system (GSAP vs Framer Motion roles)
- Browser/Safari constraints and the decisions we made to keep the experience smooth
- Component-level patterns (header, badge, PM Terminal, project UI, new depth sections)
- Practical rules for building new UI that fits the site

Primary implementation files referenced throughout:
- `src/index.css`
- `src/app/App.css`
- `src/header/style.css`
- `src/utils/premiumTiltCards.js`
- `src/pages/home/style.css`
- `src/pages/project_overview/style.css`
- `src/components/operating_principles/style.css`
- `src/components/decision_log/style.css`
- `src/components/project_tradeoffs/style.css`
- `src/components/pm_terminal/style.css`

## 1. Core Design Philosophy (What We Optimize For)

### 1.1 Visual bar
This site is intentionally:
- Premium
- Polished
- Tasteful
- Cohesive
- Slightly playful (but never noisy)

We do **not** optimize for:
- Flashy animation demos
- Generic portfolio templates
- Decorative motion without information value
- Trend-chasing UI gimmicks

### 1.2 Product/interaction tone
The site should feel like a product made by someone who ships real things:
- Clear hierarchy
- Focused motion
- Strong readability
- Ambient depth instead of visual clutter
- “Insider” interactions (ex: PM Terminal) introduced with subtle discoverability

### 1.3 Engineering philosophy for UI
We prefer:
- Reusable patterns over one-off visual hacks
- Content-driven components (`src/content_option.js`) over hardcoded page copy
- GSAP for nuanced scroll/entry work
- Framer Motion only where route/presence mechanics make sense
- Browser stability (especially Safari) over theoretically cooler transitions

## 2. Global Theme and Tokens

Defined in `src/index.css`.

### 2.1 Root theme tokens
Global variables:
- `--bg-color`
- `--primary-color`
- `--secondary-color`
- `--text-color`
- `--text-color-2`
- `--text-color-3`
- `--overlay-color`
- `--cursor-primary`
- `--cursor-secondary`

Theme mode is controlled via `data-theme="light"` / `data-theme="dark"` on `document.documentElement`.

### 2.2 Theme usage rules
- `--text-color` is the default foreground.
- `--text-color-2` is used for nav/control text and secondary contrast.
- `--primary-color` and `--bg-color` drive body chrome/borders and page base.
- Frosted/glass components typically use explicit rgba layers instead of only token colors, but still inherit text colors from theme tokens.

### 2.3 Body and page-shell decisions
Global body behavior in `src/index.css`:
- `overflow-y: scroll` is forced to avoid layout jumps when route content heights change.
- Body gets left/right borders (`10px`) using `--primary-color` to create a framed canvas look.
- Global fonts are split by role:
  - `Raleway` for body/UI text
  - `Marcellus` for headings

## 3. Typography System

### 3.1 Fonts by role
- Headings: `Marcellus`
- Body text / nav / UI controls: `Raleway`
- Code/terminal / dev accents: monospace stacks (JetBrains Mono, Fira Code, SF Mono, Menlo, Consolas)

### 3.2 Tone rules
- Headings use tighter tracking and larger visual contrast.
- Eyebrows/labels use:
  - uppercase
  - high letter spacing (`~0.08em` to `0.12em`)
  - bold weight
  - reduced opacity (quiet metadata)
- CTA text tends to be uppercase and tightly controlled (small size, high weight).

### 3.3 Readability rules
- Body copy line-height is generous in detailed sections (`~1.45` to `1.72`).
- Long text wraps and hyphenates globally (`word-break`, `hyphens`) to prevent layout breakage.
- Dense metadata is broken into label/value rows instead of long paragraph chunks.

## 4. Layout, Spacing, and Structure

### 4.1 Overall structure
The site uses a layered shell:
- `app_shell` (global stacking context)
- `s_c` (main route surface with ambient overlay)
- fixed header chrome
- fixed decorative frame borders
- fixed floating badge

### 4.2 Spacing rhythm
Patterns seen across components:
- Small internal card padding: `10px` to `14px`
- Medium card padding: `14px` to `22px`
- Radius language: `10px` to `22px`, most glass cards land at `16px`, `18px`, or `22px`
- Section gaps are driven by page-specific rhythm, typically `12px`, `14px`, `16px`, `24px`, `28px`

### 4.3 Responsive strategy
- Desktop (`>= 992px`) gets the most expressive layout (multi-column grids, hover/tilt, sticky side nav)
- Mobile suppresses non-essential visual complexity:
  - no hover tilt behavior
  - simplified layouts/grids collapse
  - hidden micro-hints and some floating UI affordances

## 5. Ambient Background and Frosted Canvas Layer

### 5.1 Ambient orb (`src/app/App.css`)
`.global-ambient-bg` creates the signature atmospheric color bloom:
- large radial gradient orb
- heavy blur (`blur(92px)`)
- hue rotation animation (slow and subtle)
- fixed position, pointer-events none, behind content (`z-index: -2`)

This is a background identity layer, not content UI.

### 5.2 Main ambient veil (`.s_c::before`)
The route container adds a subtle fixed overlay:
- radial highlight in top-left
- soft vertical gradient wash
- tiny backdrop blur/saturation

Purpose:
- unify pages visually
- soften the background
- create a premium atmospheric surface without a flat background

Fallback behavior:
- `@supports not (backdrop-filter)` provides non-blur alternatives using plain gradients.

## 6. Glass Surface System (Shared Visual Recipe)

This is the core visual pattern used across cards, header shell, badge popover, project navigation, and terminal surfaces.

### 6.1 Glass recipe (base pattern)
Most frosted/glass surfaces follow this structure:
- Rounded border radius (`16px`–`22px`)
- Thin semi-transparent border (`rgba(..., 0.10-0.18)`)
- Low-opacity layered background (`linear-gradient` / `rgba`) 
- `backdrop-filter: blur(...) saturate(...)` when supported
- Soft shadow for elevation (`0 8px 22px` to `0 18px 58px` depending on surface size)
- Subtle hover/focus shift (border contrast increase, tiny translateY, shadow lift)

### 6.2 Dark vs light behavior
Dark mode glass is not simply inverted.
Design decisions:
- Dark surfaces lean into translucent charcoal and deeper shadows.
- Light surfaces use brighter fills with faint neutral borders and reduced shadow opacity.
- Highlight overlays in light mode often switch from `mix-blend-mode: screen` to `normal` for cleaner rendering.

### 6.3 Backdrop-filter fallback rule
Every important blur-heavy surface should remain legible without blur support.
Current codebase pattern:
- explicit `@supports not (...)` fallback for main shell/header canvas
- individual cards often still read fine because they rely on borders + layered gradients, not blur alone

## 7. The 3D Tilting Glass Cards (Exact Implementation Spec)

This is the signature interaction pattern behind:
- Home hero proof cards (`.hero_proof_item`)
- Home featured project rows (`.featured_project_row`)
- About "Operating Principles" cards (`.operating-principles__card`)
- About "Decision Log" cards (`.decision-log__card`)

### 7.1 Visual anatomy of a tilt glass card (CSS)
Each card uses the same structural pattern:

Base element requirements:
- `position: relative`
- `isolation: isolate`
- `transform-style: preserve-3d`
- `backface-visibility: hidden`
- `will-change: transform, border-color, box-shadow`
- `overflow: visible` (or hidden depending on component needs)

Shared CSS variables on the card:
- `--lx` and `--ly`: light origin position (%), driven by pointer position
- `--edge-alpha`: edge/rim intensity
- `--spec-alpha`: specular highlight intensity
- `--spark-shift`: horizontal offset for secondary highlight sweep

Pseudo-elements:
- `::before` = specular highlight sheet
  - radial gradient anchored at `var(--lx) var(--ly)`
  - stronger white center fading outward
  - in dark mode often uses `mix-blend-mode: screen`
- `::after` = edge/rim/spark layer
  - radial gradient with blue/maize-ish highlight tones
  - anchored at `calc(var(--lx) + var(--spark-shift)) var(--ly)`

Important rule:
- All actual content children are lifted above overlays via:
  - `.card > * { position: relative; z-index: 1; }`

### 7.2 Interaction states (CSS)
Cards typically have three states:
- Rest
  - subtle border
  - minimal/no shadow
- Hover/Focus/Expanded
  - slightly stronger border
  - tiny `translateY(-1px)` or `translateY(-2px)`
  - modest shadow lift
- `.is-tilting`
  - stronger border and shadow while RAF tilt loop is active

Why `.is-tilting` exists:
- The card can look “alive” even if transforms are small, because border/shadow states track pointer engagement.

### 7.3 Exact tilt algorithm (JS) - `src/utils/premiumTiltCards.js`
The reusable tilt utility uses a RAF-smoothed pointer model.

#### Input and normalization
On `pointermove`:
1. Read card bounds (`getBoundingClientRect()`)
2. Compute relative pointer position (`0..1`) for x/y
3. Clamp x/y to card bounds
4. Convert to center-based coordinates:
   - `dx = x - 0.5`
   - `dy = y - 0.5`
5. Compute distance factor:
   - `distanceFromCenter = min(1, sqrt(dx^2 + dy^2) * 1.7)`

#### Target values generated from pointer position
- `targetY = dx * maxRotateY * 2`
- `targetX = -dy * maxRotateX * 2`
- `targetLX = x * 100`
- `targetLY = y * 100`
- `targetEdge = 0.06 + distanceFromCenter * 0.16`
- `targetSpec = 0.09 + min(1, (abs(targetX)+abs(targetY))/18) * 0.18`
- `targetSpark = dx * 7`

Interpretation:
- Pointer position controls both physical tilt and light response.
- Light gets stronger toward edges and with stronger tilt.
- Secondary spark shift adds a subtle “moving lens” effect across the card surface.

#### Smoothing and animation
Each frame uses lerp-style easing (`easing` default `0.16`) to move `current*` values toward `target*` values.

This creates:
- smooth response
- no harsh snapping
- easier Safari/GPU compositing than aggressive spring physics

#### Transform application
When active, the card transform becomes:
- `perspective(980px) rotateX(...) rotateY(...)`

If tilt is near zero (`< 0.01` on both axes), transform is cleared to avoid unnecessary compositing overhead.

#### Stop conditions and cleanup
The RAF loop stops when:
- tilt and light values are close to targets
- targets are back to zero/default (after `pointerleave`)

Cleanup returns a function that:
- removes listeners
- cancels RAF
- removes `.is-tilting`
- clears inline transform and CSS variables

This is important for React unmount safety and route changes.

### 7.4 Utility options and standard parameters
`setupPremiumTiltCards(cards, options)` supports:
- `maxRotateX` (default `4`)
- `maxRotateY` (default `5`)
- `easing` (default `0.16`)
- `defaultEdgeAlpha` (default `0.05`)
- `defaultSpecAlpha` (default `0.08`)

Current component presets:
- Operating Principles: `maxRotateX: 3.6`, `maxRotateY: 4.4`
- Decision Log: `maxRotateX: 3.8`, `maxRotateY: 4.8`
- Home hero/featured: local inline variant uses `4` / `5`

Rule:
- Keep rotation small. The effect should read as depth, not a card gimmick.

### 7.5 Where the reusable tilt utility is used vs bespoke
Reusable utility (`setupPremiumTiltCards`) currently powers:
- `OperatingPrinciples`
- `DecisionLog`

Home page currently uses a local inline tilt implementation for hero proof cards and featured rows with the same algorithm shape.

Design system decision:
- The visual behavior is the same pattern.
- The current difference is implementation location, not design intent.

### 7.6 Reduced motion behavior for tilt cards
For `prefers-reduced-motion: reduce`:
- transitions are removed or minimized
- pseudo highlight layers are hidden or forced to zero opacity in some contexts (Home)
- no tilt setup should run (or it should be skipped)

This preserves readability while removing cosmetic motion.

## 8. Component Recipes (How the Major Pieces Are Built)

### 8.1 Header shell (glass navigation chrome)
File: `src/header/style.css`

The header bar is a premium frosted capsule:
- wide pill-shaped container (`border-radius: 115px`)
- semi-transparent border and fill
- blur + saturate
- shadow tuned by `--project-focus` variable

Project-focus integration:
- Header glass intensity changes using `--project-focus` (set by Home GSAP scroll behavior)
- This subtly shifts nav chrome emphasis during project-focused scrolling states

Rule:
- Header remains premium but not heavy. It should feel like UI chrome, not a banner.

### 8.2 Framer badge and popover (fixed playful proof-of-build)
File: `src/app/App.css`

The "Not Made in Framer ;)" badge is intentionally playful but still on-brand:
- pill badge with strong typography
- subtle hover lift
- glass popover on hover/focus (desktop)
- dark/light themed variants

Design rule:
- The badge may be playful, but the styling remains consistent with the glass system.
- It is hidden when terminal overlay/page is active to avoid competing floating UI.

### 8.3 Home hero proof cards
File: `src/pages/home/style.css`

These are mini glass cards used as proof statements under the hero.
Characteristics:
- compact height (`min-height ~86px`)
- center-aligned text
- full tilt/highlight system
- subtle `.is-tilting` elevation

Design intent:
- quick credibility scan without looking like stat blocks
- premium “surface” feel in the first screenful

### 8.4 Home featured project rows
File: `src/pages/home/style.css`

These are larger, horizontally structured glass cards:
- grid layout for info + media
- tilt glass overlays same as hero proof cards
- hover lift includes slight scale (`~1.002`) + image scale (`~1.015`)

Rule:
- The row moves a little more than smaller cards because it is a primary navigation element.
- Still no dramatic motion or spring bounce.

### 8.5 Operating Principles cards (About page)
Files:
- `src/components/operating_principles/index.js`
- `src/components/operating_principles/style.css`

Pattern:
- text-first frosted cards with tilt
- hidden/revealed example line on hover/focus/click
- tag chip + principle + example

Important interaction design:
- Desktop: hover and tilt feel premium
- Touch/mobile: click toggles expansion; no tilt expected

### 8.6 Decision Log cards (About page)
Files:
- `src/components/decision_log/index.js`
- `src/components/decision_log/style.css`

Pattern:
- dense evidence cards (Context / Constraint / Call / Outcome)
- same premium tilt + reflective overlays
- CTA pill inside card footer
- optional `NDA-safe` badge

Design intent:
- reads as senior judgment, not resume filler
- proof-oriented structure over adjectives

### 8.7 Project Tradeoffs accordion (Project pages)
Files:
- `src/components/project_tradeoffs/index.js`
- `src/components/project_tradeoffs/style.css`

Pattern:
- frosted accordion rows (no 3D tilt)
- calm open/close using `grid-template-rows` transitions
- plus icon rotates to `+45deg`
- compact metadata rows (`Decision`, `Reason`, `Impact`, optional `Confidence` pill)

Why no tilt here:
- This section is about reading and evaluation, not playful hover exploration
- Accordions already have interaction affordance; adding tilt would be excessive

### 8.8 Project overview image and chapter nav (Safari-safe)
Files:
- `src/pages/project_overview/style.css`
- `src/pages/project_overview/index.js`

Key design/engineering decisions:
- Project hero image container is intentionally not a glass card anymore
- Avoid blur on hero image container for stability (`backdrop-filter: none`)
- Add compositing stabilizers:
  - `transform: translateZ(0)`
  - `backface-visibility: hidden`
- Intro animation uses short GSAP fade/settle (no shared-layout spring image transitions)

Reason:
- Safari exposed flashing/jitter with shared-layout image motion and route overlaps

### 8.9 PM Terminal (overlay + route)
Files:
- `src/components/pm_terminal/*`
- `src/pages/terminal/*`

The terminal is a separate but related visual subsystem.

Visual strategy:
- dark premium terminal shell even in light site theme
- glass-backed overlay backdrop (blur + dim gradient)
- terminal chrome inspired by modern dev tools, not retro DOS

Terminal shell design tokens are local (`--pm-*`) and intentionally separate from global theme tokens.
This allows:
- a consistent terminal feel regardless of page theme
- a controlled dark UI palette with optional GoBlue accent mode

### 8.10 Header PM Terminal micro-hint (`<dev mode>`)
Files:
- `src/header/index.js`
- `src/header/style.css`

Pattern:
- contextual first-visit micro-hint in header controls
- copy: `Press Cmd/Ctrl+K for <dev mode>` (visual shows keyboard symbol on compatible keyboards)
- code-like token pill (`<dev mode>`) using monospace mini-chip styling
- hidden on mobile, `/terminal`, project pages, and while terminal is open

Behavior decisions:
- delayed reveal (~3.8s)
- visible for ~4.2s
- persisted in `localStorage` using `pm-terminal-devmode-hint-seen-v1`
- clickable and opens terminal overlay

Intent:
- discoverable but still easter-egg-like
- playful copy, premium surface treatment

## 9. Motion System and Interaction Rules

### 9.1 Motion roles by library
- **GSAP**: section reveals, scroll-linked focus behavior, nuanced staged intros, terminal overlay motion
- **Framer Motion**: route presence management only (where needed)

Rule:
- Avoid overlapping page opacity fades and complex shared-layout image transitions on critical project flows (Safari risk).

### 9.2 Motion style rules
Preferred motion characteristics:
- short duration (`~0.18s` to `0.42s` common)
- restrained easing (`power2.out`, `power3.out`, similar)
- subtle `y` shifts (`~8px` to `18px` intro offsets)
- no bounce/spring theatrics for serious content sections

### 9.3 Reveal patterns
Common GSAP reveal pattern:
- `autoAlpha: 0 -> 1`
- `y: 10..12 -> 0`
- short stagger (`0.04` to `0.08`) for card groups
- `ScrollTrigger` once-per-view for non-hero sections

### 9.4 Reduced motion policy
For `prefers-reduced-motion: reduce`:
- remove or minimize transform motion
- skip tilt setup
- disable or reduce decorative transitions
- keep state changes functional and legible

## 10. Safari and Browser Stability Decisions (Critical)

These are not optional. They are part of the design system because they protect the intended feel.

### 10.1 What Safari exposed
Safari surfaced issues that Chrome masked:
- route flash frames during overlapping transitions
- jittery hero image transitions on project pages
- visible scroll resets/restoration movement

### 10.2 What we changed (design + engineering decisions)
- Removed/avoided flashy page opacity route fades for Home/Project flow
- Replaced problematic project hero image motion with a short GSAP intro
- Added compositing stabilizers (`translateZ(0)`, `backface-visibility`) to project hero image/container
- Removed forced smooth-scroll restoration on project return flows
- Skipped scroll-to-top resets for `/project/:id` route transitions in route exit handling

Design implication:
- "Smooth" is defined by visual continuity and stability, not by having more animation.

## 11. Content System and Information Architecture Rules

### 11.1 Centralized content source
File: `src/content_option.js`

Rule:
- Content, labels, project data, and structured personal narrative content should live here first.
- Page components should render from data rather than hardcoding blocks whenever possible.

### 11.2 Personality depth content format (current additions)
Current structured additions:
- `operatingPrinciples`
- `decisionLog`
- `dataportfolio[].tradeoffs`

Design rule:
- Personality is expressed through structured evidence (principles/decisions/tradeoffs), not decorative copy.

## 12. Accessibility and UX Consistency Rules

### 12.1 Interaction parity
If a card reveals content on hover, it must also support:
- click/tap or focus-visible state
- keyboard access where applicable

### 12.2 Focus styles
Focus rings are present and consistent for interactive elements:
- subtle but visible outlines (`rgba(127, 151, 255, ~0.56)` pattern appears across components)

### 12.3 Touch-device behavior
On touch/coarse pointer:
- hide hover-only hints and micro interactions
- avoid tilt effects
- preserve layout clarity and tap targets

## 13. Recipe: How to Build a New Premium 3D Glass Card (Step-by-Step)

Use this process for any new card that should match the existing system.

### Step 1: Start with the base card shell
Use:
- radius `16px` to `18px`
- thin translucent border (`rgba(255,255,255,0.14-0.18)` dark mode)
- low-opacity background (`rgba(255,255,255,0.03)` or soft linear gradient)
- `position: relative`, `isolation: isolate`
- `transform-style: preserve-3d`
- `backface-visibility: hidden`

### Step 2: Add the light-reactive CSS variables
Initialize on the card:
- `--lx: 50%`
- `--ly: 50%`
- `--edge-alpha: 0.05`
- `--spec-alpha: 0.08`
- `--spark-shift: 0%`

### Step 3: Add `::before` and `::after` overlays
- `::before` = specular white highlight (radial gradient at `--lx/--ly`)
- `::after` = rim/spark layer (radial gradient using `calc(var(--lx) + var(--spark-shift))`)

Keep both:
- `pointer-events: none`
- `z-index: 0`

Then lift real content above them:
- `.your-card > * { position: relative; z-index: 1; }`

### Step 4: Define rest/hover/tilting states
- Hover/focus: slightly stronger border + tiny lift + modest shadow
- `.is-tilting`: stronger shadow and border during active pointer movement

### Step 5: Add tilt behavior (desktop only)
Use `setupPremiumTiltCards(...)` if possible.
Recommended defaults:
- `maxRotateX: 3.6-4`
- `maxRotateY: 4.4-5`

Only enable when all are true:
- not reduced motion
- fine pointer
- hover supported
- desktop layout (if card density would suffer on mobile)

### Step 6: Add light theme overrides
At minimum:
- border becomes darker/neutral
- background switches to subtle dark-on-light tint or white blend
- highlight blend mode may switch to `normal`
- shadow opacity is reduced

### Step 7: Add reduced-motion fallback
Disable or reduce:
- transitions
- pseudo highlight opacity effects
- tilt setup entirely

## 14. Do / Do Not (Guardrails for Future Work)

### Do
- Reuse existing frosted/glass visual language
- Keep interactions short and input-responsive
- Use tilt only for navigational or personality-heavy cards, not every surface
- Prefer structured content sections (Decision Log, Principles, Tradeoffs) over generic "about me" fluff
- Test Safari for any new route/image/overlay motion

### Do Not
- Add bounce/spring-heavy animations to core reading flows
- Reintroduce flashy route fades on project transitions
- Add random new color systems disconnected from current ambient + glass palette
- Turn every component into a tilt card
- Rely on blur alone for readability

## 15. Current Known Implementation Notes (Truth in Documentation)

- Home page tilt behavior for hero proof cards and featured project rows currently uses a local inline tilt implementation that mirrors the shared utility logic. This is a code organization detail, not a visual inconsistency.
- The PM Terminal uses a separate local token system (`--pm-*`) because it is intentionally a dark, self-contained UI surface.
- The header micro-hint is intentionally one-time and desktop-only to preserve the easter-egg feel.

## 16. Suggested Future Documentation Maintenance Rule

When adding a new visual pattern, update this file with:
1. Where it lives (`path`)
2. Why it exists (design intent)
3. How it behaves (interaction states)
4. Motion/reduced-motion behavior
5. Safari/compat concerns (if any)

That keeps the site's visual quality consistent even as the codebase grows.
