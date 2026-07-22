/**
 * createSlideCarousel
 * Cœur minimal : empilement clipPath + zIndex + navigation. Rien d'autre.
 * Les transitions clipPath et les animations de texte sont fournies de l'extérieur.
 *
 * @param {Object} options
 * @param {string|HTMLElement} options.root - conteneur (doit contenir des .hero__slide)
 * @param {{ open: string, collapsed: string }} options.transition - état visible / caché du clipPath
 * @param {number} [options.autoplayDelay=2500]
 * @param {number} [options.duration=0.8]
 * @param {number} [options.delay=0]
 * @param {boolean} [options.autoplay=true]
 * @param {(dir: number, nextIndex: number, prevIndex: number) => void} [options.onChange] - appelé à chaque navigation, avant l'animation du slide
 * @returns {{ next: Function, prev: Function, goToIndex: Function, start: Function, stop: Function, destroy: Function, getCurrentIndex: Function, setTransition: Function, setDelay: Function }}
 */
function createSlideCarousel({
    root,
    transition,
    autoplayDelay = 2500,
    duration = 0.8,
    delay = 0,
    autoplay = true,
    slidesElementList,
    prevBtnElement,
    nextBtnElement,
    onChange
}) {
    const container = typeof root === "string" ? document.querySelector(root) : root;
    if (!container) return null;

    const slides = slidesElementList ? slidesElementList : Array.from(container.querySelectorAll(".hero__slide"));
    const n = slides.length;
    if (n === 0 || !transition) return null;

    let activeTransition = transition;
    let order = [...slides];
    let currentIndex = 0;
    let isAnimating = false;
    let intervalId = null;
    let pendingTargetIndex = null;

    function applyZIndex() {
        order.forEach((slide, i) => gsap.set(slide, { zIndex: n - i }));
    }

    slides.forEach((slide) => gsap.set(slide, { clipPath: activeTransition.open }));
    applyZIndex();

    function goToIndex(targetIndex) {
        if (targetIndex < 0 || targetIndex >= n || targetIndex === currentIndex) return;

        if (isAnimating) {
            pendingTargetIndex = targetIndex;
            return;
        }

        isAnimating = true;

        const forwardSteps = (targetIndex - currentIndex + n) % n;
        const backwardSteps = (currentIndex - targetIndex + n) % n;
        const dir = forwardSteps <= backwardSteps ? 1 : -1;

        const prevIndex = currentIndex;
        const currentSlide = slides[currentIndex];
        const targetSlide = slides[targetIndex];

        currentIndex = targetIndex;
        onChange && onChange(dir, currentIndex, prevIndex);

        if (dir === 1) {
            const remaining = order.filter(s => s !== currentSlide && s !== targetSlide);
            order = [currentSlide, targetSlide, ...remaining];
            applyZIndex();

            gsap.killTweensOf(currentSlide);
            gsap.to(currentSlide, {
                clipPath: activeTransition.collapsed,
                duration, delay, ease: "power4.in",
                onComplete: () => {
                    gsap.set(currentSlide, { clipPath: activeTransition.open });
                    const rest = order.filter(s => s !== targetSlide);
                    order = [targetSlide, ...rest];
                    applyZIndex();
                    isAnimating = false;
                    if (pendingTargetIndex !== null) {
                        const nextTarget = pendingTargetIndex;
                        pendingTargetIndex = null;
                        goToIndex(nextTarget);
                    }
                }
            });
        } else {
            const remaining = order.filter(s => s !== currentSlide && s !== targetSlide);
            order = [targetSlide, currentSlide, ...remaining];
            applyZIndex();

            gsap.killTweensOf(targetSlide);
            gsap.set(targetSlide, { clipPath: activeTransition.collapsed });
            gsap.to(targetSlide, {
                clipPath: activeTransition.open,
                duration, delay, ease: "power4.out",
                onComplete: () => {
                    isAnimating = false;
                    if (pendingTargetIndex !== null) {
                        const nextTarget = pendingTargetIndex;
                        pendingTargetIndex = null;
                        goToIndex(nextTarget);
                    }
                }
            });
        }
    }

    function goTo(dir = 1) {
        const nextIndex = (currentIndex + dir + n) % n;
        goToIndex(nextIndex);
    }

    function setTransition(value) { activeTransition = value; }
    function setDelay(value) { delay = value; }

    function next() { goTo(1); if (autoplay) restart(); }
    function prev() { goTo(-1); if (autoplay) restart(); }

    function start() { stop(); intervalId = setInterval(() => next(), autoplayDelay); }
    function stop() { clearInterval(intervalId); intervalId = null; }
    function restart() { stop(); start(); }

    function getCurrentIndex() { return currentIndex; }

    const prevBtn = prevBtnElement ? prevBtnElement : container.querySelector(".hero__btn--prev");
    const nextBtn = nextBtnElement ? nextBtnElement : container.querySelector(".hero__btn--next");
    const onPrevClick = () => prev();
    const onNextClick = () => next();
    prevBtn?.addEventListener("click", onPrevClick);
    nextBtn?.addEventListener("click", onNextClick);

    function destroy() {
        stop();
        prevBtn?.removeEventListener("click", onPrevClick);
        nextBtn?.removeEventListener("click", onNextClick);
    }

    if (autoplay) start();

    return { next, prev, goToIndex, start, stop, destroy, getCurrentIndex, setTransition, setDelay };
}