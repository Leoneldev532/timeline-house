window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText, Flip, ScrollTrigger);

  /* ============================================================
      0. SMOOTH SCROLL (Lenis)
  ============================================================ */
  const lenis = new Lenis({
    duration: 1.2,
    wheelMultiplier: 0.6,
    smoothWheel: true,
  });
  lenis.scrollTo(0, { immediate: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

    /* ============================================================
      1. PROJECT DATA
    ============================================================ */
  const PROJECTS = [
    {
      title: "Pulp Fiction",
      director: "Quentin Tarantino",
      productionHouse: "Miramax",
      mediaType: "image",
      media: "./assets/images/image_13.jpg",
    },
    {
      title: "Interstellar",
      director: "Christopher Nolan",
      productionHouse: "Paramount",
      mediaType: "image",
      media: "./assets/images/image_07.jpg",
    },
    {
      title: "Forrest Gump",
      director: "Robert Zemeckis",
      productionHouse: "Paramount",
      mediaType: "image",
      media: "./assets/images/images_10.jpg",
    },
    {
      title: "Inception",
      director: "Christopher Nolan",
      productionHouse: "Warner Bros.",
      mediaType: "video",
      media: "https://res.cloudinary.com/dx1axx1s2/video/upload/q_auto/v1784503650/4_frnzoo.mp4",
    },
    {²
      title: "Le Parrain",
      director: "Francis Ford Coppola",
      productionHouse: "Paramount",
      mediaType: "video",
      media: "https://res.cloudinary.com/dx1axx1s2/video/upload/q_auto/v1784503650/3_nijmk6.mp4",
    },
    {
      title: "Matrix",
      director: "Lana et Lilly Wachowski",
      productionHouse: "Warner Bros.",
      mediaType: "image",
      media: "./assets/images/image_13.jpg",
    },
    {
      title: "La Liste de Schindler",
      director: "Steven Spielberg",
      productionHouse: "Universal",
      mediaType: "image",
      media: "./assets/images/image_07.jpg",
    },
    {
      title: "Avatar",
      director: "James Cameron",
      productionHouse: "20th Century Fox",
      mediaType: "image",
      media: "./assets/images/images_10.jpg",
    },
  ];
  const N = PROJECTS.length;
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

    /* ============================================================
      2. HERO MAIN CONTENT
    ============================================================ */
  const heroEls = {
    title: document.querySelector(".hero__project-selected-title-selected"),
    subtitle: document.querySelector(
      ".hero__project-selected-subtitle-selected",
    ),
    productionHouse: document.querySelector(
      ".hero__project-selected-building-home",
    ),
    bgImage: document.querySelector(".hero_bg-image"),
    bgVideo: document.querySelector(".hero_bg-video"),
  };

  const wrapperContainer = document.querySelector(
    ".progress__bar_container-wrapper",
  );

  function renderHeroContent(movie) {
    if (!movie) return;

    // 1. Update texts
    if (heroEls.title) heroEls.title.innerHTML = movie.title;
    if (heroEls.subtitle) heroEls.subtitle.innerHTML = movie.director;
    if (heroEls.productionHouse)
      heroEls.productionHouse.textContent = movie.productionHouse;

    // 2. Clean and smooth media handling (avoids resets on consecutive videos)
    if (movie.mediaType === "video" && heroEls.bgVideo) {
      const absoluteMediaUrl = new URL(movie.media, window.location.href).href;

      if (heroEls.bgVideo.src !== absoluteMediaUrl) {
        heroEls.bgVideo.src = movie.media;
        heroEls.bgVideo.load();
        heroEls.bgVideo
          .play()
          .catch((err) => console.warn("Lecture vidéo bloquée :", err));
      }

      heroEls.bgVideo.classList.remove("opacity-0");
      heroEls.bgVideo.classList.add("opacity-100");
      heroEls.bgImage?.classList.remove("opacity-100");
      heroEls.bgImage?.classList.add("opacity-0");
    } else if (heroEls.bgImage) {
      const absoluteMediaUrl = new URL(movie.media, window.location.href).href;

      if (heroEls.bgImage.src !== absoluteMediaUrl) {
        heroEls.bgImage.src = movie.media;
      }

      heroEls.bgImage.classList.remove("opacity-0");
      heroEls.bgImage.classList.add("opacity-100");
      heroEls.bgVideo?.classList.remove("opacity-100");
      heroEls.bgVideo?.classList.add("opacity-0");
    }
  }

    /* ============================================================
      3. BLOCK 1 — LEFT MARQUEE LIST (Visual indicator only)
    ============================================================ */
  function initProgressMarquee() {
    const wrapper = document.querySelector(".progress__bar_container-wrapper");

    if (!wrapper) return;

    const originalGroup = wrapper.querySelector(".progress__bar-loop-group");
    const cloneGroup = wrapper.querySelectorAll(".progress__bar-loop-group")[1];
    if (!originalGroup || !cloneGroup) return;

    const originalItems = [
      ...originalGroup.querySelectorAll(".hero__project-selected-thumbnail"),
    ];
    originalItems.forEach((item) =>
      cloneGroup.appendChild(item.cloneNode(true)),
    );

    const allThumbnails = [
      ...wrapper.querySelectorAll(".hero__project-selected-thumbnail"),
    ];
    const allBars = allThumbnails.map((item) =>
      item.querySelector(".progress__bar-project-item"),
    );
    gsap.set(allBars, { scaleY: 0, transformOrigin: "top center" });

    const firstItem = wrapper.querySelector(
      ".hero__project-selected-thumbnail",
    );
    const itemHeight = firstItem.offsetHeight;
    const loopHeight = originalGroup.getBoundingClientRect().height;
    const speed = 80;
    const totalDuration = loopHeight / speed;

    gsap.to(wrapper, {
      y: `-=${loopHeight}`,
      duration: totalDuration,
      ease: "none",
      repeat: -1,
      modifiers: {
        y: gsap.utils.unitize((y) => parseFloat(y) % loopHeight),
      },
    });

    const TRIGGER_RATIO = 0.5;
    const barSpeedFactor = 1;
    const FILL_DISTANCE = itemHeight * barSpeedFactor;

    gsap.ticker.add(() => {
      const triggerY = window.innerHeight * TRIGGER_RATIO;

      allThumbnails.forEach((thumb, i) => {
        const rect = thumb.getBoundingClientRect();
        const bar = allBars[i];
        const distancePastTrigger = triggerY - rect.top;

        if (distancePastTrigger <= 0) {
          gsap.set(bar, { scaleY: 0 });
          return;
        }

        const progress = Math.min(distancePastTrigger / FILL_DISTANCE, 1);
        gsap.set(bar, { scaleY: progress });
      });
    });
  }

    /* ============================================================
      4. BLOCK 2 — PROJECT STAIRCASE (Main background driver)
    =========================================================== */
  function initStaircase() {
    const wrap = document.querySelector(".hero__project-staircase");
    const animBg = document.querySelector(
      ".hero__anim-background-Project-staircase-show",
    );

    if (!wrap) return;

    gsap.set(wrap, { x: -400, y: 500 });

      const STEPS = [
      { itemHeight: 70, imgWidth: 60 },
      { itemHeight: 110, imgWidth: 120 },
      { itemHeight: 200, imgWidth: 240 },
        { itemHeight: 300, imgWidth: 480 }, // Central initial slot (Index 3)
      { itemHeight: 140, imgWidth: 240 },
      { itemHeight: 70, imgWidth: 120 },
      { itemHeight: 35, imgWidth: 60 },
    ];

    const LABEL_GAP = 20;
    let SLOTS = [];

    function computeSlots() {
      const groundY = wrap.clientHeight || window.innerHeight;
      SLOTS[3] = { x: 0, y: groundY - STEPS[3].itemHeight };

      let currentX = STEPS[3].imgWidth;
      for (let i = 4; i < STEPS.length; i++) {
        SLOTS[i] = { x: currentX, y: groundY - STEPS[i].itemHeight };
        currentX += STEPS[i].imgWidth;
      }

      let currentTopY = SLOTS[3].y;
      for (let i = 2; i >= 0; i--) {
        currentTopY -= STEPS[i].itemHeight;
        SLOTS[i] = { x: 0, y: currentTopY };
      }
    }

    function getSlotData(index) {
      if (index < STEPS.length) {
        return {
          x: SLOTS[index].x,
          y: SLOTS[index].y,
          w: STEPS[index].imgWidth,
          h: STEPS[index].itemHeight,
        };
      }
      const last = STEPS.length - 1;
      return {
        x: SLOTS[last].x + STEPS[last].imgWidth,
        y: SLOTS[last].y,
        w: STEPS[last].imgWidth,
        h: STEPS[last].itemHeight,
      };
    }

    computeSlots();

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(computeSlots, 150);
    });

    const els = STEPS.map(() => {
      const el = document.createElement("div");
      el.className = "project-item";
      el.style.position = "absolute";
      el.style.willChange = "transform, width, height";
      el.innerHTML = `
        <div class="content-wrapper" style="width:100%; height:100%; overflow:hidden; will-change:width, height;">
          <div class="image-mask" style="width:100%; height:100%; will-change:transform; transform-style:preserve-3d; backface-visibility:hidden;"></div>
        </div>
      `;
      wrap.appendChild(el);
      return el;
    });

    const labelEls = STEPS.map(() => {
      const el = document.createElement("div");
      el.className = "project-metadata";
      el.style.position = "absolute";
      el.style.top = "0";
      el.style.left = "0";
      el.style.willChange = "transform";
      el.innerHTML = `<span class="roman"></span><span class="title"></span>`;
      wrap.appendChild(el);
      return el;
    });

    let scrollPos = 0;
    let target = 0;
    let currentIndex = -1;
    let currentStepIndex = -1;
    let scrollDirection = 1;
    renderHeroContent(PROJECTS[3]);

    function render() {
      let virtualProgress = (scrollPos * 0.0015) % N;
      if (virtualProgress < 0) virtualProgress += N;
      const stepIndex = Math.floor(virtualProgress);
      const amt = virtualProgress - stepIndex;

      if (stepIndex !== currentStepIndex) {
        currentStepIndex = stepIndex;
        const newCurrentIndex = (((3 - stepIndex) % N) + N) % N;
        const indexChanged = newCurrentIndex !== currentIndex;
        currentIndex = newCurrentIndex;

        els.forEach((el, slotIndex) => {
          const offset = slotIndex - 3;
          const projectIdx = (((currentIndex + offset) % N) + N) % N;
          const project = PROJECTS[projectIdx];
          const mask = el.querySelector(".image-mask");
          const mediaStyle =
            "width:100%; height:100%; object-fit:cover; transform:translateZ(0); backface-visibility:hidden;";

          mask.innerHTML =
            project.mediaType === "video"
              ? `<video src="${project.media}" loop muted playsinline autoplay style="${mediaStyle}"></video>`
              : `<img src="${project.media}" alt="${project.title}" style="${mediaStyle}">`;

          const labelEl = labelEls[slotIndex];
          labelEl.querySelector(".roman").textContent = ROMAN[projectIdx];
          labelEl.querySelector(".title").textContent = project.title;
        });

        if (indexChanged) {
          renderHeroContent(PROJECTS[currentIndex]);
        }
      }

      // 2. Direction handling (Hysteresis to avoid flickering)
      const velocity = target - scrollPos;
      if (Math.abs(velocity) > 0.5) {
        scrollDirection = velocity > 0 ? 1 : -1;
      }

      const isDown = scrollDirection === 1;
      const absVelocity = Math.abs(velocity);
      const speedStretch = Math.min(absVelocity * 0.0015, 0.3);
      const snapAmt = amt >= 0.94 ? 1 : amt;

      // 3. Applying transformations
      els.forEach((el, slotIndex) => {
        const container = el.querySelector(".content-wrapper");
        const mask = el.querySelector(".image-mask");
        const labelEl = labelEls[slotIndex];

        const current = getSlotData(slotIndex);
        const next = getSlotData(slotIndex + 1);
        const progress = snapAmt;

        const baseW = current.w + (next.w - current.w) * progress;
        const baseH = current.h + (next.h - current.h) * progress;
        const baseX = current.x + (next.x - current.x) * progress;
        const baseY = current.y + (next.y - current.y) * progress;

        let w = baseW;
        let h = baseH;
        let posX = baseX;
        let posY = baseY;

        // --- IMPROVED Z-INDEX LOGIC ---
        // Base: Classic pyramid (center is at the apex)
        let zIndex = 10 - Math.abs(slotIndex - 3);

        // Si on descend : on priorise le slot 3 (il devient le centre)
        // Si on monte : on priorise le slot 2 (il devient le centre)
        // On ajoute un seuil de 'progress > 0.3' pour éviter le saut immédiat au changement de direction
        // if (isDown) {
        //   if (slotIndex === 3 && progress > 0.3) zIndex = 10;
        // } else {
        //   if (slotIndex === 4 && progress > 0.5) zIndex = 10;
        // }

        if (isDown) {
          // While scrolling down (progress goes from 0 to 1)

          if (slotIndex === 3 && progress > 0.3) zIndex = 10;
        } else {
          // While scrolling up (progress goes from 1 to 0)
          if (progress > 0.1) {
            zIndex = 10 - Math.abs(slotIndex - 2); // On retient l'élément 2 au-dessus un peu plus longtemps
          } else {
            zIndex = 10 - Math.abs(slotIndex - 3); // L'élément 3 redevient le centre
          }
        }

        // ---------------------------------

        el.style.opacity = slotIndex === 0 || slotIndex === 6 ? "0.4" : "1";

        // Deformation logic (Stretch)
        if (isDown) {
          if (slotIndex === 3) {
            container.style.transformOrigin = "left center";
            mask.style.transformOrigin = "left center";
            if (progress < 0.85) {
              posX = current.x;
              const movingRightEdge =
                current.x +
                (next.x - current.x) * progress +
                (current.w + (next.w - current.w) * progress);
              w = movingRightEdge - posX;
            } else {
              const t = (progress - 0.85) / 0.15;
              const ease = t * t;
              posX = current.x + (next.x - current.x) * progress * ease;
              w =
                current.w +
                (next.w - current.w) * progress +
                (1 - ease) * (next.x * 0.85);
            }
            mask.style.transform = `scale(${1 + speedStretch * 1.2}) translate3d(0,0,0)`;
          } else {
            mask.style.transform = "scale(1) translate3d(0,0,0)";
            container.style.transformOrigin = "center center";
          }
        } else {
          if (slotIndex === 2) {
            container.style.transformOrigin = "bottom center";
            mask.style.transformOrigin = "bottom center";
            if (progress > 0.15) {
              const movingTopEdge = current.y + (next.y - current.y) * progress;
              const fixedBottomEdge = next.y + next.h;
              posY = movingTopEdge;
              h = fixedBottomEdge - posY;
            } else {
              posY = current.y + (next.y - current.y) * progress;
              h = current.h + (next.h - current.h) * progress;
            }
            mask.style.transform = `scale(${1 + speedStretch * 1.2}) translate3d(0,0,0)`;
          } else {
            mask.style.transform = "scale(1) translate3d(0,0,0)";
            container.style.transformOrigin = "center center";
          }
        }

        el.style.zIndex = zIndex;

        el.style.transform = `translate3d(${Math.round(posX)}px, ${Math.round(posY)}px, 0px)`;
        container.style.width = `${Math.round(w)}px`;
        container.style.height = `${Math.round(h)}px`;

        const labelX = Math.round(baseX + baseW + LABEL_GAP);
        const labelY = Math.round(baseY);
        labelEl.style.transform = `translate3d(${labelX}px, ${labelY}px, 0)`;
        labelEl.style.zIndex = 40;
        labelEl.style.opacity =
          slotIndex === 0 || slotIndex === 6 ? "0.4" : "1";
      });
    }

    /* ============================================================
      WHEEL GESTURE (Anti-flicker system with double-lock)
    ============================================================ */
    let isStaircaseVisible = false;
    let wheelTimeout = null;

    window.addEventListener(
      "wheel",
      (e) => {
        target += e.deltaY;

        clearTimeout(wheelTimeout);

        if (!isStaircaseVisible) {
          onWheelStart();
        }

        wheelTimeout = setTimeout(() => {
          checkIfScrollTrulySettled();
        }, 100);
      },
      { passive: true },
    );

    function checkIfScrollTrulySettled() {
      const distanceToTarget = Math.abs(target - scrollPos);

      if (distanceToTarget > 2) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(checkIfScrollTrulySettled, 50);
      } else {
        onWheelEnd();
      }
    }

    function onWheelStart() {
      isStaircaseVisible = true;
      gsap.to(wrap, {
        x: 0,
        y: 0,
        duration: 0.3,
        overwrite: "auto",
        ease: "power2.out",
      });
      animBg?.classList.remove("removeblur");
      animBg?.classList.add("addblur");
    }

    function onWheelEnd() {
      isStaircaseVisible = false;
      gsap.to(wrap, {
        x: "-50%",
        y: 500,
        duration: 0.4,
        overwrite: "auto",
        ease: "power2.inOut",
      });
      animBg?.classList.remove("addblur");
      animBg?.classList.add("removeblur");
    }

    wrapperContainer.addEventListener("mouseenter", () => {
      onWheelStart();
    });

    wrapperContainer.addEventListener("mouseleave", () => {
      onWheelEnd();
    });
    function loop() {
      scrollPos += (target - scrollPos) * 0.075;
      render();
      requestAnimationFrame(loop);
    }

    loop();
  }
    /* ============================================================
      5. INITIALIZATION OF BOTH MODULES
    ============================================================ */
  initProgressMarquee();
  initStaircase();
});
