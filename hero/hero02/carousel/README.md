# SlideCarousel JS Library

A minimal and high-performance JavaScript library for creating **full-screen image & video carousels powered by clipPath clipping and zIndex stacking**.

---

## 🌟 Features

- **Direct 1-Step Transitions**: Instant transition from Index A to Index B in a single GSAP animation (no intermediate slide cycling).
- **Target Override (Debouncing)**: Rapid scrolling requests automatically discard obsolete intermediate steps in favor of the latest target index.
- **Dynamic Z-Index Stacking**: Smart layer reordering prevents visual flickers and layout breaks.
- **ClipPath Preset Support**: Compatible with custom clipPath transitions (Vertical Wipe, Circle Reveal, Horizontal Wipe, Diagonal, etc.).
- **Auto-resuming Autoplay**: Seamless autoplay with automatic reset after user interactions.
- **Decoupled UI**: Communicates direction and target index to external elements (titles, rulers, buttons) via `onChange`.

---

## 📦 Dependencies

- **GSAP 3+** (`gsap.to`, `gsap.set`, `gsap.killTweensOf`)
- A clipPath transition dictionary (e.g. `transitions.js`)

---

## 🚀 Getting Started

### 1. Include Script

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="./transitions.js"></script>
<script src="./carousel/carousel01.js"></script>
```

### 2. Required HTML Structure

```html
<div class="hero relative w-full h-screen">
  <!-- Stacked slides -->
  <div class="hero__slide absolute inset-0">
    <video src="..." autoplay loop muted class="w-full h-full object-cover"></video>
  </div>
  <div class="hero__slide absolute inset-0">
    <video src="..." autoplay loop muted class="w-full h-full object-cover"></video>
  </div>

  <!-- Navigation buttons (optional) -->
  <button class="hero__btn--prev">Previous</button>
  <button class="hero__btn--next">Next</button>
</div>
```

### 3. JavaScript Initialization

```javascript
const carousel = createSlideCarousel({
    root: ".hero",
    transition: CLIP_PATH_TRANSITIONS.verticalWipe,
    autoplayDelay: 5000,
    duration: 0.8,
    autoplay: true,
    onChange: (dir, nextIndex, prevIndex) => {
        console.log(`Navigation (dir: ${dir}) -> from slide ${prevIndex} to ${nextIndex}`);
    }
});
```

---

## ⚙️ Options & Configuration

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `root` | `string \| HTMLElement` | **Required** | Root container element. |
| `transition` | `Object` | **Required** | Transition object specifying `{ open, collapsed }` clipPath shapes. |
| `autoplayDelay` | `number` | `2500` | Delay in milliseconds between autoplay transitions. |
| `duration` | `number` | `0.8` | Duration in seconds for slide transition animations. |
| `delay` | `number` | `0` | Delay before each transition starts. |
| `autoplay` | `boolean` | `true` | Enables or disables continuous slide rotation. |
| `slidesElementList` | `Array<HTMLElement>` | `undefined` | Custom slide elements array (falls back to `.hero__slide`). |
| `prevBtnElement` | `HTMLElement` | `undefined` | Custom previous button element (falls back to `.hero__btn--prev`). |
| `nextBtnElement` | `HTMLElement` | `undefined` | Custom next button element (falls back to `.hero__btn--next`). |
| `onChange` | `Function` | `undefined` | Event hook called on slide transitions `(dir, nextIndex, prevIndex) => void`. |

---

## 🛠️ API Methods

```javascript
// Navigate to next slide
carousel.next();

// Navigate to previous slide
carousel.prev();

// Navigate directly to target index (e.g. index 3)
carousel.goToIndex(3);

// Get index of currently visible slide
const activeIndex = carousel.getCurrentIndex();

// Switch clipPath transition preset dynamically
carousel.setTransition(CLIP_PATH_TRANSITIONS.circleReveal);

// Stop / Start autoplay
carousel.stop();
carousel.start();

// Destroy instance and detach event listeners
carousel.destroy();
```
