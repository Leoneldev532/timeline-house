let scrollAnimationsContext = null;
window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const hero__carousel_thumbnail_wrapper = document.querySelector(
    ".hero__carousel-thumbnail-wrapper",
  );

  const hero__carousel_description_video_container = document.querySelector(
    ".hero__carousel-description-video",
  );

  const hero__carousel_description_video_first_item =
    hero__carousel_description_video_container?.querySelector(
      ".hero__carousel-description-video-first-item",
    );

  const hero__carousel_description_video_second_item =
    hero__carousel_description_video_container?.querySelector(
      ".hero__carousel-description-video-second-item",
    );

  const carouselData = [
    {
      title: "Neon Genesis",
      description:
        "If one person deserves it and one person can do it, it's definitely the predator Franics Ngannou. In this stop-frame style promo, the power of Francis Ngannou bares all to the world as every punch, pulsating muscle and drop of sweat are captured in incredible detail accompanied by a narration that gets the hairs on the back of your neck tingling.",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312352/From_Klickpin.com-_831969731199293419-pin-id-831969731199293419_rfht8c.mp4",
      credits: {
        director: "Tom Day",
        dop: "Arthur Lok",
        editor: "Tom Day",
        producer: "Arthur Lok",
      },
    },
    {
      title: "Echoes of Silence",
      description:
        "A profound journey into the quiet moments that define our existence. Echoes of Silence captures the unspoken words and the spaces in between, featuring breathtaking cinematography that speaks louder than dialogue.",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312363/From_Klickpin.com-_17662623534373268-pin-id-17662623534373268-carousel-8_cownpm.mp4",
      credits: {
        director: "Tom Day",
        dop: "Arthur Lok",
        editor: "Tom Day",
        producer: "Arthur Lok",
      },
    },
    {
      title: "Apex - Beyond Limits",
      description:
        "Pushing the boundaries of human endurance and spirit. Apex follows extreme athletes as they conquer the impossible, rendered in stunning high-definition action sequences that will leave you on the edge of your seat.",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/p_auto:best/v1784706708/From_Klickpin.com-_904871750125902889-pin-id-904871750125902889_hrbuew.mp4",
      credits: {
        director: "Tom Day",
        dop: "Arthur Lok",
        editor: "Tom Day",
        producer: "Arthur Lok",
      },
    },
    {
      title: "Horizon - A New Dawn",
      description:
        "A mesmerizing exploration of new beginnings. Horizon blends visionary storytelling with cutting-edge visual effects to create an immersive experience that redefines the future of cinematic art.",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312351/From_Klickpin.com-_1115133557754238844-pin-id-1115133557754238844_v2pt11.mp4",
      credits: {
        director: "Tom Day",
        dop: "Arthur Lok",
        editor: "Tom Day",
        producer: "Arthur Lok",
      },
    },
    {
      title: "The Ultimate Challenge",
      description:
        "Capturing the raw emotion and sheer determination of true champions. The Ultimate Challenge is a testament to perseverance, brought to life through dynamic editing and powerful sound design.",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/p_auto:best/v1784706408/2_w7hxmn.mp4",
      credits: {
        director: "Tom Day",
        dop: "Arthur Lok",
        editor: "Tom Day",
        producer: "Arthur Lok",
      },
    },
  ];

  const CLONE_PASSES = 3;

  let isCloned = false;

  const cloneItems = () => {
    if (isCloned) return;
    const items = Array.from(hero__carousel_thumbnail_wrapper.children);

    for (let copy = 0; copy < CLONE_PASSES; copy++) {
      items.forEach((item) => {
        const clone = item.cloneNode(true);
        gsap.set(clone, { clearProps: "transform,scale,x,y,zIndex" });
        hero__carousel_thumbnail_wrapper.appendChild(clone);
      });
    }
    isCloned = true;
  };

  const wrap = (value, min, max) => {
    const range = max - min;
    return min + ((((value - min) % range) + range) % range);
  };

  const initScrollAnimation = ({
    target,
    axis = "y",
    friction = 0.9,
    wheelMultiplier = 0.05,
    bounds = [-50, 0],
  } = {}) => {
    cloneItems();

    const [min, max] = bounds;
    const prop = axis === "x" ? "deltaX" : "deltaY";
    const gsapProp = axis === "x" ? "xPercent" : "yPercent";

    let position = min;
    let velocity = 0;

    gsap.set(target, {
      clearProps: "xPercent, yPercent, x, y",
    });

    const handleWheel = (e) => {
      const delta = axis === "x" && e.deltaX === 0 ? e.deltaY : e[prop];
      velocity += delta * wheelMultiplier;
    };

    const tick = () => {
      velocity *= friction;
      position -= velocity;
      position = wrap(position, min, max);

      gsap.set(target, {
        [gsapProp]: position,
      });
    };

    window.addEventListener("wheel", handleWheel);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      gsap.ticker.remove(tick);
      gsap.set(target, {
        clearProps: "xPercent, yPercent, x, y",
      });
    };
  };
  if (typeof window.initPermutations === "function") {
    window.initPermutations({
      carouselData,
      thumbnailWrapper: hero__carousel_thumbnail_wrapper,
      videoFirstItem: hero__carousel_description_video_first_item,
      videoSecondItem: hero__carousel_description_video_second_item,
    });
  }

  scrollAnimationsContext = gsap.context(() => {
    const mm = gsap.matchMedia();

    const initAnimationOnMobile = () => {
      return initScrollAnimation({
        target: hero__carousel_thumbnail_wrapper,
        axis: "x",
        friction: 0.7,
        wheelMultiplier: 0.05,
        bounds: [-50, 0],
      });
    };

    const initAnimationOnDesktop = () => {
      return initScrollAnimation({
        target: hero__carousel_thumbnail_wrapper,
        axis: "y",
        friction: 0.7,
        wheelMultiplier: 0.05,
        bounds: [-50, 0],
      });
    };

    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)",
      },
      (context) => {
        const { isMobile, isDesktop } = context.conditions;
        let cleanup;

        if (isMobile) {
          cleanup = initAnimationOnMobile();
        }
        if (isDesktop) {
          cleanup = initAnimationOnDesktop();
        }

        return () => {
          if (cleanup) cleanup();
        };
      },
    );
  });
});

window.cleanupScrollAnimations = () => {
  scrollAnimationsContext?.revert();
};
