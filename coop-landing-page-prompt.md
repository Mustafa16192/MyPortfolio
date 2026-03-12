Build a single-page marketing site in Vite + React + Tailwind for an early-stage company that helps universities run structured co-op programs and improve career outcomes.

Match the visual language of my portfolio site rather than using generic startup landing-page aesthetics. The design should feel premium, calm, and intentional, with the same overall styling DNA:

- frosted, glass-tinted surfaces used sparingly for nav and key cards
- a soft ambient gradient background presence, similar to a blurred radial glow, not a loud hero illustration
- elegant typography with a refined editorial feel: use a display serif in the spirit of Marcellus for major headings and a clean sans-serif in the spirit of Raleway for supporting text, labels, and UI
- large, centered, confident hero composition with strong spacing rhythm
- rounded pill and card geometry with subtle borders, layered translucency, and soft shadow depth
- restrained but polished motion: staggered reveal on load, smooth section entrance on scroll, refined hover lift, slight glow/specular feel on important cards
- light and dark theme readiness with readable contrast in both modes

Do not make it look like a generic B2B SaaS template. It should feel like a polished portfolio-grade product story: warm, thoughtful, slightly cinematic, but still credible and professional enough for university administrators.

# Premium University-Facing Landing Page for the Co-op Service

## Summary

Build a single-page marketing site in Vite + React + Tailwind for an early-stage company that helps universities run structured co-op programs and improve career outcomes. The site should feel modern, tasteful, premium, and credible. Do not use fake logos, fake testimonials, fake customer names, or unsupported guarantees.

The page should be optimized for university stakeholders first, while still making the student value obvious. Use a polished placeholder brand identity for now and a contact or inquiry CTA that works without needing a backend.

## Product Positioning and Messaging

Position the company as an independent co-op program operator for universities, not as a student job board.

Refine the narrative into a clear landing-page flow:

1. Hero
   Outcome-led value proposition for universities.
   Emphasize structured pathways, employer coordination, and stronger student outcomes.

2. Problem
   Universities face fragmented internship support, limited employer coordination, uneven student readiness, and difficulty operationalizing hands-on career pathways at scale.

3. Solution
   Present the company as managed co-op infrastructure: program design support, employer matching support, structured student pathway support, and operational coordination.

4. How It Works
   Explain a simple 3-step operating model.
   Example structure:
   - Launch a pilot with the university
   - Build and operate the structured internship pathway
   - Support students and employer relationships through execution

5. Why This Matters
   Show benefits such as better student outcomes, stronger employer relationships, clearer pipelines from classroom to work, and more visible experiential-learning value.

6. Proof / Rationale
   Carefully frame co-op-school comparison logic as directional rationale, not proven traction.
   Use careful wording like:
   - “Co-op models suggest that structured work-integrated learning can strengthen career readiness”
   - “We are building toward a more consistent pathway between study and work”
   Avoid overstating claims.

7. Team / Why Us
   Emphasize firsthand student insight, operator empathy, and practical understanding of the transition from university to work.

8. CTA
   End with a university-facing inquiry section inviting a pilot conversation.

Use credible wording such as “structured internship pathway,” “managed co-op infrastructure,” “work-integrated learning,” and “pilot program.”

Do not use “guaranteed placement” or any equivalent promise unless explicitly qualified.

## Technical Approach

Use:

- Vite
- React
- Tailwind CSS

Keep the app intentionally small:

- one page
- section-based composition
- minimal client state
- no router unless clearly useful for future expansion

Organize the implementation into reusable sections and components rather than a single monolithic file.

Suggested structure:

- `src/App.jsx`
- `src/components/sections/Hero.jsx`
- `src/components/sections/Problem.jsx`
- `src/components/sections/Solution.jsx`
- `src/components/sections/HowItWorks.jsx`
- `src/components/sections/WhyItMatters.jsx`
- `src/components/sections/ProofRationale.jsx`
- `src/components/sections/Team.jsx`
- `src/components/sections/InquiryForm.jsx`
- `src/components/layout/Navbar.jsx`
- `src/content/siteContent.js`
- `src/config/siteConfig.js`

## Visual and Interaction Direction

Design direction: portfolio-inspired luxury minimalism with ambient depth.

The page should visually echo my portfolio site’s design system:

- translucent header or nav with backdrop blur and soft border
- subtle ambient gradient wash in the background, especially around the hero
- centered hero content with compact but confident proof points
- cards with rounded corners, thin borders, soft glow, and restrained hover response
- elegant serif display headlines paired with clean UI sans-serif
- editorial spacing and clear vertical pacing between sections
- premium but not flashy motion

