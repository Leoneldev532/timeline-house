window.addEventListener("DOMContentLoaded", function () {

    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);


    const imgCinematicEffet = gsap.utils.toArray(".hero__cinematic-image")
    const header = document.querySelector(".hero__header")
    const scrollImageSequenceStep = document.querySelectorAll(".hero-sequence__step")
    document.documentElement.classList.add("is-scrollbar-hidden");


    const textHeroAnimatedAtScroll = gsap.utils.toArray(".hero__animated-text")
    const infiniteTextHeroAnimated = gsap.utils.toArray(".hero__animated-text-item")


    let introPlayed = false;
    let tl,rl

    const animatedTextHero = () => {
        if (rl) rl.kill();
          const step = infiniteTextHeroAnimated[0].offsetHeight;

          rl = gsap.timeline({
            repeat: -1
        });

        infiniteTextHeroAnimated.forEach((_, index) => {
            if (index === 0) return;

            rl.to(".hero__animated-text-wrapper", {
                y: -step * index,
                duration: 0.5,
                    invalidateOnRefresh: true,

                ease: "power2.inOut"
            });
            rl.to({}, {
                duration: 1
            });
        });
    }

    const animate = () => {

          if (tl) tl.kill();
          if (rl) rl.kill();

        if (introPlayed) return;
        introPlayed = true;

          tl = gsap.timeline({ delay: 0.4 });
        lenis.stop();

        imgCinematicEffet.forEach(element => {
            tl.fromTo(element,
                { y: "-20%" },
                {
                    y: "-40%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 90%",
                        end: "bottom 60%",
                        scrub: 0.5,
                    }
                }
            );
        });

        gsap.fromTo(textHeroAnimatedAtScroll,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                delay: 0.2,
                stagger: 0.2,
                ease: "power3.out",
                onComplete: () => {
                    scrollImageSequenceStep.forEach(item => item.classList.add("is-hidden"));
                    gsap.delayedCall(0.2, () => {
                        document.documentElement.classList.remove("is-scrollbar-hidden");
                    });
                    ScrollTrigger.getAll().forEach(st => st.kill());
                },
                scrollTrigger: {
                    trigger: ".hero__container",
                    start: "top 30%",
                    end: "+=100",

                }
            }
        );

        tl.add(() => {
            lenis.start();
            requestAnimationFrame(() => {
                lenis.scrollTo("#hero-container", {
                    offset: -10,
                    duration: 3,
                    lock: true,
                    easing: (t) => {
                        const base = Math.pow(t, 0.55) + 0.05 * Math.sin(2 * Math.PI * t);
                        const capture = 0.01 * Math.pow(t, 6) * (1 - t);
                        return base + capture;
                    },
                    onComplete: () => {
                        header.classList.remove("is-hidden");
                        header.classList.add("is-flexible");
                    }
                });
            });
        });
        
        animatedTextHero()
     
    };



    animate();
    ScrollTrigger.refresh();

    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            lenis.resize();

            rl.kill();
            animatedTextHero()
            ScrollTrigger.refresh();
       
        }, 200);
    });


})
