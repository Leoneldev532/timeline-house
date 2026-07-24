window.addEventListener("DOMContentLoaded", function () {
  const overlay = document.querySelector(".hero__overlay");
  const fillLine = document.querySelector(".hero__fill-line");
  const progressContainer = document.querySelector(".hero__progress-container");
  const animatedText = document.querySelectorAll(".hero__animated-text");

  const overlayImageCenter = document.querySelector(".hero__overlay-image");

  const percentageOverlayText = document.querySelector(".hero__percentage");

  heroImageContainer = document.querySelector(".hero__content-image-container");
  heroImagewrapper = document.querySelector(".hero__content-image-container > .hero__image-wrapper");
  heroBigName = document.querySelector(".hero__big-name");

  const tl = gsap.timeline();
  let hasTriggered = false;

  const imageSrcArray = [
    "https://images.unsplash.com/photo-1593752043145-2dc1f922f734?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
    "https://images.unsplash.com/photo-1778974544108-46f89de675c9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fHw%3D",
    "https://images.unsplash.com/photo-1731779453675-060ff6b7586a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1630158687080-01cb438f0de9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8",
    "https://plus.unsplash.com/premium_photo-1677327623679-a3d951d52111?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1661940348479-0411d52eb04c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI3fHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1753361704219-f23e775b762c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQyfHx8ZW58MHx8fHx8",
  ];

  let currentImageIndex = 0;

  tl.to(fillLine, {
    x: "100%",
    duration: 4,
    ease: "expo.in",
    onUpdate: function () {
      const progress = this.progress();
      if (progress >= 0.7 && !hasTriggered) {
        hasTriggered = true;
        progressContainer.classList.add("transparent");
      }

      const index = Math.min(
        Math.floor(progress * imageSrcArray.length),
        imageSrcArray.length - 1,
      );

      if (index !== currentImageIndex) {
        currentImageIndex = index;
        overlayImageCenter.src = imageSrcArray[index];
      }

      percentageOverlayText.textContent = `${Math.floor(progress * 100)}%`;
    },
  });
  tl.to(
    animatedText,
    {
      y: "-100%",
      color: "red",
    },
    "-=0.3",
  )
    .to(
      overlayImageCenter,
      {
        opacity: 0,
      },
      "-=0.88",
    )
    .to(
      overlay,
      {
        opacity: 0,
        duration: 0.5,
        pointerEvents: "none",
        ease: "power4.in",
      },
      "-=0.5",
    );

  tl.from(
    [heroBigName, heroImageContainer],
    {
      y: 20,
      duration: 0.4,
      ease: "sine.out",
      transformOrigin: "bottom",
    },
    "-=0.2",
  ).to(
    heroImagewrapper,
    {
      scale: 0.98,
      duration: 0.4,
      ease: "sine.out",
    },
    "-=0.4",
  );
});
