/**
 * Presets de transitions clipPath, indépendants du carousel.
 * Chaque entrée : { open, collapsed }. Passé tel quel à createSlideCarousel({ transition }).
 */
const CLIP_PATH_TRANSITIONS = {
    verticalWipe: {
        open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        collapsed: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
    },
    verticalWipeBottom: {
        open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        collapsed: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
    },
    horizontalWipeLeft: {
        open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        collapsed: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
    },
    horizontalWipeRight: {
        open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        collapsed: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
    },
    diagonal: {
        open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        collapsed: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)"
    },
    circleReveal: {
        open: "circle(75% at 50% 50%)",
        collapsed: "circle(0% at 50% 50%)"
    }
};