Use a clean neutral base plus one sophisticated accent color. Good accent directions:

- warm coral
- muted copper
- subdued indigo
- soft teal

Keep the palette disciplined. No neon gradients, no crypto-style glow overload, no noisy dashboards.

Motion should be tasteful and restrained:

- staggered reveal on load
- smooth scroll-triggered section entrances
- subtle card/button hover transitions
- gentle background glow or atmospheric movement in the hero only

Avoid:

- heavy parallax
- autoplay video
- excessive glassmorphism
- crowded analytics mockups
- generic SaaS illustration blobs

## Brand and Content Decisions

Use a polished placeholder brand and centralize it in a single config file so it can be swapped later.

Use a placeholder brand name that sounds premium and credible in higher education. For now, use:

- Brand name: `Northlane Co-op`
- Placeholder email: `hello@northlanecoop.com`

Keep those values centralized in config constants.

Primary CTA label should be in this family:

- “Request a Pilot Conversation”
- “Talk About a Campus Pilot”

Pick one primary label and keep it consistent.

Do not include:

- fabricated testimonials
- fabricated customer logos
- fabricated university partnerships
- fabricated outcome metrics

Any pitch-deck-inspired claims must be written as directional rationale or early-stage conviction, not established proof.

## Page Sections

Build the page with these sections:

1. Sticky or semi-sticky top nav
   Include brand, anchor links, and primary CTA.

2. Hero
   Clear university-facing headline.
   Strong subhead.
   Primary CTA and secondary anchor CTA.
   A small row of proof-style statements or operating principles.

3. Problem
   Explain fragmentation in internship and career support.

4. Solution
   Explain the managed co-op infrastructure model.

5. How It Works
   Present as 3 premium cards or steps.

6. Why This Matters
   Focus on outcomes for institutions, employers, and students.

7. Proof / Rationale
   Use careful, non-overclaiming framing about the value of structured co-op style programs.

8. Team / Why Us
   Human, credible, and early-stage.

9. Inquiry / CTA
   Form and final invitation to talk.

10. Footer
   Minimal, polished, and consistent with the page.

## CTA and Form Behavior

Implement a polished university inquiry form directly on the landing page.

No backend is in scope. The form should be decision-complete with:

- client-side validation
- clear inline errors
- polished success guidance
- `mailto:` submission to the placeholder company email

Fields:

- name
- university
- role
- email
- message

Behavior requirements:

- validate required fields
- validate email format
- preserve entered values while validation errors are shown
- on valid submit, compose a `mailto:` draft with a useful subject line and structured body
- include accessible labels, focus states, and keyboard-friendly behavior

## Tone and Copy Guidance

Write in a credible, polished, university-facing tone.

The copy should feel:

- strategic
- calm
- informed
- professional
- early-stage but serious

Avoid:

- hype language
- inflated startup clichés
- unsupported certainty
- aggressive sales copy

The site should communicate that this is a thoughtful operator-led offering that could begin as a pilot, not a fully proven institutional platform with years of traction.

## Accessibility and Quality Bar

Ensure:

- strong type hierarchy
- keyboard accessibility
- visible focus states
- sufficient color contrast
- reduced-motion consideration
- no layout shift caused by animation
- responsive layout on desktop and mobile

## Test Plan

Verify:

- the page renders cleanly on desktop and mobile
- the hero communicates university-facing value within the first viewport
- all nav anchors scroll correctly
- motion feels smooth and restrained
- the inquiry form validates empty fields and malformed email
- valid form submission generates the expected `mailto:` payload
- keyboard accessibility works for nav, buttons, and form controls
- contrast is readable in light and dark themes
- no copy exceeds what is actually supportable by an early-stage pitch

## Assumptions and Defaults

- Audience default: university administrators, career services leaders, academic program leaders
- Stack default: Vite + React + Tailwind
- Structure default: one polished landing page
- Motion default: premium but restrained
- Credibility default: conceptual but credible
- Backend default: none; form uses validated `mailto:` flow
- Branding default: temporary placeholder brand and placeholder email in centralized config

## Final Output Expectations

Generate production-ready frontend code with reusable components, clean Tailwind utility structure, and centralized content/config values.

The result should feel like this concept was designed in the same studio as my portfolio site:

- elegant, not loud
- atmospheric, not gimmicky
- premium, not overdesigned
- polished, not template-like
- credible enough for higher-ed decision-makers
