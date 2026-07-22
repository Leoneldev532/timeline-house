const sessionStartTime = Date.now();

function updateClock() {
    const options = { timeZone: "America/Los_Angeles", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
    const timeStr = new Date().toLocaleTimeString("en-US", options);
    document.querySelectorAll(".site-header__time-pst").forEach(el => el.textContent = timeStr + " PST");

    const elapsedSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
    const hrs = String(Math.floor(elapsedSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(elapsedSeconds % 60).padStart(2, "0");
    document.querySelectorAll(".site-header__timer").forEach(el => el.textContent = `${hrs}:${mins}:${secs}`);
}
updateClock();
setInterval(updateClock, 1000);

window.addEventListener("DOMContentLoaded", () => {

    gsap.registerPlugin(SplitText, Flip, ScrollTrigger);

    const lenis = new Lenis({ duration: 1.2, wheelMultiplier: 0.6, smoothWheel: true });
    lenis.scrollTo(0, { immediate: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // --- Carousel Setup ---
    const carouselTitles = ["PRIME", "PULSE", "FLUX", "APEX"];
    const carouselSteps = carouselTitles.map((_, i) => String(i + 1));

    const titleRotator = createVerticalTextRotator(".hero__title", carouselTitles);
    const stepRotator = createVerticalTextRotator(".hero__step-current", carouselSteps);

    const stepTotalElement = document.querySelector(".hero__step-total");
    if (stepTotalElement) {
        stepTotalElement.textContent = `-${carouselTitles.length}`;
    }

    const heroCarousel = createSlideCarousel({
        root: ".hero",
        autoplayDelay: 15000,
        transition: CLIP_PATH_TRANSITIONS.verticalWipe,
        onChange: (direction, nextIndex) => {
            titleRotator?.update(direction, nextIndex);
            stepRotator?.update(direction, nextIndex);
            scrollRuler?.goToIndex(nextIndex);
        }
    });

    const scrollRuler = createScrollRuler({
        root: ".hero__ruler",
        count: carouselTitles.length,
        autoplay: true,
        autoplaySpeed: 0.4,
        autoplayResumeDelay: 1500,
        onChange: (index) => heroCarousel.goToIndex(index)
    });

    // --- Hamburger Menu ---
    const menuLinks = gsap.utils.toArray(".hamburger__menu-link");
    const menuContainer = document.querySelector(".hamburger__menu");
    const menuToggleBtn = document.querySelector(".hamburger__menu-toggle");
    
    let isMenuOpen = false;

    gsap.set(menuContainer, { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", zIndex: 0 });
    gsap.set(menuLinks, { y: 100, stagger: 0.05 });

    const menuTimeline = gsap.timeline();

    menuToggleBtn.addEventListener("click", () => {
        if (!isMenuOpen) {
            menuTimeline.to(menuContainer, { zIndex: 20, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1, ease: "expo.inOut" })
                .to(menuLinks, { y: 0, delay: 0.5, stagger: 0.04 }, "<");
            isMenuOpen = true;
            menuToggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`;
        } else {
            menuTimeline.to(menuLinks, { y: 50, stagger: 0.04, opacity: 0.4 }, ">")
                .to(menuContainer, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", duration: 0.6,
                    onComplete: () => {
                        gsap.set(menuContainer, { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", zIndex: 0 });
                        gsap.set(menuLinks, { opacity: 1 });
                        isMenuOpen = false;
                        menuToggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" /></svg>`;
                    }
                }, "-=0.5");
        }
    });

    // --- Overlay Intro Animations ---
    const progressValueElement = document.querySelector(".hero__overlay-progress-value");
    const overlayTimeline = gsap.timeline();

    gsap.set(".hero__overlay-panel--top", { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
    gsap.set(".hero__overlay-panel--bottom", { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });
    gsap.set(".hero__overlay-text", { y: 70 });
    gsap.set(".hero__overlay-progress-bar", { scaleX: 0, opacity: 1 });
    gsap.set(progressValueElement, { autoAlpha: 1 });

    overlayTimeline.to(".hero__overlay-progress-bar", {
        scaleX: 1,
        duration: 1,
        delay: 0.6,
        ease: "linear",
        onUpdate: function() {
            const progress = this.progress();
            const percentage = Math.round(progress * 100);
            if (progressValueElement) {
                progressValueElement.textContent = `${percentage}%`;
            }
        }
    })
    .to(".hero__overlay-text", { y: 0, duration: 0.8, stagger: 0.05, ease: "sine" }, "-=0.1")
    .to(progressValueElement, { autoAlpha: 0 }, "<")
    .set(".hero__overlay-progress-bar", { opacity: 0, duration: 0.5, ease: "linear" }, ">")
    .to(".hero__overlay-panel--top", { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", duration: 1, ease: "expo.inOut" }, "<")
    .to(".hero__overlay-panel--bottom", { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", duration: 1, ease: "expo.inOut" }, "<")
    .to(".hero__overlay", { zIndex: -1 }, ">");


    const xTo = gsap.quickTo(".custom-cursor", "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(".custom-cursor", "y", { duration: 0.4, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
        xTo(e.clientX - 40);
        yTo(e.clientY - 50);
    });

    // Direct navigation (e.g. pagination):
    // heroCarousel.goToIndex(2);

    // Swap transition preset at runtime:
    // heroCarousel.setTransition(CLIP_PATH_TRANSITIONS.circleReveal);

});