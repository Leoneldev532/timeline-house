let animationContext = null;
let lenis = null;

window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, Flip);

  // ── Smooth scroll ──────────────────────────────────────
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  animationContext = gsap.context(() => {
    // ── DOM references ─────────────────────────────────
    const coverImages = document.querySelectorAll(".hero__gallery-cover-image");
    const navLinks = document.querySelectorAll(".header__link-text");
    const titleText = document.querySelector(".header__link-title-text");
    const titleDescription = document.querySelector(
      ".header__link-title-description",
    );
    const carouselContainer = document.querySelector(
      ".hero__gallery-cover-container",
    );

    if (!carouselContainer || coverImages.length === 0) return;

    // ── Initial hidden state ───────────────────────────
    gsap.set(coverImages, { autoAlpha: 0 });
    gsap.set(navLinks, { yPercent: 100 });
    gsap.set(titleText, { yPercent: 100, scale: 1, fontSize: "2vw" });
    gsap.set(titleDescription, { yPercent: -100 });

    const itemWidth = 94 / coverImages.length;

    // ── Wait for all images to load ────────────────────
    const waitForImages = (images) =>
      Promise.all(
        Array.from(images).map((figure) => {
          const img =
            figure.tagName === "IMG" ? figure : figure.querySelector("img");
          if (!img || img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          });
        }),
      );

    // ── Intro animation sequence ───────────────────────
    const playIntro = () => {
      waitForImages(coverImages).then(() => {
        gsap
          .timeline()
          .to(titleText, { yPercent: -10, duration: 0.5 })
          .to(
            coverImages,
            {
              autoAlpha: 1,
              duration: 0.2,
              delay: (i) => i * 0.2,
              ease: "steps(1)",
            },
            "-=0.2",
          )
          .to(
            navLinks,
            { yPercent: 0, duration: 0.8, ease: "power3.inOut" },
            ">",
          )
          .to(
            titleText,
            { fontSize: "12vw", duration: 0.8, ease: "power3.inOut" },
            "<",
          )
          .to(
            titleDescription,
            { yPercent: 0, duration: 0.8, ease: "power3.inOut" },
            "<",
          )
          .add(() => {
            // ── Flip: stack → spread carousel ─────────
            const state = Flip.getState(coverImages);

            carouselContainer.style.setProperty(
              "--item-width",
              `${itemWidth}vw`,
            );

            coverImages.forEach((item) => {
              item.classList.remove(
                "absolute",
                "inset-0",
                "w-full",
                "h-full",
                "w-auto",
                "h-auto",
              );
              item.classList.add("relative", "item-carousel");
              item.style.width = "";
              carouselContainer.appendChild(item);
            });

            Flip.from(state, {
              duration: 0.8,
              ease: "power3.inOut",
              absolute: true,
              stagger: { from: "center" },
              onComplete: () => {
                coverImages.forEach((item) =>
                  item.classList.add("ready-for-hover"),
                );
              },
            });
          }, "<");
      });
    };

    gsap.matchMedia().add(
      {
        isDesktop: "(min-width: 800px)",
        isMobile: "(max-width: 799px)",
      },
      () => playIntro(),
    );
  });
});

// ── Cleanup (useful for SPA navigation) ───────────────────
window.cleanupAnimations = () => {
  animationContext?.revert();
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
};
