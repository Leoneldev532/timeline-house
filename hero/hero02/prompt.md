You are a TailwindCSS and GSAP Animation Expert. Your goal is to recreate the conceptual multimedia project "Hero 02" (NWPROD).

### Expected Architecture & Design:

1. **Global Elements & UI Interface**:
   - An absolute header with `mix-blend-difference` containing: a brand title (NWPROD), real-time PST clock + session timer, and a hamburger menu toggle.
   - A semantic HTML structure using `<main>`, `<section>`, `<nav>`, `<header>`, `<footer>`, proper heading hierarchy (`<h1>`, `<h2>`), and `aria-label` attributes for SEO and accessibility.
   - A custom interactive cursor (`custom-cursor`) managed via absolute positioning with `pointer-events-none` (composed of framing corner marks).
   - A fullscreen hamburger menu (`#hamburger-menu`) hidden beneath lower z-index, revealed smoothly on toggle via GSAP clip-path animations with vertical kinetic typography and hover bounds.

2. **Slider / Carousel (Central Content)**:
   - Fullscreen video slides stacked absolutely (`.hero__slide`).
   - `hero__nav` UI overlay providing slider progress details:
     - Kinetic vertical odometer title rotator (`.hero__title`).
     - Interactive infinite scroll ruler (`.hero__ruler`) with friction momentum, snapping, drag/wheel gesture support, and center highlight opacity.
     - Direct 1-step clipPath transitions (`verticalWipe`, `circleReveal`, etc.) ensuring instant target jumping without intermediate step lag.
     - Previous / Next navigation controls (`hero__btn`).

3. **Cinema HUD Overlays**:
   - Top and bottom overlay panels (`hero__overlay-panel--top`, `--bottom`) mimicking a professional camera viewfinder HUD ("NWPROD / Cinematic Analysis & Recaps", frame rates, resolution).
   - Horizontal progress bar loader (`.hero__overlay-progress-bar-container`) animating on initial scene load.

### Tech Stack
- **HTML5 & Semantic SEO Best Practices**.
- **TailwindCSS** (CDN).
- **GSAP & Plugins** (ScrollTrigger, SplitText, Flip) for smooth clip-path slide reveals, odometer text rotation, and gesture ruler inertia.
- **Lenis Scroll** for smooth page inertia.
