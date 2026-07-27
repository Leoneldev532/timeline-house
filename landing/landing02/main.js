let scrollAnimationsContext = null;

window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

  scrollAnimationsContext = gsap.context(() => {
    CustomEase.create(
      "superSlow",
      "M0,0 C0.126,0.382 0.097,0.754 0.255,0.902 0.447,1.082 0.818,1.001 1,1 ",
    );

    const CLIP_HIDDEN_BOTTOM = "polygon(0% 0%, 100% 0%, 100% 58%, 0% 58%)";
    const CLIP_FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
    const CLIP_HIDDEN_TOP = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";

    const SLIDER_PLAY_THRESHOLD = 0.8;
    const SLIDER_REVERSE_THRESHOLD = 0.2;
    const SECTION_TRANSITION_OFFSET = 900;

    const lenis = new Lenis({
      duration: 1.2,
      wheelMultiplier: 0.6,
      smoothWheel: true,
    });

    lenis.scrollTo(0, { immediate: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const heroAnimatedBlocks = document.querySelectorAll(
      ".hero__animated-block",
    );
    const landingAbSection = document.querySelectorAll(".landing-abs-section");

    const imageOnScrollSlider = document.querySelector(
      ".image-on-scroll-slider",
    );
    const imageOnScrollThumbnail = document.querySelector(
      ".image-on-scroll-slider-thumbnail",
    );

    const titleOnScrollSlider = document.querySelector(
      ".title-on-scroll-slider",
    );
    const descriptionOnScrollSlider = document.querySelector(
      ".description-on-scroll-slider",
    );
    const sliderOnScrollSlider = document.querySelector(
      ".slider-on-scroll-slider",
    );

    const animatedImageOnScroll = document.querySelectorAll(
      ".animated-image-at-scroll",
    );

    const animatedMobile = document.querySelectorAll(
      ".hero__animated-section-mobile",
    );

    const sliderOnScrollDesc = document.querySelector(".slider-on-scroll-desc");
    const sliderOnScrollDesc1 = document.querySelector(
      ".slider-on-scroll-desc1",
    );

    const imageOnScrollSliderItems = imageOnScrollSlider?.children;
    const imageOnScrollThumbnailItems = imageOnScrollThumbnail?.children;
    const titleOnScrollSliderItems = titleOnScrollSlider?.children;
    const descriptionOnScrollSliderItems = descriptionOnScrollSlider?.children;
    const sliderOnScrollSliderItems = sliderOnScrollSlider?.children;
    const sliderOnScrollDescItems = sliderOnScrollDesc?.children;
    const sliderOnScrollDesc1Items = sliderOnScrollDesc1?.children;

    const animatedYOnScroll = document.querySelectorAll(
      ".animated-y-on-scroll",
    );

    const heroAnimatedText = document.querySelectorAll(".hero__animated-text");
    const animatedOonScroll = document.querySelectorAll(
      ".animated-O-on-scroll",
    );

    const headeeFirstTextAnimated = document.querySelectorAll(
      ".headee__firstTextAnimated",
    );

    const heroBigTitle = document.querySelector(".hero__bigTitle");

    const titleHero = document.querySelectorAll(".title__hero");

    const getScrollWaitDistance = (sectionOffset, index) => {
      if (index === 0) return sectionOffset;
      if (index === 1) return SECTION_TRANSITION_OFFSET;
      return 0;
    };

    const initMobileAnimations = () => {
      gsap.set(animatedMobile, { x: "0%" });

      heroAnimatedText.forEach((item) => {
        const itemLineMask = item.querySelector(".line-mask");
        if (itemLineMask)
          gsap.set(itemLineMask, { clipPath: CLIP_HIDDEN_BOTTOM });
      });

      titleHero.forEach((item) => {
        gsap.set(item, { y: 250, opacity: 0 });
      });

      const tlm = gsap.timeline();

      heroAnimatedText.forEach((item) => {
        const text = new SplitText(item, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
        });

        const itemLineMask = item.querySelector(".line-mask");
        if (!itemLineMask) return;

        tlm
          .to(itemLineMask, {
            clipPath: CLIP_FULL,
            duration: 1.4,
          })
          .from(
            text.lines,
            {
              y: "100%",
              duration: 1.5,
              ease: "superSlow",
              stagger: 0.08,
            },
            "-=0.9",
          );
      });

      tlm
        .to(
          animatedMobile,
          {
            stagger: 0.3,
            x: "100%",
          },
          ">",
        )

        .to(
          titleHero,
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
          },
          "-=0.1",
        );
    };

    const initDesktopAnimations = () => {
      const heroBigTitleChars = new SplitText(heroBigTitle, {
        type: "lines",
        charsClass: "line",
        mask: "lines",
      });

      gsap.set(heroBigTitleChars.lines, {
        yPercent: 100,
      });

      gsap.set(heroAnimatedBlocks[0], { x: "-15vw" });
      gsap.set(heroAnimatedBlocks[1], { x: "-15vw" });

      const io = gsap.timeline();
      io.to(heroAnimatedBlocks[0], { delay: 0.5, x: "0vw" }).to(
        heroAnimatedBlocks[1],
        { x: "0vw" },
        "<",
      );

      titleHero.forEach((item) => {
        gsap.set(item, { opacity: 0 });
      });

      const tlm = gsap.timeline();

      const heroFlipTargets = [];

      heroAnimatedText.forEach((item) => {
        const text = new SplitText(item, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
        });

        const itemLineMask = item.querySelector(".line-mask");
        if (!itemLineMask) return;

        text.lines.forEach((line) => {
          line.style.position = "relative";

          const clone = line.cloneNode(true);
          clone.classList.add("line-clone");
          clone.style.position = "absolute";
          clone.style.top = "100%";
          clone.style.left = "0";
          clone.style.width = "100%";

          line.parentNode.appendChild(clone);

          heroFlipTargets.push([line, clone]);
        });

        io.fromTo(
          text.lines.flatMap((line) => [line, line.nextSibling]),
          { y: "100%" },
          {
            y: "0%",
            duration: 1.5,
            ease: "superSlow",
            stagger: 0.08,
          },
          "-=0.9",
        );
      });

      io.addLabel("titleReveal");

      heroFlipTargets.forEach(([line, clone]) => {
        io.to(
          [line, clone],
          {
            y: "-105%",
            duration: 2,
            ease: "superSlow",
          },
          "titleReveal",
        );
      });

      io.to(
        heroBigTitleChars.lines,
        {
          yPercent: 0,
          duration: 2,
          ease: "superSlow",
        },
        "titleReveal",
      ).to(
        titleHero,
        {
          opacity: 1,
        },
        "-=0.8",
      );

      landingAbSection.forEach((section, index) => {
        const next = landingAbSection[index + 1];
        if (!next) return;

        const offset = section.offsetHeight;

        section.style.position = "relative";
        section.style.zIndex = index;
        next.style.position = "relative";
        next.style.zIndex = index + 1;

        const waitScrollDistance = getScrollWaitDistance(offset, index);

        if (waitScrollDistance > 0) {
          gsap.set(next, { marginTop: waitScrollDistance });
        }

        const yl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "bottom bottom",
            end: `+=${waitScrollDistance + offset}`,
            scrub: true,
            pin: true,
            pinSpacing: false,
            anticipatePin: true,
            invalidateOnRefresh: true,
          },
        });

        if (index === 0) {
          yl.fromTo(
            heroAnimatedBlocks[0],
            { x: "0vw" },
            { x: "15vw", duration: 2 },
          )
            .fromTo(
              heroAnimatedBlocks[1],
              { x: "0vw" },
              { x: "35vw", duration: 2 },
              0,
            )
            .to(section, { y: "0", duration: 2 }, 0)
            .set(heroAnimatedBlocks, { backgroundColor: "transparent" }, ">")
            .to([".hero"], { background: "#e9e9e9ff", duration: 0.4 }, ">");

          yl.to({}, { duration: 1 });
        }

        if (index === 1) {
          let isSliderPassed = false;
          const titleDescTl = gsap.timeline({ paused: true });

          titleDescTl.to(
            [
              descriptionOnScrollSliderItems,
              sliderOnScrollSliderItems,
              titleOnScrollSliderItems,
              sliderOnScrollDescItems,
              sliderOnScrollDesc1Items,
            ],
            {
              y: "-100%",
              duration: 1,
              ease: "superSlow",
            },
            "<",
          );

          const kl = gsap.timeline({
            scrollTrigger: {
              trigger: imageOnScrollSlider,
              start: "top top",
              end: "+=1000",
              scrub: true,
            },
          });

          kl.fromTo(
            imageOnScrollSliderItems[1],
            { clipPath: CLIP_FULL },
            { clipPath: CLIP_HIDDEN_TOP },
          ).fromTo(
            imageOnScrollThumbnailItems[0],
            { clipPath: CLIP_FULL },
            {
              clipPath: CLIP_HIDDEN_TOP,
              onUpdate: function () {
                const progress = this.progress();
                if (!isSliderPassed && progress > SLIDER_PLAY_THRESHOLD) {
                  isSliderPassed = true;
                  titleDescTl.play();
                } else if (
                  isSliderPassed &&
                  progress < SLIDER_REVERSE_THRESHOLD
                ) {
                  isSliderPassed = false;
                  titleDescTl.reverse();
                }
              },
            },
            "<",
          );
        }

        yl.to(section, { backgroundColor: "#e9e9e9ff", duration: 0.1 }, ">");
      });

      gsap.set(animatedOonScroll, { opacity: 0, y: 40 });

      animatedYOnScroll.forEach((item) => {
        const text = new SplitText(item, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
        });

        const itemLineMask = item.querySelector(".line-mask");
        if (!itemLineMask) return;

        gsap.set(itemLineMask, { clipPath: CLIP_HIDDEN_BOTTOM });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: itemLineMask,
            start: "top 98%",
            end: "bottom 20%",
            scrub: false,
            toggleActions: "play none none reverse",
          },
        });

        tl.to(itemLineMask, {
          clipPath: CLIP_FULL,
          duration: 1.4,
        }).from(
          text.lines,
          {
            y: "100%",
            duration: 1.5,
            ease: "superSlow",
            stagger: 0.08,
          },
          "-=0.9",
        );
      });

      animatedImageOnScroll.forEach((item) => {
        const itemsImg = item.querySelector("img");

        gsap.set(item, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        });
        gsap.set(itemsImg, { scale: 1.8 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 70%",
            end: "bottom 20%",
            scrub: false,
            toggleActions: "play none none reverse",
          },
        });

        tl.to(item, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
        }).to(itemsImg, { scale: 1 }, "<");
      });

      animatedOonScroll.forEach((item) => {
        gsap.to(item, {
          y: 0,
          duration: 2,
          opacity: 1,
          ease: "superSlow",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "bottom 20%",
            scrub: false,
            toggleActions: "play none none reverse",
          },
        });
      });
    };

    const mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        isDesktop: "(min-width: 800px)",
        isMobile: "(max-width: 799px)",
      },
      (context) => {
        const { reduceMotion, isDesktop, isMobile } = context.conditions;

        if (reduceMotion) {
          gsap.set(heroBigTitle, { y: 0 });
          gsap.set(heroAnimatedBlocks, { x: "0vw" });
          gsap.set(titleHero, { y: 0, opacity: 1 });
          gsap.set(animatedMobile, { x: "100%" });
          gsap.set(animatedOonScroll, { opacity: 1, y: 0 });
          animatedYOnScroll.forEach((item) => {
            new SplitText(item, { type: "lines", linesClass: "line" });
            const itemLineMask = item.querySelector(".line-mask");
            if (itemLineMask) gsap.set(itemLineMask, { clipPath: CLIP_FULL });
          });

          return;
        }

        const splitLinesHeader = [];
        headeeFirstTextAnimated.forEach((item) => {
          const text = new SplitText(item, {
            type: "lines",
            linesClass: "line",
            mask: "lines",
          });
          gsap.set(text.lines, { y: "100%" });
          splitLinesHeader.push(text.lines);
        });

        window.addEventListener("scroll", () => {
          if (window.scrollY > 1000) {
            gsap.to(splitLinesHeader, { y: 0 });
          } else {
            gsap.to(splitLinesHeader, { y: "120%" });
          }
        });

        if (isMobile) {
          initMobileAnimations();
          return;
        }

        if (isDesktop) {
          initDesktopAnimations();
        }
      },
    );
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
});

window.cleanupScrollAnimations = () => {
  scrollAnimationsContext?.revert();
};
