gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase);

scrollAnimationsContext = gsap.context(() => {
  const hero__animated_desktop_images = document.querySelectorAll(
    ".hero__animated-desktop-image",
  );

  const hero__animated_mobile_images = document.querySelectorAll(
    ".hero__animated-mobile-image",
  );

  const hero__mobile_scroll_trigger = document.querySelector(
    ".hero__mobile-scroll-trigger",
  );

  const hero__carousel_content_wrapper = document.querySelector(
    ".hero__carousel-content-wrapper",
  );

  const hero__carousel_item_link = document.querySelectorAll(
    ".hero__carousel-item-link",
  );

  const hero__carousel_separators = document.querySelectorAll(
    ".hero__carousel-separator",
  );

  const header__link = document.querySelectorAll(".header__link");

  const hero__second_container_desktop_animated_image = document.querySelector(
    ".hero__second-container-desktop-animated-image",
  );

  const CLIP_FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
  const CLIP_HIDDEN_BOTTOM = "polygon(0% 0%, 100% 0%, 100% 58%, 0% 58%)";

  if (
    !hero__carousel_content_wrapper ||
    !hero__second_container_desktop_animated_image
  ) {
    console.warn(
      "[NWPROD] Éléments requis introuvables dans le DOM, animation annulée.",
    );
    return;
  }

  const CLONE_PASSES = 2;
  const TOTAL_SETS = 1 + CLONE_PASSES;

  const cloneItems = () => {
    const items = Array.from(hero__carousel_content_wrapper.children);

    for (let copy = 0; copy < CLONE_PASSES; copy++) {
      items.forEach((item) => {
        const clone = item.cloneNode(true);
        gsap.set(clone, { clearProps: "transform,scale,x,y,zIndex" });
        hero__carousel_content_wrapper.appendChild(clone);
      });
    }
  };

  const debounce = (fn, delay = 150) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  };

  const mm = gsap.matchMedia();

  let allLinkLines = [];

  hero__carousel_item_link.forEach((item) => {
    const text = new SplitText(item, {
      type: "lines",
      lineClass: "line-mask",
    });

    if (!text.lines.length) return;

    gsap.set(text.lines, { clipPath: CLIP_HIDDEN_BOTTOM, yPercent: 100 });

    allLinkLines.push(...text.lines);
  });

  gsap.set(header__link, {
    yPercent: 100,
  });

  if (hero__carousel_separators.length) {
    gsap.set(hero__carousel_separators, { autoAlpha: 0 });
  }

  const linkElements = Array.from(hero__carousel_item_link);
  let currentActiveLinkIndex = -1;

  const setActiveLink = (index) => {
    if (index === currentActiveLinkIndex) return;
    currentActiveLinkIndex = index;

    gsap.to(linkElements, {
      opacity: (i) => (i === currentActiveLinkIndex ? 1 : 0.35),
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const setActiveLinkMobile = (index) => {
    if (index === currentActiveLinkIndex) return;
    currentActiveLinkIndex = index;

    gsap.set(linkElements, {
      autoAlpha: (i) => (i === currentActiveLinkIndex ? 1 : 0),
      overwrite: "auto",
    });
  };

  const initAnimationOnMobile = () => {
    if (!hero__animated_mobile_images.length) return;

    gsap.set(allLinkLines, { clearProps: "clipPath,yPercent" });
    gsap.set(header__link, { clearProps: "yPercent" });

    gsap.set(linkElements, { autoAlpha: (i) => (i === 0 ? 1 : 0) });
    currentActiveLinkIndex = 0;

    const mobileTl = gsap.timeline();

    mobileTl.from(hero__animated_mobile_images[0], { scale: 1.5 }, 0).to(
      header__link,
      {
        autoAlpha: 1,
        duration: 0,
        ease: "power1.out",
      },
      0,
    );

    const scrollTrigger =
      hero__mobile_scroll_trigger || hero__animated_mobile_images[0];

    ScrollTrigger.create({
      trigger: scrollTrigger,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const index = Math.min(
          linkElements.length - 1,
          Math.round(self.progress * (linkElements.length - 1))
        );
        setActiveLinkMobile(index);
      },
    });
  };

  const handleScrollAndSnap = () => {
    const MAX_IMPULSE = 15;
    const RELEASE_DELAY = 300;
    const VELOCITY_RELEASE_THRESHOLD = 1.5;

    let ball = 0;
    let anchorBall = 0;
    let oneSetWidth = 0;
    let itemWidth = 0;

    let velocity = 0;
    const friction = 0.8;

    let rafId = null;
    let snapTween = null;
    let wheelTimeout = null;

    const computeIndexFromBall = (value) => {
      const safeItemWidth = itemWidth || 1;
      const rawSteps = Math.round(value / safeItemWidth);
      return (
        ((rawSteps % linkElements.length) + linkElements.length) %
        linkElements.length
      );
    };

    const recalcDimensions = () => {
      const items =
        hero__carousel_content_wrapper.querySelectorAll(".item-carousel");

      // Sauvegarder la position relative actuelle (ex: 3.5 images)
      const relativeBall = itemWidth > 0 ? ball / itemWidth : 0;
      const relativeAnchor = itemWidth > 0 ? anchorBall / itemWidth : 0;

      let newWidth = 0;
      if (items.length >= 2) {
        newWidth = items[1].offsetLeft - items[0].offsetLeft;
      } else if (items.length === 1) {
        newWidth = items[0].offsetWidth;
      }
      
      // On empêche itemWidth de valoir 0 si le layout est suspendu (BFCache / changement d'onglet)
      if (newWidth > 0) {
        itemWidth = newWidth;
      }

      const itemsPerSet = items.length / TOTAL_SETS;
      oneSetWidth = itemWidth * itemsPerSet;

      if (itemWidth > 0 && relativeBall > 0) {
        ball = relativeBall * itemWidth;
        anchorBall = relativeAnchor * itemWidth;
        applyPosition(ball);
      }
    };

    recalcDimensions();

    const setterx = gsap.quickSetter(hero__carousel_content_wrapper, "x", "px");

    const applyPosition = (value) => {
      const wrapped = gsap.utils.wrap(-oneSetWidth, 0)(-value);
      setterx(wrapped);
      setActiveLink(computeIndexFromBall(value));
    };

    const vwToPx = (vw) => (vw * window.innerWidth) / 100;
    ball = vwToPx(300);
    anchorBall = ball;
    applyPosition(ball);

    const tick = () => {
      if (Math.abs(velocity) < 0.05) {
        velocity = 0;
        rafId = null;
        return;
      }

      velocity *= friction;
      ball += velocity;
      applyPosition(ball);

      rafId = requestAnimationFrame(tick);
    };

    const snapTo = (target) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      velocity = 0;

      if (snapTween) snapTween.kill();

      const proxy = { ball };
      snapTween = gsap.to(proxy, {
        ball: target,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => {
          ball = proxy.ball;
          applyPosition(ball);
        },
        onComplete: () => {
          ball = target;
          anchorBall = target;
        },
      });
    };

    const handleRelease = () => {
      if (Math.abs(velocity) > VELOCITY_RELEASE_THRESHOLD) {
        wheelTimeout = setTimeout(handleRelease, RELEASE_DELAY);
        return;
      }

      const safeItemWidth = itemWidth || 1;
      const delta = ball - anchorBall;
      const steps = Math.round(delta / safeItemWidth);
      const target = anchorBall + steps * safeItemWidth;
      snapTo(target);
    };

    const handleWheel = (e) => {
      clearTimeout(wheelTimeout);
      if (snapTween) snapTween.kill();

      const impulse = gsap.utils.clamp(
        -MAX_IMPULSE,
        MAX_IMPULSE,
        e.deltaY * 0.5,
      );
      velocity += impulse;

      wheelTimeout = setTimeout(handleRelease, RELEASE_DELAY);

      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("wheel", handleWheel);

    const cleanupWheelScroll = () => {
      window.removeEventListener("wheel", handleWheel);
      if (rafId) cancelAnimationFrame(rafId);
      if (snapTween) snapTween.kill();
      clearTimeout(wheelTimeout);
    };

    window.addEventListener("resize", debounce(recalcDimensions));
  };

  const initAnimationOnDesktop = () => {
    if (!hero__animated_desktop_images.length) return;

    async function playSequences() {
      gsap.set(hero__animated_desktop_images, {
        scale: 2.5,
        yPercent: (i) => i * 50,
      });

      const state = Flip.getState(hero__animated_desktop_images);

      hero__animated_desktop_images.forEach((item) => {
        hero__second_container_desktop_animated_image.appendChild(item);
      });

      gsap.set(hero__animated_desktop_images, {
        scale: 1,
        y: 0,
        zIndex: (x) => x + 1,
      });

      await Flip.from(state, {
        delay: 2,
        duration: 0.8,
        stagger: 0.2,
        scale: true,
        ease: "power4.out",
      });

      const state2 = Flip.getState(hero__animated_desktop_images);

      const itemsArray = Array.from(hero__animated_desktop_images);
      const lastItem = itemsArray[itemsArray.length - 1];
      const otherItems = itemsArray.slice(0, -1);

      otherItems.forEach((item) => {
        item.classList.remove("absolute", "inset-0", "w-full");
        item.classList.add("item-carousel");
        hero__carousel_content_wrapper.appendChild(item);
      });

      lastItem.classList.remove("absolute", "inset-0", "w-full");
      lastItem.classList.add("item-carousel");
      const targetSlot = hero__carousel_content_wrapper.children[3] || null;
      hero__carousel_content_wrapper.insertBefore(lastItem, targetSlot);

      gsap.set(lastItem, { zIndex: itemsArray.length + 1 });

      const flipTween = Flip.from(state2, {
        duration: 0.9,
        stagger: { from: "end", stagger: 0.06 },
        scale: true,
        ease: "power4.out",
      });

      const revealTl = gsap.timeline();

      revealTl
        .to(
          allLinkLines,
          {
            clipPath: CLIP_FULL,
            yPercent: 0,
            duration: 1,
          },
          0,
        )
        .to(
          [header__link],
          {
            duration: 0.8,
            yPercent: 0,
          },
          "-=0.5",
        )
        .to(
          hero__carousel_separators,
          {
            autoAlpha: 1,
            duration: 0,
          },
          0.2,
        );

      await flipTween;

      cloneItems();
      handleScrollAndSnap();
    }

    playSequences();
  };

  let hasInitDesktop = false;
  let hasInitMobile = false;

  mm.add(
    {
      reduceMotion: "(prefers-reduced-motion: reduce)",
      isDesktop: "(min-width: 800px)",
      isMobile: "(max-width: 799px)",
    },
    (context) => {
      const { isMobile, isDesktop } = context.conditions;

      if (isMobile && !hasInitMobile) {
        hasInitMobile = true;
        initAnimationOnMobile();
      }

      if (isDesktop && !hasInitDesktop) {
        hasInitDesktop = true;
        initAnimationOnDesktop();
      }
    },
  );
});
