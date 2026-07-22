
/**
 * createVerticalTextRotator
 * Rotation verticale de texte (style odometer), indépendante du carousel.
 * S'utilise pour un titre, un compteur de step, ou tout autre élément à faire défiler.
 *
 * Structure attendue : un conteneur avec deux enfants directs
 *   [data-current="true"], [data-previous="true"]
 *
 * @param {string|HTMLElement} root
 * @param {string[]} list - valeurs affichées, dans l'ordre des index du carousel
 * @param {{ duration?: number, delay?: number }} [opts]
 * @returns {{ update: (dir: number, nextIndex: number) => void, reset: () => void } | null}
 */
function createVerticalTextRotator(root, list, { duration = 0.8, delay = 0 } = {}) {
    const container = typeof root === "string" ? document.querySelector(root) : root;
    if (!container || !list?.length) return null;
 
    let current = container.querySelector('[data-current="true"]');
    let previous = container.querySelector('[data-previous="true"]');
    if (!current || !previous) return null;
 
    function reset() {
        current.innerText = list[0];
        previous.innerText = list[list.length - 1];
        gsap.set(previous, { y: "110%" });
    }
    
    reset();
 
    function update(dir, nextIndex) {
        const outgoing = current;
        const incoming = previous;
 
        gsap.to(outgoing, { y: dir === 1 ? "-110%" : "110%", duration, delay, ease: "power3.inOut" });
 
        gsap.set(incoming, { y: dir === 1 ? "110%" : "-110%" });
        incoming.textContent = list[nextIndex];
 
        gsap.to(incoming, {
            y: "0%",
            duration,
            delay,
            ease: "power3.inOut",
            onComplete: () => gsap.set(outgoing, { y: dir === 1 ? "110%" : "-110%" })
        });
 
        [current, previous] = [previous, current];
    }
 
    return { update, reset };
}