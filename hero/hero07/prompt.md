You are a TailwindCSS and GSAP Animation Expert. Your goal is to recreate the conceptual portfolio project "Hero 07" (Luc Favre — Photojournalist).

### Brand Identity
Luc Favre is a **photojournalist and visual reporter** based in New York, established in 1994. The interface should feel editorial, raw, and high-impact — evoking the tactile quality of press photography archives, with a clean typographic grid and a cinematic image reveal sequence.

### Expected Architecture & Design:

1. **Global Elements & UI Interface**:
   - A fixed header at the top with high z-index containing three navigation nodes: a `WORK` link on the left, a centered brand block (`LUCFAVRE` + tagline), and an `INFO` link on the right.
   - The brand block presents two stacked elements: the bold logotype (`LUCFAVRE`) and a subtitle line (`New York ink. Photoreporter. EST 1994`).
   - Semantic HTML structure using `<main>`, `<header>`, `<nav>`, `<section>`, `<figure>`, and `<figcaption>` elements with `aria-label` attributes for full accessibility compliance.
   - Hidden `<h1>` equivalent provided via `aria-label` on the root `<main>` for SEO without visual disruption.
   - A **mobile fallback screen** (`md:hidden`) blocks the experience and displays an "Available only on desktop" message — the full experience is desktop-only (`md:block hidden`).
   - Typography powered by the custom self-hosted font **NeueHaasGroteskDisplay** (`@font-face`), weight 500, for a clean editorial aesthetic.

2. **Image Gallery — Stacked Cover Intro (Pre-animation State)**:
   - A `<section>` (`.hero__gallery-cover--before-animation`) acts as the pre-Flip staging area: all `<figure>` elements are absolutely stacked and centered in the viewport at load.
   - Each `<figure>` contains an `<img>` (press cover photograph) with a descriptive `alt` and a screen-reader-only `<figcaption>`.
   - **8 press cover images** are loaded from Cloudinary/Pinterest CDN at responsive sizes (`max-h-[30vh]`, `max-w-[15vw]`).
   - Images are **hidden on initial load** (`autoAlpha: 0`) and staggered into visibility using GSAP `steps(1)` easing to mimic a flickering press-stack reveal.

3. **GSAP Intro Animation Sequence**:
   - All elements start in a **hidden state** set via `gsap.set()` before `DOMContentLoaded`.
   - A sequential GSAP timeline drives the intro:
     1. **Title slide-in**: The `LUCFAVRE` logotype slides up from `yPercent: 100` to `yPercent: -10`, simultaneously scaling the font from `2vw` to `12vw`.
     2. **Image flicker reveal**: Cover images appear one-by-one using `steps(1)` easing with a `0.2s` inter-item delay.
     3. **Nav reveal**: `WORK` and `INFO` links slide up via `yPercent: 0` with `power3.inOut` easing.
     4. **Tagline reveal**: The subtitle (`New York ink. Photoreporter. EST 1994`) slides down from `yPercent: -100` to `0` in sync with the nav reveal.
   - The timeline waits for all images to resolve (load or error) via a `waitForImages()` Promise before executing.

4. **GSAP Flip: Stack → Spread Carousel**:
   - After the intro timeline completes, **GSAP `Flip`** captures the stacked state of the `<figure>` elements.
   - Each figure is reclassified: absolute positioning classes are removed and `.item-carousel` is added, then each is appended into the `.hero__gallery-cover-container` target container.
   - `Flip.from()` animates the transition from the stacked cover position to the final spread-out carousel layout at the bottom of the screen.
   - A CSS custom property `--item-width` is dynamically computed as `94vw / imageCount` and injected on the container, so each item's width is always proportional.
   - On `Flip` completion, `.ready-for-hover` is added to each item, enabling CSS `transition` on `width` and `img height` for interactive hover expansion.

5. **Final Carousel Layout**:
   - Items are laid out horizontally at the **bottom-right** of the viewport using a flex row (`justify-end`, `items-end`).
   - Alternating rhythm: **odd items** display `img` at `height: 100%`, **even items** at `height: 40%`, creating a staggered editorial composition.
   - Hover interactions (enabled post-Flip via `.ready-for-hover`) allow individual items to expand width and image height with smooth CSS transitions.

6. **Smooth Scroll & SPA Cleanup**:
   - **Lenis** (`lerp: 0.1`) is integrated for inertia-based smooth scrolling, ticked via `gsap.ticker`.
   - `gsap.matchMedia()` gates the intro to `min-width: 800px`, ensuring the animation only runs on desktop.
   - A global `window.cleanupAnimations()` function reverts the GSAP context and destroys Lenis — designed for safe SPA navigation teardown.

### Tech Stack
- **HTML5 & Semantic SEO Best Practices** (proper `<figure>`, `<figcaption>`, `aria-label`, `sr-only` captions).
- **TailwindCSS v4** (CDN — `@tailwindcss/browser@4`).
- **Vanilla CSS** for custom font (`@font-face`), carousel layout (`.item-carousel`), alternating height rhythm, and `prefers-reduced-motion` accessibility support.
- **GSAP** (`gsap@3.13`) + **Flip plugin** (`gsap@3.15`) for the stacked-to-carousel Flip transition and intro timeline.
- **GSAP ScrollTrigger** (`3.12.5`) for potential scroll-driven extensions.
- **Lenis Scroll** (`1.3.25`) for smooth page inertia, synced to GSAP ticker.
