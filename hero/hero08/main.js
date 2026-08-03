window.addEventListener("DOMContentLoaded", () => {
  const infiniteScrollContainer = document.querySelector(
    ".infinite-scroll-container .grid-section",
  );

  const grid = infiniteScrollContainer;

  grid.style.overflow = "hidden";
  grid.style.touchAction = "none";
  grid.style.position = "relative";

  // ========== DATA ==========
  // Les liens vidéo sont repris depuis carousel/carousel02/main.js
  const items = [
    {
      title: "Aurora — Short Film",
      imageCover:
        "https://cdn.prod.website-files.com/671016cc9bff6eb0ecc694ef/67e383b0d6672afd60dbed40_DSC_5377-p-500.webp",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312352/From_Klickpin.com-_831969731199293419-pin-id-831969731199293419_rfht8c.mp4",
    },
    {
      title: "Midnight Reel",
      imageCover:
        "https://images.unsplash.com/photo-1778470075441-8b2c7ce123b7?w=500&auto=format&fit=crop&q=60",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312363/From_Klickpin.com-_17662623534373268-pin-id-17662623534373268-carousel-8_cownpm.mp4",
    },
    {
      title: "The Director's Cut",
      imageCover:
        "https://images.unsplash.com/photo-1784288195848-bc8fa9b5d89d?w=500&auto=format&fit=crop&q=60",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312352/From_Klickpin.com-_831969731199293419-pin-id-831969731199293419_rfht8c.mp4",
    },
    {
      title: "Beyond the Horizon",
      imageCover:
        "https://images.unsplash.com/photo-1782241594367-31847ff5b0e1?w=500&auto=format&fit=crop&q=60",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312351/From_Klickpin.com-_1115133557754238844-pin-id-1115133557754238844_v2pt11.mp4",
    },
    {
      title: "House of Stories",
      imageCover:
        "https://images.pexels.com/photos/10276044/pexels-photo-10276044.jpeg",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312352/From_Klickpin.com-_831969731199293419-pin-id-831969731199293419_rfht8c.mp4",
    },
  ];

  const tile = 500;

  const cols = Math.ceil(infiniteScrollContainer.clientWidth / tile) + 2;
  const rows = Math.ceil(infiniteScrollContainer.clientHeight / tile) + 2;
  const gap = 2;

  let offX = 0;
  let offY = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  let velX = 0;
  let velY = 0;
  let lastMoveTime = 0;
  let inertiaFrame = null;

  const friction = 0.85;
  const stopThreshold = 0.05;

  const maxDragVelocity = 150;
  const maxWheelVelocity = 40;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function clampVelocity(v, max) {
    return Math.max(-max, Math.min(max, v));
  }

  let cells = [];

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function render(cells, container) {
    const gridW = cols * tile;
    const gridH = rows * tile;
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;

    cells.forEach((cell) => {
      let x = mod(cell.c * tile + offX, gridW) - tile;
      let y = mod(cell.r * tile + offY, gridH) - tile;

      while (x < -tile) x += gridW;
      while (x > containerW) x -= gridW;
      while (y < -tile) y += gridH;
      while (y > containerH) y -= gridH;

      cell.el.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // ========== CURSOR DOT ==========
  const cursorDot = document.createElement("div");
  cursorDot.className = "cursor-dot";
  cursorDot.setAttribute("aria-hidden", "true");

  document.body.appendChild(cursorDot);

  const cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const dotPos = { x: cursorPos.x, y: cursorPos.y };

  // suivi souris global (lissé)
  const setDotX = gsap.quickTo(cursorDot, "x", {
    duration: 0.2,
    ease: "none",
  });
  const setDotY = gsap.quickTo(cursorDot, "y", {
    duration: 0.2,
    ease: "none",
  });

  gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });

  window.addEventListener("pointermove", (e) => {
    setDotX(e.clientX);
    setDotY(e.clientY);
  });

  function showCursorDot(title) {
    cursorDot.textContent = title; // pas de transition sur le texte : changement instantané
    cursorDot.style.opacity = "1";
    cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
  }

  function updateCursorDotText(title) {
    // changement de texte sans transition, même si le dot est déjà visible
    cursorDot.textContent = title;
  }

  function hideCursorDot() {
    cursorDot.style.opacity = "0";
    cursorDot.style.transform = "translate(-50%, -50%) scale(0.6)";
  }

  function initGrid(container) {
    const list = [];
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const item = items[i % items.length];

        const el = document.createElement("div");
        el.className = "card";
        Object.assign(el.style, {
          position: "absolute",
          top: "0",
          left: "0",
          width: `${tile - gap}px`,
          height: `${tile - gap}px`,
          borderRadius: "8px",
          overflow: "hidden",
          cursor: "pointer",
        });

        // ---- poster layer ----
        const poster = document.createElement("div");
        Object.assign(poster.style, {
          position: "absolute",
          inset: "0",
          backgroundImage: `url(${item.imageCover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "opacity 0.4s ease",
        });

        // ---- video layer ----
        const video = document.createElement("video");
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "none";
        video.dataset.src = item.video; // chargé seulement au premier hover
        Object.assign(video.style, {
          position: "absolute",
          inset: "0",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: "0",
          transition: "opacity 0.4s ease",
        });

        el.appendChild(poster);
        el.appendChild(video);
        el.dataset.title = item.title;

        // ---- accessibility ----
        el.setAttribute("role", "listitem");
        el.setAttribute("tabindex", "0");
        el.setAttribute("aria-label", `Project preview: ${item.title}`);

        function activateCard() {
          if (dragging) return;

          showCursorDot(item.title);

          if (!video.src) video.src = video.dataset.src;
          video.style.opacity = "1";
          poster.style.opacity = "0";
          const playPromise = video.play();
          if (playPromise) playPromise.catch(() => {});
        }

        function deactivateCard() {
          hideCursorDot();
          video.style.opacity = "0";
          poster.style.opacity = "1";
          video.pause();
        }

        // ---- hover behavior ----
        el.addEventListener("pointerenter", () => {
          if (dragging) return;
          activateCard();
        });

        el.addEventListener("pointermove", () => {
          if (cursorDot.textContent !== item.title) {
            updateCursorDotText(item.title);
          }
        });

        el.addEventListener("pointerleave", () => {
          deactivateCard();
        });

        // ---- keyboard support ----
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            activateCard();
          } else if (e.key === "Escape") {
            deactivateCard();
            el.blur();
          }
        });

        el.addEventListener("focus", () => {
          if (!dragging) activateCard();
        });

        el.addEventListener("blur", () => {
          deactivateCard();
        });

        container.appendChild(el);
        list.push({ el, r, c });
        i++;
      }
    }
    return list;
  }

  let activePointerId = null;

  function start(x, y) {
    dragging = true;
    lastX = x;
    lastY = y;
    lastMoveTime = performance.now();
    velX = 0;
    velY = 0;

    hideCursorDot();

    if (inertiaFrame) {
      cancelAnimationFrame(inertiaFrame);
      inertiaFrame = null;
    }
  }

  function move(x, y, cells, container) {
    if (!dragging) return;

    const now = performance.now();
    const dt = Math.max(1, now - lastMoveTime);

    const dx = x - lastX;
    const dy = y - lastY;

    velX = clampVelocity((dx / dt) * 16, maxDragVelocity);
    velY = clampVelocity((dy / dt) * 16, maxDragVelocity);

    offX += dx;
    offY += dy;
    lastX = x;
    lastY = y;
    lastMoveTime = now;
    render(cells, container);
  }

  function end() {
    dragging = false;

    if (activePointerId !== null) {
      try {
        infiniteScrollContainer.releasePointerCapture(activePointerId);
      } catch (err) {
        // le pointeur peut déjà ne plus être capturé, sans danger
      }
      activePointerId = null;
    }

    startInertia();
  }

  function startInertia() {
    if (prefersReducedMotion) {
      velX = 0;
      velY = 0;
      return;
    }

    if (inertiaFrame) cancelAnimationFrame(inertiaFrame);

    function step() {
      if (dragging) {
        inertiaFrame = null;
        return;
      }

      offX += velX;
      offY += velY;
      velX *= friction;
      velY *= friction;

      render(cells, infiniteScrollContainer);

      if (Math.abs(velX) > stopThreshold || Math.abs(velY) > stopThreshold) {
        inertiaFrame = requestAnimationFrame(step);
      } else {
        velX = 0;
        velY = 0;
        inertiaFrame = null;
      }
    }

    inertiaFrame = requestAnimationFrame(step);
  }

  infiniteScrollContainer.addEventListener("pointerdown", (e) => {
    if (dragging) return;
    if (!e.isPrimary) return;

    e.preventDefault();

    activePointerId = e.pointerId;
    start(e.clientX, e.clientY);
    infiniteScrollContainer.setPointerCapture(e.pointerId);
  });

  infiniteScrollContainer.addEventListener("pointermove", (e) => {
    if (e.pointerId !== activePointerId) return;

    if (e.buttons === 0 && dragging) {
      end();
      return;
    }

    move(e.clientX, e.clientY, cells, infiniteScrollContainer);
  });

  infiniteScrollContainer.addEventListener("pointerup", (e) => {
    if (e.pointerId !== activePointerId) return;
    end();
  });

  infiniteScrollContainer.addEventListener("pointercancel", (e) => {
    if (e.pointerId !== activePointerId) return;
    end();
  });

  infiniteScrollContainer.addEventListener("lostpointercapture", (e) => {
    if (e.pointerId === activePointerId && dragging) {
      end();
    }
  });

  window.addEventListener("blur", () => {
    if (dragging) end();
  });

  let wheelStopTimer = null;
  let lastWheelTime = 0;

  infiniteScrollContainer.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();

      if (inertiaFrame) {
        cancelAnimationFrame(inertiaFrame);
        inertiaFrame = null;
      }

      const now = performance.now();
      const dt = lastWheelTime ? Math.max(1, now - lastWheelTime) : 16;
      lastWheelTime = now;

      const dx = e.shiftKey ? -e.deltaY : -e.deltaX;
      const dy = e.shiftKey ? 0 : -e.deltaY;

      offX += dx;
      offY += dy;

      velX = clampVelocity((dx / dt) * 16, maxWheelVelocity);
      velY = clampVelocity((dy / dt) * 16, maxWheelVelocity);

      render(cells, infiniteScrollContainer);

      clearTimeout(wheelStopTimer);
      wheelStopTimer = setTimeout(() => {
        lastWheelTime = 0;
        if (!dragging) startInertia();
      }, 60);
    },
    { passive: false },
  );

  cells = initGrid(grid);
  render(cells, infiniteScrollContainer);
  window.addEventListener("resize", () => {
    grid.innerHTML = "";
    cells = initGrid(grid);
    render(cells, infiniteScrollContainer);
  });

  // ---- accessible menu toggle ----
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const mainMenu = document.getElementById("main-menu");

  if (hamburgerBtn && mainMenu) {
    function closeMenu() {
      hamburgerBtn.setAttribute("aria-expanded", "false");
      hamburgerBtn.setAttribute("aria-label", "Open menu");
      mainMenu.setAttribute("aria-hidden", "true");
      mainMenu.classList.remove("is-open");
    }

    function openMenu() {
      hamburgerBtn.setAttribute("aria-expanded", "true");
      hamburgerBtn.setAttribute("aria-label", "Close menu");
      mainMenu.setAttribute("aria-hidden", "false");
      mainMenu.classList.add("is-open");
      const firstLink = mainMenu.querySelector("a");
      if (firstLink) firstLink.focus();
    }

    hamburgerBtn.addEventListener("click", () => {
      const isOpen = hamburgerBtn.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mainMenu.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeMenu();
        hamburgerBtn.focus();
      }
    });

    mainMenu.addEventListener("click", (e) => {
      if (e.target === mainMenu) {
        closeMenu();
      }
    });
  }
});
