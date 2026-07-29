You are a TailwindCSS and GSAP Animation Expert. Your goal is to recreate the conceptual multimedia project "Hero 06" (NWPROD).

### Brand Identity
NWPROD is an **audiovisual production house** specializing in cinematic gallery animations and seamless transitions. The interface should feel premium, dynamic, and focused on video content, mimicking a cinematic and high-end visual experience.

### Expected Architecture & Design:

1. **Global Elements & UI Interface**:
   - An absolute header fixed at the top with high z-index containing: a brand title (Nwprod), a work count, contact, and about links.
   - A semantic HTML structure using `<main>`, `<nav>`, `<header>`, proper heading hierarchy (`<h1>` screen-reader only for SEO), and `aria-label` attributes for accessibility.
   - Text styling using the custom "helveticaNow" font for a clean, modern aesthetic.
   - A responsive design handling different layouts and interactions for desktop and mobile devices.

2. **Cinematic Animation Gallery (Central Content)**:
   - Fullscreen video elements showcasing audiovisual projects with a dark mode base (`bg-black`).
   - High-quality videos hosted on Cloudinary, set to autoplay, mute, and loop natively.
   - **Desktop Interaction**:
     - GSAP `Flip` plugin is used to animate video tiles from a grid-like or absolute stacked layout into a seamless, full-screen horizontal carousel on initial load.
     - Infinite horizontal scrolling mechanics implemented using custom momentum and friction physics controlled via the mouse `wheel` event.
     - The carousel dynamically clones items to ensure an infinite loop without jumping.
     - Interactive text links (`.hero__carousel-item-link`) in the foreground update their opacity based on the currently active video centered in the carousel.
   - **Mobile Interaction**:
     - Vertical scrolling layout using GSAP `ScrollTrigger` to track progress.
     - The text navigation links crossfade (`autoAlpha`) as the user scrolls vertically through the stacked videos, keeping the active project name highlighted.

3. **Text Revelations**:
   - SplitText and `clip-path` animations to smoothly reveal the carousel menu text and navigation links from the bottom up during the intro sequence.

### Tech Stack
- **HTML5 & Semantic SEO Best Practices**.
- **TailwindCSS** (CDN).
- **Vanilla CSS** for custom fonts (`@font-face`) and specific carousel layout styling (`.item-carousel`).
- **GSAP & Plugins** (ScrollTrigger, SplitText, Flip, CustomEase) for layout transitions, scroll tracking, and text reveals.
- **Lenis Scroll** for smooth page inertia.
