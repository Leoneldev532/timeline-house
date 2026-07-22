# VerticalTextRotator JS Library

A lightweight and modular JavaScript utility for creating **vertical kinetic typography and odometer-style text rotations**. Ideal for updating titles, step counters, and dynamic headings during slide transitions.

---

## 🌟 Features

- **Bidirectional Animation**: Rotates upward or downward based on direction (`dir = 1` or `dir = -1`).
- **GSAP Powered**: Smooth hardware-accelerated animations using `gsap.to()` with `power3.inOut` easing.
- **Dual Node Mechanics**: Seamless double-buffer swapping between two DOM nodes (`data-current="true"` and `data-previous="true"`).
- **Carousel Decoupled**: Can be hooked up to any slider or pagination system via its `update()` method.

---

## 📦 Dependencies

- **GSAP 3+** (`gsap.to` and `gsap.set`)

---

## 🚀 Getting Started

### 1. Include Script

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="./text-rotator/text-rotator.js"></script>
```

### 2. Required HTML Structure

The container element must have overflow hidden styling (`overflow-hidden`) and contain **exactly 2 child elements** with `data-current="true"` and `data-previous="true"` attributes.

```html
<div class="hero__title relative overflow-hidden inline-block h-[1.2em]">
  <span class="block" data-current="true">PRIME</span>
  <span class="block absolute top-0 left-0" data-previous="true"></span>
</div>
```

### 3. JavaScript Initialization

```javascript
const titles = ["PRIME", "PULSE", "FLUX", "APEX"];

const titleRotator = createVerticalTextRotator(".hero__title", titles, {
    duration: 0.8,
    delay: 0
});
```

---

## ⚙️ API & Options

### Constructor

`createVerticalTextRotator(root, list, options)`

- **`root`** (`string | HTMLElement`): CSS selector or DOM container element.
- **`list`** (`string[]`): Array of text strings matching slider indices.
- **`options`** (`Object`, optional):
  - `duration` (`number`, default `0.8`): Transition duration in seconds.
  - `delay` (`number`, default `0`): Delay before transition starts.

### Return Methods

```javascript
// Trigger animated text transition to target index (e.g. index 2, direction 1)
titleRotator.update(1, 2);

// Reset rotator back to initial state (index 0)
titleRotator.reset();
```
