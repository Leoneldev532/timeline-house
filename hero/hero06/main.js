let scrollAnimationsContext = null;

window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, Flip, CustomEase, SplitText);

  CustomEase.create("custom", "0.19,1,0.22,1");

  scrollAnimationsContext = gsap.context(() => {
    const hero__animated_desktop_images = document.querySelectorAll(
      ".hero__animated-desktop-image",
    );

    const hero__animated_mobile_images = document.querySelectorAll(
      ".hero__animated-mobile-image",
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

    const hero__second_container_desktop_animated_image =
      document.querySelector(".hero__second-container-desktop-animated-image");

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

    const mm = gsap.matchMedia();

    let allLinkLines = [];
    let allLinkWords = [];

    hero__carousel_item_link.forEach((item) => {
      const text = new SplitText(item, {
        type: "lines",
        lineClass: "line-mask",
        mask: "lines",
      });

      if (!text.lines.length) return;

      gsap.set(text.lines, { clipPath: CLIP_HIDDEN_BOTTOM, yPercent: 100 });

      allLinkWords.push(...text.words);
      allLinkLines.push(...text.lines);
    });

    gsap.set(allLinkWords, {
      yPercent: 100,
    });

    gsap.set(header__link, {
      yPercent: 100,
    });

    if (hero__carousel_separators.length) {
      gsap.set(hero__carousel_separators, { autoAlpha: 0 });
    }

    const initAnimationOnMobile = () => {
      if (!hero__animated_mobile_images.length) return;

      // ✅ header synchro avec l'animation mobile (même timeline)
      const mobileTl = gsap.timeline();

      mobileTl.from(hero__animated_mobile_images[0], { scale: 1.5 }, 0).to(
        header__link,
        {
          yPercent: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        0,
      );
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

        // Séquence 1
        await Flip.from(state, {
          delay: 2,
          duration: 0.8,
          stagger: 0.2,
          scale: true,
          ease: "power2.out",
        });

        // Réorganisation DOM avant séquence 2
        const state2 = Flip.getState(hero__animated_desktop_images);

        const itemsArray = Array.from(hero__animated_desktop_images);
        const lastItem = itemsArray[itemsArray.length - 1];
        const otherItems = itemsArray.slice(0, -1);

        otherItems.forEach((item) => {
          item.classList.add("item-carousel");
          hero__carousel_content_wrapper.appendChild(item);
        });

        lastItem.classList.add("item-carousel");
        const targetSlot = hero__carousel_content_wrapper.children[3] || null;
        hero__carousel_content_wrapper.insertBefore(lastItem, targetSlot);

        gsap.set(lastItem, { zIndex: itemsArray.length + 1 });

        // Séquence 2 : Flip + reveal texte + header, tous synchronisés sur le même instant 0
        const flipTween = Flip.from(state2, {
          duration: 1.5,
          stagger: { from: "end", stagger: 0.06 },
          scale: true,
          ease: "custom",
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
              duration: 0.6,
            },
            0.2,
          );

        await flipTween;
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
});

window.cleanupScrollAnimations = () => {
  scrollAnimationsContext?.revert();
};
