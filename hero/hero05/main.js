window.addEventListener("DOMContentLoaded", function () {
  const tl = gsap.timeline({});

  const heroContainerMax = document.querySelector(".hero_container-max");
  const loadingPercentage = document.querySelector(".hero_loading-pourcentage");

  const counter = { value: 0 };
  const timePastRotate = { firstTime: false, secondTime: false };

  gsap.set(".hero-title-part-1-txt", { x: "0%", rotate: 0 });
  gsap.set(".hero-title-part-2-txt", { x: "0%", rotate: 0 });

  gsap.set(".hero_image-wrapper-1", {
    clipPath: " polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  });
  gsap.set(".hero_image-wrapper-2", {
    clipPath: " polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  });

  gsap.set(".text-anim-hero", { y: "0%" });
  gsap.set(".hero_nav-list", { autoAlpha: 1 });

  tl.from(
    ".hero_container-max",
    {
      maskSize: "0% 0%",
      delay: 0.4,
      webkitMaskSize: "0% 0%",
    },
    "<",
  )
    .to(
      ".hero_loading-text",
      {
        x: -20,
      },
      "<",
    )
    .to(
      ".hero_loading-pourcentage-container",
      {
        x: 20,
      },
      "<",
    )
    .to(counter, {
      value: 100,
      duration: 3,
      ease: "power1.out",
      onUpdate() {
        loadingPercentage.textContent = Math.floor(counter.value) + "%";

        if (counter.value >= 50 && !timePastRotate.firstTime) {
          timePastRotate.firstTime = true;
          gsap.to(heroContainerMax, {
            rotate: 180,
            duration: 0.5,
            ease: "sine",
          });
        }
        if (counter.value >= 80 && !timePastRotate.secondTime) {
          timePastRotate.secondTime = true;
          gsap.to(heroContainerMax, {
            rotate: 360,
            duration: 0.5,
            ease: "sine",
          });
        }
      },
    })
    .to(".hero_container-max", {
      maskSize: "400% 400%",
      webkitMaskSize: "100% 100%",
      duration: 0.8,
      ease: "sine.in",
    })
    .from(
      [".hero-title-part-1-txt", ".hero-title-part-2-txt"],
      {
        y: "150%",
        x: "10%",
        rotate: 6,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.2",
    )
    .from(
      ".hero_image-wrapper-1",
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      },
      "-=0.2",
    )
    .from(
      ".hero_image-1",
      {
        scale: 1.5,
      },
      "<",
    )
    .from(
      ".hero_image-wrapper-2",
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      },
      "-=0.4",
    )

    .from(
      ".text-anim-hero",
      {
        y: "150%",
        rotate: 4,
        duration: 0.4,
        stagger: 0.2,
      },
      "-=0.4",
    )
    .from([".hero-txt-animated-opacity", ".hero_nav-list"], {
      autoAlpha: 0,
      duration: 0.7,
      ease: "sine",
    });
});
