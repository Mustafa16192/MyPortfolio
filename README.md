# Mustafa Ali Mirza — Portfolio

Personal portfolio for **Mustafa Ali Mirza** (Product Manager), built as a polished case-study website with strong information hierarchy, premium motion, and clear storytelling.

Live site: **https://buildwithmustafa.com**

## What This Project Optimizes For

This project is intentionally opinionated:

- **Clarity first**: the homepage quickly communicates positioning, outcomes, and featured work.
- **Premium but restrained motion**: GSAP is used for purposeful sequencing and scroll context, not flashy effects.
- **Trust through craft**: consistent typography, spacing, and interaction behavior across pages.
- **Mobile realism**: desktop and mobile navigation patterns are explicitly different by design.

## Product + Design Decisions

### 1. Hero behavior (homepage)

- Staggered first-render intro for status line, headline, subtitle, and proof cards.
- Featured-project block transitions into focus as the user scrolls.
- Subtle motion hierarchy keeps attention on content, not effects.

### 2. Project presentation

- Featured projects are image-left + narrative-right rows (not cropped card thumbnails).
- Metadata, role, timeline, and CTA are structured for quick scanability.
- Portfolio and section headings use a consistent typewriter heading treatment.

### 3. Navigation model

- **Desktop (`>= 992px`)**: brand + inline quick links + theme toggle, no hamburger.
- **Mobile (`< 992px`)**: brand + theme toggle + hamburger, no inline quick links.
- Mobile menu is overlay-based and optimized for thumb navigation.

### 4. Brand details and micro-interactions

- Floating glass nav with responsive behavior.
- Hover character interaction for the University of Michigan mention.
- Bottom-right Framer-style pill with attribution popover and source link.

## Accessibility + UX Considerations

- `prefers-reduced-motion` fallbacks are included for key animated areas.
- Focus states and keyboard access are supported on interactive controls.
- Mobile popovers are selectively disabled where they hurt usability.
- Route transitions are managed to reduce visual discontinuity.

## Tech Stack

- **React 18** (Create React App)
- **React Router v6**
- **GSAP + ScrollTrigger**
- **Framer Motion**
- **React Bootstrap**
- **React Icons**
- **React Helmet Async**
- **EmailJS** (contact form)

## Project Structure

```text
src/
  app/                 # App shell, global background, routes, fixed badge
  header/              # Floating nav, desktop/mobile behavior
  components/          # Reusable UI (social icons, theme toggle, typewriter, hover widgets)
  pages/
    home/              # Hero, featured projects, GSAP choreography
    portfolio/         # Project listing
    project_overview/  # Case-study detail view
    resume/
    about/
    contact/
  content_option.js    # Primary content source (copy, projects, links, timeline)
```

## Local Development

Use one package manager per branch. This repo uses `yarn` in scripts.

```bash
yarn install
yarn start
```

Production build:

```bash
yarn build
```

Deploy prep (also writes `404.html` for static hosting fallback):

```bash
yarn predeploy
```

## Content Editing

For most text/content updates, start with:

- `src/content_option.js`

For layout/interaction updates, check:

- `src/pages/home/`
- `src/header/`
- `src/app/App.css`

## Contact Form

The contact page uses EmailJS. Configure keys via environment variables (recommended) and do not commit secrets.

## License

MIT (see `LICENSE`).
