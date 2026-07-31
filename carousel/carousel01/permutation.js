window.initPermutations = function ({
  carouselData,
  thumbnailWrapper,
  videoFirstItem,
  videoSecondItem,
}) {
  const DOM = {
    title: document.querySelector(".hero__carousel-description h2"),
    description: document.querySelector(".hero__carousel-description p"),
    creditsList: document.querySelector(".hero__carousel-description ul"),
    firstVideo: videoFirstItem?.querySelector("video"),
    secondVideo: videoSecondItem?.querySelector("video"),
    bgImage: document.querySelector(".hero_carousel-bg img"),
  };

  let currentVideoItem = videoFirstItem;
  let previousVideoItem = videoSecondItem;
  let isVideoAnimating = false;
  let isTextAnimating = false;
  let activeIndex = -1;

  gsap.set(currentVideoItem, { yPercent: 0 });
  gsap.set(previousVideoItem, { yPercent: 110 });

  const animateText = (data, immediate) => {
    if (immediate) {
      if (DOM.title) DOM.title.textContent = data.title;
      if (DOM.description) DOM.description.textContent = data.description;
      if (DOM.creditsList) {
        DOM.creditsList.innerHTML = `
          <li>Director: ${data.credits.director}</li>
          <li>Director of Photography: ${data.credits.dop}</li>
          <li>Editor: ${data.credits.editor}</li>
          <li>Producer: ${data.credits.producer}</li>
        `;
      }
      return;
    }

    if (isTextAnimating) return;
    isTextAnimating = true;

    const listItemsOut = DOM.creditsList
      ? Array.from(DOM.creditsList.querySelectorAll("li"))
      : [];
    const allOutElements = [DOM.title, DOM.description, ...listItemsOut].filter(
      Boolean,
    );

    let outSplitInner, outSplitOuter;
    try {
      outSplitOuter = new SplitText(allOutElements, {
        type: "lines",
        linesClass: "line-outer overflow-hidden",
      });
      outSplitInner = new SplitText(outSplitOuter.lines, {
        type: "lines",
        linesClass: "line-inner",
      });
    } catch (e) {}

    const outTargets = outSplitInner ? outSplitInner.lines : allOutElements;

    gsap.to(outTargets, {
      yPercent: -100,
      duration: 0.4,
      ease: "power2.in",
      stagger: 0.015,
      onComplete: () => {
        if (outSplitOuter) outSplitOuter.revert();
        if (outSplitInner) outSplitInner.revert();

        if (DOM.title) DOM.title.textContent = data.title;
        if (DOM.description) DOM.description.textContent = data.description;
        if (DOM.creditsList) {
          DOM.creditsList.innerHTML = `
            <li>Director: ${data.credits.director}</li>
            <li>Director of Photography: ${data.credits.dop}</li>
            <li>Editor: ${data.credits.editor}</li>
            <li>Producer: ${data.credits.producer}</li>
          `;
        }

        const listItemsIn = DOM.creditsList
          ? Array.from(DOM.creditsList.querySelectorAll("li"))
          : [];
        const allInElements = [
          DOM.title,
          DOM.description,
          ...listItemsIn,
        ].filter(Boolean);

        let inSplitInner, inSplitOuter;
        try {
          inSplitOuter = new SplitText(allInElements, {
            type: "lines",
            linesClass: "line-outer overflow-hidden",
          });
          inSplitInner = new SplitText(inSplitOuter.lines, {
            type: "lines",
            linesClass: "line-inner",
          });
        } catch (e) {}

        const inTargets = inSplitInner ? inSplitInner.lines : allInElements;

        if (inSplitInner) {
          gsap.set(inSplitInner.lines, { yPercent: 100 });
        } else {
          gsap.set(inTargets, { yPercent: 100 });
        }

        gsap.to(inTargets, {
          yPercent: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.02,
          onComplete: () => {
            if (inSplitOuter) inSplitOuter.revert();
            if (inSplitInner) inSplitInner.revert();
            isTextAnimating = false;
          },
        });
      },
    });
  };

  const loadData = (index, immediate = false) => {
    if (index === activeIndex) return;
    const data = carouselData[index];
    if (!data) return;

    animateText(data, immediate);

    if (immediate) {
      const video = currentVideoItem.querySelector("video");
      if (video) {
        video.src = data.video;
        video.play().catch(() => {});
      }
      if (DOM.bgImage) {
        const itemImg = thumbnailWrapper.children[index]?.querySelector("img");
        if (itemImg) DOM.bgImage.src = itemImg.src;
      }
      activeIndex = index;
      return;
    }

    if (isVideoAnimating) return;
    isVideoAnimating = true;

    const outgoing = currentVideoItem;
    const incoming = previousVideoItem;

    const incomingVideo = incoming.querySelector("video");
    if (incomingVideo) {
      incomingVideo.src = data.video;
      incomingVideo.play().catch(() => {});
    }

    if (DOM.bgImage) {
      const itemImg = thumbnailWrapper.children[index]?.querySelector("img");
      if (itemImg) {
        gsap.to(DOM.bgImage, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            DOM.bgImage.src = itemImg.src;
            gsap.to(DOM.bgImage, { opacity: 1, duration: 0.4 });
          },
        });
      }
    }

    const dir = 1;

    gsap.set(incoming, {
      yPercent: dir === 1 ? 110 : -110,
      scale: 0.4,
      transformOrigin: "50% 50%",
    });

    gsap.to(outgoing, {
      yPercent: dir === 1 ? -110 : 110,
      scale: 0.4,
      transformOrigin: "50% 50%",
      duration: 0.8,
      ease: "power3.inOut",
    });

    gsap.to(incoming, {
      yPercent: 0,
      scale: 1,
      transformOrigin: "50% 50%",
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(outgoing, { yPercent: dir === 1 ? 110 : -110, scale: 0.7 });
        const outgoingVideo = outgoing.querySelector("video");
        if (outgoingVideo) {
          outgoingVideo.pause();
          outgoingVideo.currentTime = 0;
        }
        isVideoAnimating = false;
      },
    });

    currentVideoItem = incoming;
    previousVideoItem = outgoing;
    activeIndex = index;
  };

  thumbnailWrapper.addEventListener("click", (e) => {
    const item = e.target.closest(".hero__carousel-item");
    if (!item) return;

    const items = Array.from(thumbnailWrapper.children);
    const index = items.indexOf(item) % carouselData.length;

    loadData(index, false);
  });

  loadData(0, true);

  // ── Video Player (magnetic button + play/pause toggle) ──────────────────
  const setupVideoPlayer = (wrapperEl) => {
    const video = wrapperEl.querySelector("video");
    const btn = wrapperEl.querySelector(".toggle__player-button");
    if (!video || !btn) return;

    gsap.set(btn, { opacity: 0 });

    const pauseIcon = btn.querySelector('[data-icon="pause"]');
    const playIcon = btn.querySelector('[data-icon="play"]');

    // Toggle icons based on play state
    const syncIcons = () => {
      const paused = video.paused;
      pauseIcon?.classList.toggle("hidden", paused);
      playIcon?.classList.toggle("hidden", !paused);
    };

    video.addEventListener("play", syncIcons);
    video.addEventListener("pause", syncIcons);

    // Click: toggle play / pause
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });

    // Magnetic cursor: button follows mouse within a clamped zone
    const CLAMP = 0.25; // button stays within ±25% of wrapper size from center

    wrapperEl.addEventListener("mousemove", (e) => {
      const rect = wrapperEl.getBoundingClientRect();
      // Normalized position relative to center: -1 to +1
      const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to +0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      // Clamp to CLAMP range then convert to px offset
      const clampedX = Math.max(-CLAMP, Math.min(CLAMP, nx)) * rect.width;
      const clampedY = Math.max(-CLAMP, Math.min(CLAMP, ny)) * rect.height;

      gsap.to(btn, {
        x: clampedX,
        y: clampedY,
        duration: 0.4,

        opacity: 1,
        ease: "power2.out",
        overwrite: "auto",
      });
    });

    wrapperEl.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        opacity: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });
    });
  };

  // Attach to both video wrappers
  const videoWrappers = document.querySelectorAll(
    ".hero__carousel-description-video-wrapper",
  );
  videoWrappers.forEach(setupVideoPlayer);
};
