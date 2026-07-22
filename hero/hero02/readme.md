# Slide Carousel

Carousel modulaire basé sur `clip-path` et `z-index`, animé avec GSAP. Le cœur ne gère que l'empilement des slides. Les transitions clipPath et les animations de texte sont des modules externes, indépendants, branchés via un simple hook.

## Fichiers

| Fichier | Rôle |
|---|---|
| `carousel.js` | Cœur du carousel. Expose `createSlideCarousel()`. Gère la pile de slides, le zIndex, le clipPath, l'index courant, l'autoplay. Ne connaît ni transitions ni texte. |
| `transitions.js` | Registre `CLIP_PATH_TRANSITIONS` — presets de transitions clipPath, indépendants du carousel. |
| `text-rotator.js` | `createVerticalTextRotator()` — rotation verticale de texte (titre, compteur de step, etc.), indépendante du carousel. |
| `main.js` | Point d'entrée : initialise Lenis/GSAP, instancie transitions + rotators + carousel, les branche ensemble. |

## Dépendances

- [GSAP](https://gsap.com/) (core) — requis par les trois modules (`carousel.js`, `text-rotator.js`)
- [Lenis](https://lenis.darkroom.engineering/) — smooth scroll, utilisé dans `main.js` uniquement, pas requis par les modules eux-mêmes

## Ordre de chargement des scripts

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="./transitions.js"></script>
<script src="./text-rotator.js"></script>
<script src="./carousel.js"></script>
<script src="./main.js"></script>
```

`transitions.js` et `text-rotator.js` n'ont pas de dépendance entre eux, mais doivent précéder `carousel.js` et `main.js` s'ils sont utilisés dedans.

## Architecture

Le carousel ne fait qu'une chose : faire tourner une pile de slides (clipPath + zIndex) et notifier l'extérieur à chaque navigation via `onChange(dir, nextIndex, prevIndex)`. Il ne sait pas ce qui doit s'animer à côté (titre, step, autre chose) : c'est à l'appelant de brancher ce qu'il veut sur ce hook.

```
transitions.js  ──┐
                   ├─► carousel.js ◄── onChange(dir, nextIndex) ──┐
text-rotator.js ───┘                                              │
                                                                    ▼
                                                              main.js (colle tout)
```

## Structure HTML attendue

```html
<div class="hero">

    <!-- un .hero__slide par élément du carousel -->
    <div class="hero__slide">...</div>
    <div class="hero__slide">...</div>
    <div class="hero__slide">...</div>

    <!-- titre animé (géré par text-rotator.js, optionnel) -->
    <div class="hero__title">
        <span data-current="true">...</span>
        <span data-previous="true">...</span>
    </div>

    <!-- compteur de step animé (géré par text-rotator.js, optionnel) -->
    <div class="hero__step-current">
        <span data-current="true">1</span>
        <span data-previous="true">3</span>
    </div>
    <span class="hero__step-total"></span> <!-- rempli manuellement dans main.js : "-N" -->

    <!-- boutons de navigation (optionnels, gérés par carousel.js) -->
    <button class="hero__btn--prev">Précédent</button>
    <button class="hero__btn--next">Suivant</button>

</div>
```

Seul `.hero__slide` est requis par `carousel.js`. Titre, step et boutons sont indépendants et optionnels.

## carousel.js

### Options

| Option | Type | Défaut | Description |
|---|---|---|---|
| `root` | `string \| HTMLElement` | — (requis) | Sélecteur ou élément conteneur |
| `transition` | `{ open: string, collapsed: string }` | — (requis) | État clipPath visible / caché. Vient de `transitions.js` ou d'un objet custom |
| `autoplayDelay` | `number` | `2500` | Délai en ms entre deux slides en autoplay |
| `duration` | `number` | `0.8` | Durée de chaque tween, en secondes |
| `delay` | `number` | `0` | Délai avant le démarrage de chaque tween, en secondes |
| `autoplay` | `boolean` | `true` | Démarre l'autoplay automatiquement |
| `onChange` | `(dir, nextIndex, prevIndex) => void` | — | Appelé juste avant l'animation du slide, à chaque navigation |

### API retournée

```javascript
const carousel = createSlideCarousel({ root: ".hero", transition: CLIP_PATH_TRANSITIONS.verticalWipe });

carousel.next();                                          // slide suivant
carousel.prev();                                          // slide précédent
carousel.goToIndex(2);                                    // saute à l'index 2, chemin le plus court
carousel.start();                                          // (re)démarre l'autoplay
carousel.stop();                                           // arrête l'autoplay
carousel.setTransition(CLIP_PATH_TRANSITIONS.circleReveal); // change de transition à chaud
carousel.setDelay(0.2);                                    // change le delay à chaud
carousel.getCurrentIndex();                                // index courant (0-based)
carousel.destroy();                                        // retire les listeners prev/next
```

### `onChange`, le seul point d'extension

`carousel.js` n'anime ni titre ni step. Tout ce qu'il fait, c'est appeler `onChange(dir, nextIndex, prevIndex)` avant de lancer sa propre animation de slide. Libre à l'appelant de brancher ce qu'il veut dessus :

```javascript
const titleRotator = createVerticalTextRotator(".hero__title", titles);
const stepRotator = createVerticalTextRotator(".hero__step-current", steps);

createSlideCarousel({
    root: ".hero",
    transition: CLIP_PATH_TRANSITIONS.verticalWipe,
    onChange: (dir, nextIndex) => {
        titleRotator?.update(dir, nextIndex);
        stepRotator?.update(dir, nextIndex);
        // ou n'importe quoi d'autre : changer une couleur, un son, du texte custom...
    }
});
```

### `goToIndex(targetIndex)`

Calcule le chemin le plus court (avant ou arrière) et enchaîne les transitions nécessaires. Coupe l'autoplay pendant le saut, le relance ensuite si `autoplay: true`.

## transitions.js

Registre de presets `{ open, collapsed }`, indépendant du carousel :

| Nom | Effet |
|---|---|
| `verticalWipe` | Se referme/ouvre depuis le haut |
| `verticalWipeBottom` | Se referme/ouvre depuis le bas |
| `horizontalWipeLeft` | Se referme/ouvre depuis la gauche |
| `horizontalWipeRight` | Se referme/ouvre depuis la droite |
| `diagonal` | Se referme/ouvre vers un point (coin haut-gauche) |
| `circleReveal` | Effet iris (cercle qui grandit/rétrécit) |

### Transition custom

Le carousel accepte n'importe quel objet `{ open, collapsed }`, du registre ou fait main :

```javascript
createSlideCarousel({
    root: ".other-carousel",
    transition: {
        open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        collapsed: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)" // collapse vers le centre
    }
});
```

**Contrainte :** `open` et `collapsed` doivent utiliser la même fonction clip-path (`polygon()` partout, ou `circle()` partout) et, pour `polygon()`, le même nombre de points. Mélanger les types casse l'interpolation de GSAP.

## text-rotator.js

`createVerticalTextRotator(root, list, opts)` fait tourner verticalement le contenu d'un conteneur à deux enfants (`[data-current]` / `[data-previous]`), indépendamment de tout carousel.

```javascript
const rotator = createVerticalTextRotator(".hero__title", ["Papa Johns", "Starbucks", "Hacks"], {
    duration: 0.8,
    delay: 0
});

rotator.update(1, 1);  // dir = 1 (avance), affiche list[1]
rotator.reset();       // remet l'état initial (list[0] visible)
```

Réutilisable pour n'importe quel texte défilant, avec ou sans carousel à côté (prix qui s'incrémente, liste de mots-clés, etc.).

## Plusieurs carousels sur une même page

Chaque instance est indépendante. Il suffit de changer `root` et, si besoin, ses propres rotators :

```javascript
const heroCarousel = createSlideCarousel({
    root: ".hero",
    transition: CLIP_PATH_TRANSITIONS.verticalWipe,
    onChange: (dir, i) => titleRotator?.update(dir, i)
});

const projectsCarousel = createSlideCarousel({
    root: ".projects-carousel",
    transition: CLIP_PATH_TRANSITIONS.horizontalWipeRight,
    autoplayDelay: 4000
    // pas d'onChange : ce carousel n'anime aucun texte à côté
});
```

## Pourquoi GSAP plutôt que CSS/WAAPI

`clip-path` est nativement animable en CSS. GSAP n'est pas strictement obligatoire, mais apporte :

- **Easings avancés** (`power4.in`, `power4.out`, `power3.inOut`)
- **Callbacks fiables** (`onComplete`) pour enchaîner zIndex et clipPath dans le bon ordre
- **`gsap.killTweensOf()`** pour annuler un tween en cours si l'utilisateur clique plusieurs fois rapidement

## Notes d'implémentation

- **Empilement (`order`)** : seule source de vérité pour le zIndex. `order[0]` est toujours le slide visible au-dessus. `applyZIndex()` régénère les valeurs (`n`, `n-1`, ..., `1`) à partir de la position réelle dans le tableau, jamais par calcul modulo sur des zIndex CSS.
- **`next` (dir = 1)** : le slide du dessus se referme (révèle celui en dessous), puis passe en fin de pile.
- **`prev` (dir = -1)** : le slide du fond passe en tête de pile *avant* l'animation, puis s'ouvre en recouvrant l'ancien top.
- **File d'attente (`pendingQueue`)** : si un `goTo()` arrive pendant qu'une animation est en cours, il est mis en file et exécuté dès que l'animation en cours se termine.