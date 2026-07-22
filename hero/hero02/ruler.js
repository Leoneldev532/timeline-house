/**
 * createScrollRuler
 * Règle graduée infinie (majeures numérotées + mineures), pilotée au wheel/drag
 * avec inertie basée sur la vélocité du geste.
 *
 * Comportement visuel :
 *  - graduations proches du centre passent à opacity-90, les autres restent atténuées
 *
 * @param {Object} options
 * @param {string|HTMLElement} options.root
 * @param {number} options.count
 * @param {number} [options.tickGap=14]
 * @param {number} [options.minorPerMajor=5]
 * @param {number} [options.friction=0.94]
 * @param {number} [options.zoneRadius=60] - rayon (px) autour du centre où les graduations montent à opacity-90
 * @param {boolean} [options.autoplay=true] - défilement automatique continu quand inactif
 * @param {number} [options.autoplaySpeed=0.4] - vitesse du défilement auto, en px/frame (~60fps)
 * @param {number} [options.autoplayResumeDelay=1500] - délai (ms) après la dernière interaction avant reprise de l'autoplay
 * @param {(index: number) => void} [options.onChange]
 * @returns {{ goToIndex: Function, getCurrentIndex: Function, destroy: Function }}
 */
function createScrollRuler({
    root,
    count,
    tickGap = 14,
    minorPerMajor = 5,
    friction = 0.94,
    zoneRadius = 60,
    autoplay = true,
    autoplaySpeed = 0.4,
    autoplayResumeDelay = 1500,
    onChange
}) {
    const container = typeof root === "string" ? document.querySelector(root) : root;
    if (!container || count < 1) return null;

    const track = container.querySelector(".ruler__track");
    const pool = Array.from(track.querySelectorAll(".ruler__tick"));
    const poolSize = pool.length;

    const subPerMajor = minorPerMajor + 1;

    const wrap = (i, m) => ((i % m) + m) % m;

    let scrollOffset = 0;
    let velocity = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let lastPointerX = 0;
    let lastPointerTime = 0;
    let momentumActive = false;
    let currentIndex = null;
    let wheelIdleTimeout = null;
    let lastInteractionTime = 0;

    function opacityForDistance(x, baseOpacity) {
        const dist = Math.abs(x);
        if (dist >= zoneRadius) return baseOpacity;
        const t = 1 - dist / zoneRadius; // 0 au bord de la zone, 1 au centre
        return baseOpacity + (0.9 - baseOpacity) * t;
    }

    function renderTicks() {
        const centerSubIndex = -scrollOffset / tickGap;
        const startSub = Math.floor(centerSubIndex - poolSize / 2);

        for (let k = 0; k < poolSize; k++) {
            const subIndex = startSub + k;
            const x = subIndex * tickGap + scrollOffset;
            const tick = pool[k];
            const isMajor = subIndex % subPerMajor === 0;
            const mark = tick.querySelector(".ruler__tick-mark");
            const label = tick.querySelector(".ruler__tick-label");

            gsap.set(tick, { x });

            if (isMajor) {
                const logicalIndex = wrap(Math.round(subIndex / subPerMajor), count);
                mark.style.height = "20px";
                mark.style.opacity = opacityForDistance(x, 0.5);
                label.textContent = String(logicalIndex + 1).padStart(2, "0");
                label.style.opacity = opacityForDistance(x, 0.35);
            } else {
                mark.style.height = "10px";
                mark.style.opacity = opacityForDistance(x, 0.2);
                label.style.opacity = 0;
            }
        }
    }

    function updateCurrentIndex() {
        const majorSpacing = tickGap * subPerMajor;
        const nearestMajor = Math.round(scrollOffset / majorSpacing);
        const logicalIndex = wrap(-nearestMajor, count);

        if (logicalIndex !== currentIndex) {
            currentIndex = logicalIndex;
            onChange && onChange(currentIndex);
        }
    }

    function frame() {
        if (momentumActive) {
            velocity *= friction;
            scrollOffset += velocity;

            if (Math.abs(velocity) < 0.05) {
                momentumActive = false;
                snapToNearest();
            }
        } else if (
            autoplay &&
            !isDragging &&
            performance.now() - lastInteractionTime > autoplayResumeDelay
        ) {
            scrollOffset -= autoplaySpeed;
        }
        renderTicks();
        updateCurrentIndex();
    }

    gsap.ticker.add(frame);

    function snapToNearest() {
        const majorSpacing = tickGap * subPerMajor;
        const target = Math.round(scrollOffset / majorSpacing) * majorSpacing;
        gsap.to({ v: scrollOffset }, {
            v: target,
            duration: 0.4,
            ease: "power3.out",
            onUpdate: function () { scrollOffset = this.targets()[0].v; }
        });
    }

    function recordVelocitySample(clientX, time) {
        const dt = time - lastPointerTime;
        if (dt > 0) velocity = ((clientX - lastPointerX) / dt) * 16.67;
        lastPointerX = clientX;
        lastPointerTime = time;
    }

    function onPointerDown(e) {
        isDragging = true;
        momentumActive = false;
        lastInteractionTime = performance.now();
        dragStartX = e.clientX;
        dragStartOffset = scrollOffset;
        lastPointerX = e.clientX;
        lastPointerTime = performance.now();
        container.classList.add("cursor-grabbing");
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        scrollOffset = dragStartOffset + (e.clientX - dragStartX);
        recordVelocitySample(e.clientX, performance.now());
    }

    function onPointerUp() {
        if (!isDragging) return;
        isDragging = false;
        lastInteractionTime = performance.now();
        container.classList.remove("cursor-grabbing");
        momentumActive = Math.abs(velocity) > 0.1;
        if (!momentumActive) snapToNearest();
    }

    function onWheel(e) {
        e.preventDefault();
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

        momentumActive = false;
        lastInteractionTime = performance.now();
        scrollOffset -= delta;
        velocity = -delta;

        clearTimeout(wheelIdleTimeout);
        wheelIdleTimeout = setTimeout(() => {
            momentumActive = Math.abs(velocity) > 0.1;
            lastInteractionTime = performance.now();
            if (!momentumActive) snapToNearest();
        }, 80);
    }

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    renderTicks();

    function goToIndex(index) {
        const majorSpacing = tickGap * subPerMajor;
        const currentMajor = Math.round(-scrollOffset / majorSpacing);
        const currentLogical = wrap(currentMajor, count);

        let delta = index - currentLogical;
        if (Math.abs(delta) > count / 2) delta -= Math.sign(delta) * count;

        const targetMajor = currentMajor + delta;
        const targetOffset = -targetMajor * majorSpacing;

        if (currentLogical === index && Math.abs(scrollOffset - targetOffset) < 0.5) {
            return;
        }

        momentumActive = false;

        gsap.to({ v: scrollOffset }, {
            v: targetOffset,
            duration: 0.5,
            ease: "power3.out",
            onUpdate: function () { scrollOffset = this.targets()[0].v; }
        });
    }

    function getCurrentIndex() { return currentIndex; }

    function destroy() {
        gsap.ticker.remove(frame);
        clearTimeout(wheelIdleTimeout);
        container.removeEventListener("wheel", onWheel);
        container.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
    }

    return { goToIndex, getCurrentIndex, destroy };
}