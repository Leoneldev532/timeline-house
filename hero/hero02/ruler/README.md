# ScrollRuler JS Library

A lightweight, standalone JavaScript library for building **interactive infinite scroll rulers**, driven by mouse wheel or drag/touch gestures with momentum inertia and snapping capabilities.

---

## 🌟 Features

- **Smooth Inertia**: Automatic velocity calculation based on user gesture speed (touch, mouse, wheel).
- **Dynamic Ticks**: Supports numbered major ticks and unnumbered minor ticks.
- **Adaptive Opacity**: Dynamic opacity calculation highlighting the active center of the ruler (`zoneRadius`).
- **Automatic Snapping**: Smooth easing (`power3.out`) alignment to the nearest major tick when scrolling stops.
- **Autoplay Mode**: Continuous automatic scroll when inactive, with auto-resume delay.
- **External Controls (API)**: Bidirectional synchronization using `goToIndex(index)` and the `onChange` callback.

---

## 📦 Dependencies

- **GSAP 3+** (uses `gsap.ticker` and `gsap.to`)

---

## 🚀 Getting Started

### 1. Include Script

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="./ruler/ruler.js"></script>
```

### 2. HTML Structure

```html
<div class="hero__ruler relative w-full h-12 overflow-hidden">
  <div class="ruler__track flex items-center justify-center relative w-full h-full">
    <!-- Pool of tick items to span the container width -->
    <div class="ruler__tick absolute bottom-0 flex flex-col items-center">
      <span class="ruler__tick-label text-[11px] text-white"></span>
      <span class="ruler__tick-mark block w-px bg-white"></span>
    </div>
    <!-- Duplicate ruler__tick items as needed for pooling -->
  </div>
</div>
```

### 3. JavaScript Initialization

```javascript
const scrollRuler = createScrollRuler({
    root: ".hero__ruler",
    count: 4,                  // Total number of logical items (e.g. 4 projects)
    tickGap: 14,               // Distance in px between ticks
    minorPerMajor: 5,          // Number of minor ticks between major ticks
    friction: 0.94,            // Inertia friction multiplier (0 to 1)
    zoneRadius: 60,            // Distance in px for center highlight opacity
    autoplay: true,            // Enable automatic scrolling
    autoplaySpeed: 0.4,        // Auto scroll speed (px per frame)
    autoplayResumeDelay: 1500, // Delay (ms) after interaction before resuming autoplay
    onChange: (index) => {
        console.log("Selected ruler index:", index);
    }
});
```

---

## ⚙️ Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `root` | `string \| HTMLElement` | **Required** | Root container element. |
| `count` | `number` | **Required** | Total count of logical looped items. |
| `tickGap` | `number` | `14` | Horizontal distance in pixels between ticks. |
| `minorPerMajor` | `number` | `5` | Number of secondary ticks between major ticks. |
| `friction` | `number` | `0.94` | Deceleration factor for swipe/wheel inertia. |
| `zoneRadius` | `number` | `60` | Radius in pixels for center tick opacity boost. |
| `autoplay` | `boolean` | `true` | Enables continuous auto scroll when idle. |
| `autoplaySpeed` | `number` | `0.4` | Auto scroll velocity (pixels per frame). |
| `autoplayResumeDelay` | `number` | `1500` | Delay in milliseconds before resuming autoplay after interaction. |
| `onChange` | `Function` | `undefined` | Callback fired on major index changes `(index: number) => void`. |

---

## 🛠️ API Methods

`createScrollRuler()` returns an instance object with the following methods:

```javascript
// Programmatically navigate to a specific index (e.g. index 2)
scrollRuler.goToIndex(2);

// Get currently active logical index
const currentIndex = scrollRuler.getCurrentIndex();

// Clean up event listeners and stop ticker loop
scrollRuler.destroy();
```
