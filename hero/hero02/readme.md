# Slide Carousel

A modular carousel powered by `clip-path` and `z-index`, animated with GSAP. The core module solely manages slide layer stacking. ClipPath transitions, text rotators, and scroll rulers are independent external modules connected through an event hook.

## Project Structure

| File | Role |
| :--- | :--- |
| `carousel/carousel01.js` | Core carousel logic. Exposes `createSlideCarousel()`. Manages slide stack ordering, zIndex, clipPath, active index, and autoplay. Decoupled from text and transition presets. |
| `ruler/ruler.js` | `createScrollRuler()` — Infinite scroll ruler with touch/drag/wheel inertia velocity, snapping, and center opacity focus. |
| `text-rotator/text-rotator.js` | `createVerticalTextRotator()` — Vertical text rotation (odometer / kinetic typography for titles, step counters, etc.). |
| `transitions.js` | `CLIP_PATH_TRANSITIONS` registry — Preset clipPath shapes independent of the carousel logic. |
| `main.js` | Application entry point: initializes Lenis smooth scroll & GSAP, instantiates transitions + rotators + ruler + carousel, and connects them. |

## Dependencies

- [GSAP](https://gsap.com/) (core) — Required by modules (`carousel01.js`, `text-rotator.js`, `ruler.js`)
- [Lenis](https://lenis.darkroom.engineering/) — Smooth scroll, used in `main.js` for overall page inertia

## Script Loading Order

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="./transitions.js"></script>
<script src="./text-rotator/text-rotator.js"></script>
<script src="./ruler/ruler.js"></script>
<script src="./carousel/carousel01.js"></script>
<script src="./main.js"></script>
```

`transitions.js`, `text-rotator.js`, and `ruler.js` have no interdependencies, but must precede `main.js`.

## Architecture

The carousel performs a single task: rotates a stack of slides (`clipPath` + `zIndex`) and notifies external listeners via `onChange(dir, nextIndex, prevIndex)`. External components (titles, step counters, rulers) register their actions to this hook.

```
transitions.js  ──┐
                   ├─► carousel.js ◄── onChange(dir, nextIndex) ──┐
text-rotator.js ───┤                                              │
ruler.js ──────────┘                                              ▼
                                                           main.js (wiring)
```

## HTML Structure

```html
<div class="hero">
  <!-- One .hero__slide element per carousel item -->
  <div class="hero__slide">...</div>
  <div class="hero__slide">...</div>
  <div class="hero__slide">...</div>

  <!-- Animated title (managed by text-rotator.js, optional) -->
  <div class="hero__title">
    <span data-current="true">...</span>
    <span data-previous="true">...</span>
  </div>

  <!-- Animated step counter (managed by text-rotator.js, optional) -->
  <div class="hero__step-current">
    <span data-current="true">1</span>
    <span data-previous="true">3</span>
  </div>
  <span class="hero__step-total"></span>

  <!-- Navigation buttons (optional) -->
  <button class="hero__btn--prev">Previous</button>
  <button class="hero__btn--next">Next</button>
</div>
```

Only `.hero__slide` elements are required by `carousel01.js`. Titles, step counters, and buttons are independent and optional.

## `carousel01.js` Options & API

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `root` | `string \| HTMLElement` | **Required** | Container element or CSS selector. |
| `transition` | `{ open: string, collapsed: string }` | **Required** | ClipPath shape states (from `transitions.js` or custom). |
| `autoplayDelay` | `number` | `2500` | Autoplay delay in milliseconds between slides. |
| `duration` | `number` | `0.8` | Duration of each transition tween in seconds. |
| `delay` | `number` | `0` | Delay before each transition starts in seconds. |
| `autoplay` | `boolean` | `true` | Enables automatic slide rotation. |
| `onChange` | `(dir, nextIndex, prevIndex) => void` | — | Callback fired before each slide transition. |

### API Instance

```javascript
const carousel = createSlideCarousel({
  root: ".hero",
  transition: CLIP_PATH_TRANSITIONS.verticalWipe,
});

carousel.next(); // Next slide
carousel.prev(); // Previous slide
carousel.goToIndex(2); // Direct 1-step transition to index 2
carousel.start(); // Start / Restart autoplay
carousel.stop(); // Pause autoplay
carousel.setTransition(CLIP_PATH_TRANSITIONS.circleReveal); // Switch transition preset
carousel.getCurrentIndex(); // Returns current 0-based index
carousel.destroy(); // Detaches event listeners and stops timers
```

## `transitions.js` Presets

| Name | Visual Effect |
| :--- | :--- |
| `verticalWipe` | Wipes vertically from the top |
| `verticalWipeBottom` | Wipes vertically from the bottom |
| `horizontalWipeLeft` | Wipes horizontally from the left |
| `horizontalWipeRight` | Wipes horizontally from the right |
| `diagonal` | Wipes diagonally toward top-left corner |
| `circleReveal` | Radial iris expand / collapse effect |

## Multiple Carousels on a Single Page

Each instance operates independently. Simply specify a unique `root` container:

```javascript
const heroCarousel = createSlideCarousel({
  root: ".hero",
  transition: CLIP_PATH_TRANSITIONS.verticalWipe,
  onChange: (dir, i) => titleRotator?.update(dir, i),
});

const projectsCarousel = createSlideCarousel({
  root: ".projects-carousel",
  transition: CLIP_PATH_TRANSITIONS.horizontalWipeRight,
  autoplayDelay: 4000,
});
```
