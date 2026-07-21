window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText, Flip, ScrollTrigger);

  /* ============================================================
       1. LENIS — SMOOTH SCROLL
    ============================================================ */
  const lenis = new Lenis({
    duration: 1.2,
    wheelMultiplier: 0.4,
    smoothWheel: true,
  });

  lenis.scrollTo(0, { immediate: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  lenis.stop();
  gsap.ticker.lagSmoothing(0);

  lenis.on("scroll", () => {
    if (lenis.scroll > 200) {
      gsap.to(".logo-img", { scale: 1, y: -40 });
    }
    if (lenis.scroll < 200) {
      gsap.to(".logo-img", { scale: 1.5, y: 0 });
    }
  });

  /* ============================================================
       2. DOM REFS
    ============================================================ */
  const links = document.querySelectorAll(".nav-link");
  const percentageOverlayText = document.querySelector(
    ".hero_percentage-container > .hero_percentage-container-text",
  );
  const customCursor = document.querySelector(".custom-cursor");

  const customCursorContent = document.querySelector(
    ".custom-cursor > .custom-cursor-content",
  );

  const hoverLinkSection = document.querySelectorAll(".overlay");
  const projectMenuItemAll = document.querySelectorAll(".project-menu-item");
  const overlayTrigger = document.querySelectorAll(".overlay-under-trigger");
  const overlaySection = document.querySelectorAll(".overlay");
  const copyrightSection = document.querySelector(".copyright-section");
  const copyrightText = document.querySelector(".copyright-text");
  const copyrightLinks = document.querySelectorAll(".copyright-link-text");

  let ctx = gsap.context(() => {
    /* ============================================================
           3. INITIAL STATES (gsap.set)
        ============================================================ */
    gsap.set(".hero_percentage-container", { autoAlpha: 1 });
    gsap.set(".home-page", { clipPath: "inset(0% 0% 0% 0%)" });
    gsap.set(links, { yPercent: -100 });
    gsap.set(".overlay-image", { clipPath: "inset(14% 32% 0% 32%)" });
    gsap.set(".hero-bg", {
      transformOrigin: "50% 50%",
      clipPath: "inset(54% 37% 47% 34%)",
    });
    gsap.set(".curtain-1", { clipPath: "inset(0% 0% 0% 0%)" });
    gsap.set(".curtain-2", { clipPath: "inset(0% 0% 0% 0%)" });
    gsap.set(".container-hamburger-menu ", {
      opacity: 0,
      pointerEvents: "none",
    });

    gsap.set(".copyright-text", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });

    gsap.set(copyrightLinks, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });

    gsap.set(copyrightSection, { opacity: 0, pointerEvents: "none" });

    gsap.set(".overlay-pin-trigger", { opacity: 0 });
    gsap.set(customCursor, { opacity: 0 });

    gsap.set(".title-hamburger-menu", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });

    const layerContainerAll = gsap.utils.toArray(".layer-container");

    gsap.set(".title-hamburger-menu", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });

    gsap.set([layerContainerAll, projectMenuItemAll], {
      clipPath: " inset(0% 51% 0% 49%)",
    });

    /* ============================================================
           4. HAMBURGER MENU — OPEN / CLOSE TIMELINES
        ============================================================ */
    let isHomePageIsOpen = true;

    const cpl = gsap.timeline({ paused: true, default: { ease: "expo.out" } });
    const hmtl = gsap.timeline();

    const handleCloseHomePage = () => {
      cpl
        .play(0)
        .to(
          ".home-page",
          {
            clipPath: `inset(0% 51% 3% 49%)`,
            ease: "expo.inOut",
            duration: 0.7,
          },
          "<",
        )
        .to(
          ".logo-img",
          {
            opacity: 0,
          },
          "<",
        )
        .to(
          links,
          {
            color: "black",
          },
          "<",
        )
        .to(
          ".curtain-2",
          {
            clipPath: `inset(0% 51% 3% 49%)`,
            duration: 0.8,
            ease: "expo.inOut",
          },
          "<60%",
        )
        .to(
          ".container-hamburger-menu",
          {
            opacity: 1,
            pointerEvents: "auto",
            duration: 0,
          },
          "<95%",
        )
        .add(() => hmtl.play())
        .to(".title-hamburger-menu", {
          delay: 0.2,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        })
        .to(
          projectMenuItemAll,
          {
            clipPath: " inset(0% 0% 0% 0%)",
            duration: 1,
            ease: "expo",
            stagger: 0.1,
          },
          "-=0.5",
        )
        .to(
          layerContainerAll,
          {
            clipPath: " inset(0% 0% 0% 0%)",
            duration: 0.5,
            delay: 0.001,
            ease: "sine.inOut",
            stagger: 0.1,
          },
          "<",
        )
        .to(
          copyrightSection,
          {
            opacity: 1,
            pointerEvents: "auto",
            duration: 0.5,
          },
          "-=0.3",
        )
        .to(
          ".copyright-text",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.6,
            ease: "expo.out",
          },
          "<",
        )
        .to(
          copyrightLinks,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.6,
            ease: "expo.out",
            stagger: 0.05,
          },
          "-=0.4",
        )
        .to(
          "footer",
          {
            autoAlpha: 0,
          },
          "-=0.5",
        );

      isHomePageIsOpen = false;
    };

    const handleOpenHomePage = () => {
      lenis.scrollTo(0, 0);
      hmtl.reverse();
      cpl.reverse();
      isHomePageIsOpen = true;
    };

    /* ============================================================
           5. NAV LINKS — SPLIT TEXT HOVER + MENU TOGGLE
        ============================================================ */
    links.forEach((link) => {
      const menuToggle = link.dataset.linkOpenHamburgerMenu;

      if (menuToggle == 1) {
        link.addEventListener("click", () => {
          isHomePageIsOpen ? handleCloseHomePage() : handleOpenHomePage();
        });
      }

      const split = SplitText.create(link.querySelectorAll(".nav-link__text"), {
        type: "chars",
        charsClass: "char",
      });

      const linkTimeline = gsap.timeline({ paused: true });
      linkTimeline.to(split.chars, {
        yPercent: -100,
        stagger: 0.01,
        duration: 0.2,
        ease: "power2.out",
      });

      link.addEventListener("mouseenter", () => linkTimeline.play());
      link.addEventListener("mouseleave", () => linkTimeline.reverse());
    });

    /* ============================================================
           6. HERO PIN — SCROLLTRIGGER
        ============================================================ */
    ScrollTrigger.create({
      trigger: ".hero",
      start: "bottom 70%",
      pin: ".hero",
      pinSpacing: false,
      pinType: "transform",
      onUpdate: (self) => {
        if (self.progress > 0.2 && self.direction > 0) {
          gsap.to(".overlay-pin-trigger", { opacity: 1 });
        } else if (self.progress <= 0.2 && self.direction < 0) {
          gsap.to(".overlay-pin-trigger", { opacity: 0 });
        }
      },
    });

    overlayTrigger.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: "bottom 40%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    /* ============================================================
           7. INTRO TIMELINE — MATCHMEDIA (desktop / mobile)
        ============================================================ */
    const mm = gsap.matchMedia();
    let hl;
    let introHasPlayed = false;

    mm.add(
      {
        isDesktop: "(min-width: 1020px)",
        isMobile: "(max-width: 1020px)",
      },
      (context) => {
        const { isDesktop } = context.conditions;

        gsap.set(".hero-title", {
          yPercent: isDesktop ? -120 : -400,
          scale: isDesktop ? 0.5 : 1,
        });
        gsap.set(".footer-title", { xPercent: -6 });
        gsap.set(".logo-img", {
          scale: 1.5,
          yPercent: isDesktop ? 100 : 150,
          x: isDesktop ? 0 : -80,
          transformOrigin: "top",
        });

        hl = gsap.timeline({ paused: true });

        hl.to(".hero-bg", {
          clipPath: "inset(30% 20% 37% 24%)",
          duration: 1,
          ease: "power4",
        })
          .to(
            ".hero-title",
            { yPercent: isDesktop ? -40 : -200, duration: 1, ease: "power4" },
            "<",
          )
          .to(
            ".logo-img",
            { yPercent: 20, scale: 1.5, duration: 1, ease: "power4" },
            "<",
          )
          .to(
            ".hero-bg",
            {
              clipPath: "inset(30% 11% 37% 13%)",
              duration: 1.4,
              ease: "expo.inOut",
            },
            "+=0.4",
          )
          .to(".hero-bg", {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.5,
            ease: "expo.inOut",
            transformOrigin: "50% 50%",
          })
          .to(
            ".hero-title",
            {
              yPercent: isDesktop ? 60 : 120,
              scale: 1.8,
              color: "red",
              duration: 1.5,
              ease: "expo.inOut",
            },
            "<",
          )
          .to(
            ".svg-logo",
            {
              fill: "red",
              ease: "expo.inOut",
            },
            "-=0.8",
          )
          .to(
            links,
            {
              yPercent: 0,
              onComplete: () => lenis.start(),
            },
            "-=0.6",
          );

        if (introHasPlayed) {
          hl.progress(1);
        }

        return () => {};
      },
    );

    /* ============================================================
           8. LOADER — PERCENTAGE COUNTER
        ============================================================ */
    let counter = { value: 0 };

    gsap.to(counter, {
      value: 0,
      delay: 0,
      duration: 1,
      onUpdate: function () {
        const progress = this.progress();
        percentageOverlayText.textContent = `${Math.floor(progress * 100)}%`;
      },
      onComplete: () => {
        gsap.to(".hero_percentage-container", { autoAlpha: 0 });

        hl.play();
        hl.eventCallback("onComplete", () => {
          introHasPlayed = true;
          gsap.to(customCursor, { opacity: 1 });
        });
      },
    });

    /* ============================================================
           9. PROJECT MENU ITEMS — CHAR SPLIT + HOVER REVEAL
        ============================================================ */
    function createDuplicatedChars(el) {
      const text = el.textContent.trim();
      el.innerHTML = "";
      el.classList.add("flex");

      text.split("").forEach((char) => {
        const mask = document.createElement("span");
        mask.className = "char-mask inline-block overflow-hidden";

        const inner = document.createElement("span");
        inner.className = "char-inner flex flex-col";

        const displayChar = char === " " ? "\u00A0" : char;

        const top = document.createElement("span");
        top.className = "char-line char-line-top inline-block text-black";
        top.textContent = displayChar;

        const bottom = document.createElement("span");
        bottom.className = "char-line char-line-bottom inline-block text-white";
        bottom.textContent = displayChar;

        inner.append(top, bottom);
        mask.appendChild(inner);
        el.appendChild(mask);
      });

      return el.querySelectorAll(".char-inner");
    }

    projectMenuItemAll.forEach((item) => {
      const idContainer = item.querySelector(".id-container span");
      const titleMenuProjectTop = item.querySelector(
        ".title-menu-project-top span",
      );
      const titleMenuProjectBottom = item.querySelector(
        ".title-menu-project-bottom span",
      );

      const idChars = createDuplicatedChars(idContainer);
      const titleTopChars = createDuplicatedChars(titleMenuProjectTop);
      const titleBottomChars = createDuplicatedChars(titleMenuProjectBottom);
      const allChars = [...idChars, ...titleTopChars, ...titleBottomChars];

      hmtl.set(allChars, { yPercent: 0 });

      const layerContainer = item.querySelector(".layer-container");
      const layerImage2 = item.querySelector(".layer-2");

      gsap.set(layerImage2, { clipPath: "inset(49% 46% 51% 51%)" });

      item.addEventListener("mouseenter", () => {
        const tl = gsap.timeline();

        tl.to(layerContainer, {
          clipPath: "inset(6% 6% 7% 7%)",
          duration: 0.6,
          ease: "power3",
        }).to(
          layerImage2,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.8,
            ease: "power4.out",
          },
          "<",
        );

        tl.to(
          idChars,
          {
            yPercent: -50,
            stagger: 0.002,
            duration: 0.3,
            ease: "expo.inOut",
          },
          0,
        )
          .to(
            titleTopChars,
            {
              yPercent: -50,
              stagger: 0.005,
              duration: 0.3,
              ease: "power2",
            },
            0,
          )
          .to(
            titleBottomChars,
            {
              yPercent: -50,
              stagger: 0.005,
              duration: 0.3,
              ease: "power2",
            },
            0,
          );
      });

      item.addEventListener("mouseleave", () => {
        const tl = gsap.timeline();

        tl.to(layerContainer, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.6,
          ease: "power3",
        }).to(
          layerImage2,
          {
            clipPath: "inset(49% 46% 51% 51%)",
            duration: 0.8,
            ease: "power4.out",
          },
          "<",
        );

        tl.to(
          idChars,
          { yPercent: 0, stagger: 0.02, duration: 0.3, ease: "expo.inOut" },
          0,
        )
          .to(
            titleTopChars,
            { yPercent: 0, stagger: 0.02, duration: 0.3, ease: "expo.inOut" },
            0,
          )
          .to(
            titleBottomChars,
            { yPercent: 0, stagger: 0.02, duration: 0.3, ease: "expo.inOut" },
            0,
          );
      });
    });

    /* ============================================================
           10. CUSTOM CURSOR
        ============================================================ */
    function changeCursorText(newText) {
      const tl = gsap.timeline();

      tl.to(customCursor, {
        scaleX: 0.7,
        scaleY: 1.3,
        duration: 0.15,
        ease: "power2.in",
      })
        .call(() => {
          customCursorContent.textContent = newText;
        })
        .to(customCursor, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
        });
    }

    hoverLinkSection.forEach((item) => {
      item.addEventListener("mouseenter", () => changeCursorText("view"));
      item.addEventListener("mouseleave", () => changeCursorText("scroll"));
    });

    const xTo = gsap.quickTo(".custom-cursor", "x", {
      duration: 0.4,
      ease: "power3",
    });
    const yTo = gsap.quickTo(".custom-cursor", "y", {
      duration: 0.4,
      ease: "power3",
    });

    window.addEventListener("mousemove", (e) => {
      xTo(e.clientX);
      yTo(e.clientY - 100);
    });

    /* ============================================================
           11. PROJECT OVERLAYS — SCROLL-DRIVEN REVEALS
        ============================================================ */
    overlaySection.forEach((item) => {
      const overlayBg = item.querySelector(".overlay-image");
      const overlayBgUnder = item.querySelector(".overlay-bg-under");
      const overlayTitle = item.querySelector(".overlay-title");
      const overlayDescription = item.querySelector(".overlay-description");
      const overlaySubtitle = item.querySelector(".overlay-subtitle");

      const overlaySubtitleChars = SplitText.create(overlaySubtitle, {
        type: "chars",
      });
      const overlayDescriptionChars = SplitText.create(overlayDescription, {
        type: "chars",
      });
      const overlayTitleChars = SplitText.create(overlayTitle, {
        type: "chars",
      });

      gsap.set(overlaySubtitleChars.chars, { yPercent: 100 });
      gsap.set(overlayDescriptionChars.lines, { yPercent: 100 });
      gsap.set(overlayTitleChars.chars, { yPercent: 100 });

      const stl = gsap.timeline({
        scrollTrigger: {
          trigger: overlayBg,
          start: "top 80%",
          end: "+=1200",
          scrub: true,
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "none" },
      });

      gsap.fromTo(
        overlaySubtitleChars.chars,
        { yPercent: 100 },
        {
          stagger: 0.04,
          yPercent: 0,
          duration: 0.2,
          scrollTrigger: {
            trigger: overlaySubtitle,
            start: "top 80%",
            end: "+=100",
            scrub: false,
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        overlayDescriptionChars.chars,
        { yPercent: 100 },
        {
          stagger: 0.02,
          yPercent: 0,
          scrollTrigger: {
            trigger: overlayDescription,
            start: "top 80%",
            end: "+=200",
            scrub: false,
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        overlayTitleChars.chars,
        { yPercent: 100 },
        {
          stagger: 0.05,
          yPercent: 0,
          scrollTrigger: {
            trigger: overlayTitle,
            start: "top 80%",
            end: "+=200",
            scrub: false,
            toggleActions: "play none none reverse",
          },
        },
      );

      stl
        .fromTo(
          overlayBg,
          { clipPath: "inset(14% 32% 0% 32%)" },
          { clipPath: "inset(14% 14% 0 16%)" },
          "<",
        )
        .to(overlayBg, { clipPath: "inset(0% 0% 0% 0%)" }, ">");

      stl.fromTo(overlayBgUnder, { opacity: 0 }, { opacity: 1 }, ">50%");
    });

    /* ============================================================
           12. FOOTER
        ============================================================ */
    const ftl = gsap.timeline({
      scrollTrigger: {
        trigger: overlaySection[overlaySection.length - 1],
        start: "top 90%",
        end: "bottom 20%",
        scrub: true,
      },
    });

    ftl.fromTo(".footer-title", { scale: 0.5, y: 100 }, { scale: 0.9, y: 0 });
  });

  mm?.revert();
});
