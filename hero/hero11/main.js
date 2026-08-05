window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, TextPlugin);

  const lenis = new Lenis({
    lerp: 0.1,
    smooth: true,
    wheelMultiplier: 1,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  const items = [
    {
      start: 1,
      end: 4,
      src: "https://images.unsplash.com/photo-1782252152335-ee9b9a69bde3?q=80&w=687&auto=format&fit=crop",
      client: "Nike",
      name: "RUN THE FUTURE",
      duration: "00:04",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312352/From_Klickpin.com-_831969731199293419-pin-id-831969731199293419_rfht8c.mp4",
    },
    {
      start: 10,
      end: 16,
      src: "https://i.pinimg.com/1200x/5c/fa/d6/5cfad66af87b5505a6cf41cbf534f190.jpg",
      client: "Apple",
      name: "VISION CAMPAIGN",
      duration: "00:06",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312363/From_Klickpin.com-_17662623534373268-pin-id-17662623534373268-carousel-8_cownpm.mp4",
    },
    {
      start: 7,
      end: 10,
      src: "https://i.pinimg.com/736x/7f/11/50/7f1150d53ca5adde28861178d75c00b5.jpg",
      client: "Adidas",
      name: "MOVE BEYOND",
      duration: "00:03",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312351/From_Klickpin.com-_1115133557754238844-pin-id-1115133557754238844_v2pt11.mp4",
    },
    {
      start: 1,
      end: 4,
      src: "https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?w=500&auto=format&fit=crop&q=60",
      client: "Spotify",
      name: "SOUND STORIES",
      duration: "00:05",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312352/From_Klickpin.com-_831969731199293419-pin-id-831969731199293419_rfht8c.mp4",
    },
    {
      start: 7,
      end: 10,
      src: "https://cdn.cosmos.so/20420886-807a-450d-834f-2e73a2af15f1?format=webp",
      client: "Porsche",
      name: "DRIVE EMOTION",
      duration: "00:04",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312363/From_Klickpin.com-_17662623534373268-pin-id-17662623534373268-carousel-8_cownpm.mp4",
    },
    {
      start: 10,
      end: 16,
      src: "https://images.unsplash.com/photo-1770348712485-01d1ef4f62bf?w=500&auto=format&fit=crop&q=60",
      client: "Netflix",
      name: "NEXT FRAME",
      duration: "00:07",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312351/From_Klickpin.com-_1115133557754238844-pin-id-1115133557754238844_v2pt11.mp4",
    },
    {
      start: 1,
      end: 4,
      src: "https://i.pinimg.com/736x/13/55/3b/13553b57b5f7a9f98a5a56bcec196676.jpg",
      client: "Tesla",
      name: "ELECTRIC MOTION",
      duration: "00:05",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312352/From_Klickpin.com-_831969731199293419-pin-id-831969731199293419_rfht8c.mp4",
    },
    {
      start: 10,
      end: 16,
      src: "https://images.unsplash.com/photo-1778470075441-8b2c7ce123b7?w=500&auto=format&fit=crop&q=60",
      client: "Airbnb",
      name: "LIVE ANYWHERE",
      duration: "00:04",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312363/From_Klickpin.com-_17662623534373268-pin-id-17662623534373268-carousel-8_cownpm.mp4",
    },
    {
      start: 7,
      end: 10,
      src: "https://i.pinimg.com/1200x/97/62/b4/9762b42f5307553f078b372efa4b59e1.jpg",
      client: "Moncler",
      name: "WINTER ICONS",
      duration: "00:06",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312351/From_Klickpin.com-_1115133557754238844-pin-id-1115133557754238844_v2pt11.mp4",
    },
    {
      start: 1,
      end: 4,
      src: "https://cdn.cosmos.so/ca7cc9af-0352-4634-a890-e27ed0bca74f?format=webp",
      client: "L'Oréal",
      name: "BEAUTY REDEFINED",
      duration: "00:05",
      video:
        "https://res.cloudinary.com/dx1axx1s2/video/upload/v1785312352/From_Klickpin.com-_831969731199293419-pin-id-831969731199293419_rfht8c.mp4",
    },
    {},
  ];
  const scrollContainer = document.querySelector(".scroll-container");
  const titleSlider = document.querySelector(".hero-title-wrapper");

  const projectClient = document.querySelector(".project-client");
  const projectName = document.querySelector(".project-name");
  const projectImageWrapper = document.querySelector(".project-image-wrapper");
  const projectDuration = document.querySelector(".project-duration");

  let projectImageItemHeight;

  const bgVideo = document.querySelector(".bg-video");
  const bgVideoSource = bgVideo.querySelector("source");

  let titleSliderFirstItem;
  let titleSlideHeight;
  let thumbnailSlideHeight;

  window.addEventListener("resize", () => {
    titleSlideHeight = titleSliderFirstItem.offsetHeight;
    thumbnailSlideHeight =
      projectImageWrapper.children[0]?.offsetHeight ?? thumbnailSlideHeight;
    ScrollTrigger.refresh();
  });

  const handleAnimationProjectInfo = (item, index) => {
    // Anime le slider d'images miniatures
    gsap.killTweensOf(projectImageWrapper);
    gsap.to(projectImageWrapper, {
      y: -thumbnailSlideHeight * index,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(projectClient, {
      duration: 0.4,
      scrambleText: {
        text: item.client,
        chars: "@!#%^&*()_+",
        speed: 0.8,
      },
      ease: "power2.out",
    });
    gsap.to(projectName, {
      duration: 0.4,
      ease: "power2.out",
      scrambleText: {
        text: item.name,
        chars: "▮",
        speed: 0.1,
      },
    });
    gsap.to(projectDuration, {
      duration: 0.4,
      ease: "power2.out",
      scrambleText: {
        text: item.duration,
        chars: "@!#%^&*()_+",
        speed: 0.2,
      },
    });
  };

  const render = (items) => {
    // Pré-rendre les images dans le wrapper
    items.forEach((item) => {
      titleSlider.innerHTML += `<div class="line text-4xl md:text-8xl flex  items-center justify-center gap-4 h-full w-full shrink-0">
        <span class=" capitalize  h-full tracking-tight">${item.name?.split(" ")[0]}</span>
        <span class=" capitalize font-saol h-full lowercase tracking-tight">${item.name?.split(" ")[1]}</span>
        ${item.name?.split(" ")[2] ? `<span class=" font-saol lowercase h-full tracking-tight">${item.name?.split(" ")[2]}</span>` : ""}
        </div>`;

      if (item.src) {
        const imgSlide = document.createElement("img");
        imgSlide.src = item.src;
        imgSlide.alt = item.name ?? "";
        imgSlide.classList.add(
          "w-full",
          "h-12",
          "object-cover",
          "shrink-0",
          "block",
        );
        projectImageWrapper.appendChild(imgSlide);
      }
    });

    titleSliderFirstItem = titleSlider.children[0];
    titleSlideHeight = titleSliderFirstItem.offsetHeight;
    thumbnailSlideHeight = projectImageWrapper.children[0]?.offsetHeight ?? 48;

    gsap.killTweensOf(titleSliderFirstItem);
    items.forEach((item, index) => {
      gsap.killTweensOf(item);

      const itemWrap = document.createElement("div");
      itemWrap.classList.add(
        "grid",
        "card",
        "w-full",
        "lg:my-20",
        "my-2",
        "grid-cols-12",
      );

      if (!item.src) {
        return;
      }

      const img = document.createElement("img");
      img.src = item.src;

      img.classList.add(
        "grid",
        "w-full",
        "lg:h-52",
        "md:h-60",
        "h-50",
        "grid-cols-16",
        "gap-x-grid",
        "rounded-lg",
        "object-cover",
        "col-start-1",
        "col-end-16",
        `lg:col-start-${item.start}`,
        `lg:col-end-${item.end}`,
      );

      itemWrap.appendChild(img);
      scrollContainer.appendChild(itemWrap);

      ScrollTrigger.create({
        trigger: img,
        start: "top 50%",
        end: "bottom 50.55%",
        fastScrollEnd: true,

        onToggle: ({ isActive }) => {
          if (!isActive) return;

          gsap.killTweensOf(titleSlider);

          if (bgVideoSource.src !== item.video) {
            bgVideoSource.src = item.video;
            bgVideo.load();
            bgVideo.play().catch(() => {});
          }

          gsap.to(titleSlider, {
            y: -titleSlideHeight * index,
            duration: 0.4,
            ease: "power3.out",
            overwrite: "auto",
          });
          handleAnimationProjectInfo(item, index);
        },
      });
    });
  };

  render(items);
});
