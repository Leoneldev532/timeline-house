let scrollAnimationsContext = null;
let lenis = null;

function preloadImages(selector = "img", timeout = 5000) {
  const loading = new Promise((resolve) => {
    const images = document.querySelectorAll(selector);
    let loaded = 0;
    let hasError = false;

    if (images.length === 0) return resolve(true);

    images.forEach((img) => {
      if (img.complete) {
        if (img.naturalWidth === 0) hasError = true;
        loaded++;
        if (loaded === images.length) resolve(!hasError);
      } else {
        const done = (e) => {
          if (e.type === "error") hasError = true;
          loaded++;
          if (loaded === images.length) resolve(!hasError);
        };
        img.addEventListener("load", done);
        img.addEventListener("error", done);
      }
    });
  });

  const timeoutPromise = new Promise((resolve) =>
    setTimeout(() => resolve(false), timeout),
  );

  return Promise.race([loading, timeoutPromise]);
}

function initLenis() {
  lenis = new Lenis({
    duration: 0.5,
    wheelMultiplier: 1.5,
    touchMultiplier: 1.5,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

const DOM = {
  galleryGrid: document.querySelector(".hero-gallery-grid"),
  heroBackgroundOverlay: document.querySelector(".hero-background-overlay"),
  heroBigTitle: document.querySelector(".hero-big-title"),
  heroTitle: document.querySelector(".hero-title"),
  heroDescription: document.querySelector(".hero-description"),
};
const numberOfColumns = 3;

const galleryImages = [
  "https://i.pinimg.com/1200x/5c/fa/d6/5cfad66af87b5505a6cf41cbf534f190.jpg",
  "https://i.pinimg.com/736x/7f/11/50/7f1150d53ca5adde28861178d75c00b5.jpg",
  "https://cdn.cosmos.so/20420886-807a-450d-834f-2e73a2af15f1?format=webp",
  "https://i.pinimg.com/736x/13/55/3b/13553b57b5f7a9f98a5a56bcec196676.jpg",
  "https://i.pinimg.com/1200x/97/62/b4/9762b42f5307553f078b372efa4b59e1.jpg",
  "https://cdn.cosmos.so/ca7cc9af-0352-4634-a890-e27ed0bca74f?format=webp",
  "https://images.pexels.com/photos/10276044/pexels-photo-10276044.jpeg",
  "https://i.pinimg.com/1200x/9e/a8/5c/9ea85c0b9646fe8cbe37033ebb743d63.jpg",
  "https://i.pinimg.com/736x/34/10/ec/3410ec9f161e7a551d7f6a0ee11b20e3.jpg",
];

galleryImages.forEach((src) => {
  const item = document.createElement("div");
  item.className = "h-full min-h-[250px] w-full overflow-hidden ";
  const img = document.createElement("img");
  img.src = src;
  img.alt = "Gallery Image";
  img.className = "w-full h-full object-cover";
  item.appendChild(img);
  DOM.galleryGrid.appendChild(item);
});

const gridItems = [...DOM.galleryGrid.children];

const initAnimationOnDesktopAndMobile = ({ isMobile }) => {
  function getColumn(index, nbCols) {
    return gridItems.filter((_, i) => i % nbCols === index);
  }

  const columns = Array.from({ length: numberOfColumns }, (_, i) =>
    getColumn(i, numberOfColumns),
  );

  const handleAnimateOverlay = () => {
    const tl = gsap.timeline();
    tl.to(DOM.heroBackgroundOverlay, {
      yPercent: -100,
      duration: 1,
      borderRadius: "50%",
    });
    return tl;
  };

  const animateGridReveal = () => {
    const tl = gsap.timeline();
    const wh = window.innerHeight;
    const dy = wh - (wh - DOM.galleryGrid.offsetHeight - 800) / 2;

    columns.forEach((column, index) => {
      const fromTop = index % 2 === 0;
      const yStart = dy * (fromTop ? -1 : 1);

      gsap.set(column, { y: yStart, visibility: "visible" });

      tl.to(
        column,
        {
          y: 0,
          ease: "power1.inOut",
          stagger: {
            each: 0.06,
            from: fromTop ? "end" : "start",
          },
        },
        0,
      );
    });
    return tl;
  };

  const animateGridZoom = () => {
    const tl = gsap.timeline();
    tl.to(DOM.galleryGrid, {
      scale: 1.5,
      ease: "power2.inOut",
      duration: 1,
    });

    tl.to(columns[0], { xPercent: -40 }, "<");
    tl.to(columns[2], { xPercent: 40 }, "<");

    tl.to(
      columns[1],
      {
        yPercent: (index) =>
          (index < Math.floor(columns[1].length / 2) ? -1 : 1) * 40,
        duration: 0.5,
        ease: "power1.inOut",
      },
      "-=0.5",
    );

    return tl;
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      pin: true,
      start: "top top",
      end: "+=5000",
      scrub: 1,
    },
  });

  const animateHeroText = () => {
    const tl = gsap.timeline();

    gsap.set(DOM.heroBigTitle, {
      y: 20,
      opacity: 0.5,
    });
    gsap.set(DOM.heroTitle, {
      y: 40,
      opacity: 0,
    });
    gsap.set(DOM.heroDescription, {
      y: 40,
      opacity: 0,
    });

    tl.to(
      DOM.heroBigTitle,
      {
        y: 0,
        opacity: 1,
        ease: "none",
      },
      "<",
    )
      .to(
        DOM.heroTitle,
        {
          y: 0,
          opacity: 1,
          ease: "none",
        },
        "<",
      )
      .to(
        DOM.heroDescription,
        {
          y: 0,
          opacity: 1,
          ease: "none",
        },
        "<",
      );
    return tl;
  };

  tl.add(handleAnimateOverlay())
    .add(animateGridReveal(), "-=0.32")
    .add(animateGridZoom(), "-=0.1")
    .add(animateHeroText(), "-=0.4");

  return tl;
};

function setupResizeRefresh(delay = 200) {
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), delay);
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  gsap.registerPlugin(ScrollTrigger);

  const [imagesLoaded] = await Promise.all([
    preloadImages(),
    document.fonts.ready,
  ]);

  if (!imagesLoaded) {
    console.error(
      "Certaines images n'ont pas pu être chargées. Animation annulée.",
    );
    return;
  }

  scrollAnimationsContext = gsap.context(() => {});

  initLenis();

  const mm = gsap.matchMedia();

  mm.add(
    {
      reduceMotion: "(prefers-reduced-motion: reduce)",
      isDesktop: "(min-width: 800px)",
      isMobile: "(max-width: 799px)",
    },
    (context) => {
      const { isMobile } = context.conditions;

      initAnimationOnDesktopAndMobile({ isMobile });
    },
  );

  setupResizeRefresh();

  ScrollTrigger.refresh();

  document.body.classList.add("is-ready");
});

window.cleanupScrollAnimations = () => {
  scrollAnimationsContext?.revert();
  lenis?.destroy();
};
