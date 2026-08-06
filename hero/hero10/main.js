let scrollAnimationsContext = null;
let lenis = null;

function preloadImages(selector = "img", timeout = 5000) {
  const loading = new Promise((resolve) => {
    const images = document.querySelectorAll(selector);
    let loaded = 0;

    if (images.length === 0) return resolve();

    images.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded === images.length) resolve();
      } else {
        const done = () => {
          loaded++;
          if (loaded === images.length) resolve();
        };
        img.addEventListener("load", done);
        img.addEventListener("error", done);
      }
    });
  });

  const timeoutPromise = new Promise((resolve) => setTimeout(resolve, timeout));

  return Promise.race([loading, timeoutPromise]);
}

function initLenis() {
  lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

const DOM = {
  heroTitle: document.querySelector(".hero__title"),
  heroSubtitle: document.querySelector(".hero__subtitle"),
  coordinates: document.querySelectorAll(".coord"),
  roundedPoints: document.querySelectorAll(".rounded__point"),
  menuList: document.querySelectorAll(".menu__list"),
  logo: document.querySelector(".logo"),
  heroContentBg: document.querySelector(".hero__content-bg"),
  heroOverlayLine: document.querySelector(".hero__overlay-line"),
  overlayTextRight: document.querySelector(".hero__overlay-text-right"),
  overlayTextPercentage: document.querySelector(
    ".hero__overlay-text-right > span",
  ),
  overlayTextLeft: document.querySelector(".hero__overlay-text-left"),
};

const allWordsHeroTitle = [];
const allWordsCoords = [];
const initIntroAnimation = () => {
  [DOM.heroTitle].forEach((item) => {
    const text = new SplitText(item, {
      type: "words",
      wordsClass: "word",
      mask: "words",
    });

    allWordsHeroTitle.push(...text.words);
  });

  [DOM.coordinates].forEach((item) => {
    const text = new SplitText(item, {
      type: "lines",
      linesClass: "line",
      mask: "lines",
    });

    allWordsCoords.push(...text.lines);
  });

  gsap.set([allWordsHeroTitle, allWordsCoords], {
    yPercent: 150,
  });

  gsap.set([DOM.heroSubtitle, DOM.roundedPoints, DOM.menuList], {
    autoAlpha: 0,
  });

  gsap.set(DOM.logo, {
    xPercent: 20,
    yPercent: -40,
    rotation: 15,
  });

  gsap.set(DOM.heroContentBg, {
    scale: 0,
    rotate: 15,
  });

  gsap.set(DOM.heroOverlayLine, {
    clipPath: "inset(45% 100% 45% 0%)",
    transformOrigin: "center center",
  });
};

const mainTimeline = gsap.timeline();

const initAnimationOnMobile = (reduceMotion) => {
  if (reduceMotion) {
    return;
  }
};

const initAnimationOnDesktopAndMobile = ({ isMobile }) => {
  initIntroAnimation();

  if (!isMobile) {
    mainTimeline.to(DOM.heroOverlayLine, {
      delay: 0.3,
      ease: "power2.out",
      duration: 0.6,
      clipPath: "inset(45% 86% 45% 0%)",
    });
  }

  mainTimeline
    .to(DOM.heroOverlayLine, {
      delay: 0.2,
      ease: "power2.out",
      duration: 0.8,
      clipPath: "inset(45% 0% 45.44% 0%)",
    })
    .to(
      DOM.overlayTextRight,
      {
        delay: 0.001,
        left: isMobile ? "88%" : "95%",
        ease: "power2.out",
        duration: 0.8,
        onUpdate: function () {
          const percentage = Math.round(this.progress() * 100);
          DOM.overlayTextPercentage.innerHTML = percentage + "%";
        },
        onComplete: () => {
          gsap.to(DOM.overlayTextRight, {
            opacity: 0,
            duration: 0.2,
          });
        },
      },
      "<",
    )
    .to(DOM.heroOverlayLine, {
      clipPath: "inset(0% 0% 0% 0%)",
      ease: "power2.inOut",
      duration: 0.5,
    })

    .to(
      DOM.overlayTextLeft,
      {
        autoAlpha: 0,
      },
      "<",
    )

    .to(
      DOM.heroContentBg,
      {
        scale: 1,
        rotate: 0,
        duration: 1,
        ease: "expo.out",
      },
      "-=0.2",
    )
    .to(
      allWordsHeroTitle,
      {
        yPercent: 0,
        duration: 1.4,
        ease: "expo.out",
      },
      "<",
    )
    .to(
      allWordsCoords,
      {
        yPercent: 0,
      },
      "<",
    )
    .set(
      [DOM.heroSubtitle, DOM.roundedPoints, DOM.menuList],
      {
        autoAlpha: 1,
      },
      "<",
    );
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

  await Promise.all([preloadImages(), document.fonts.ready]);

  scrollAnimationsContext = gsap.context(() => {});

  initLenis();

  const mm = gsap.matchMedia();

  let hasInitDesktop = false;
  let hasInitMobile = false;

  mm.add(
    {
      reduceMotion: "(prefers-reduced-motion: reduce)",
      isDesktop: "(min-width: 800px)",
      isMobile: "(max-width: 799px)",
    },
    (context) => {
      const { isMobile, isDesktop, reduceMotion } = context.conditions;

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
