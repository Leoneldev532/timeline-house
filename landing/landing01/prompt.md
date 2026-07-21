Tu es un Développeur Créatif Senior (Creative Dev). Ton rôle est de reconstruire "Landing 01", une fantastique expérience de navigation pour l'agence NWPROD en veillant à la sémantique SEO et l'accessibilité.

### Architecture et Design attendus :
1. **Sémantique et SEO** :
   - Structure correctement le document avec des balises HTML5 sémantiques (`<main>`, `<header>`, `<nav>`, `<section>`, `<footer>`).
   - Assure-toi que les liens (`<a>`) et les attributs aria essentiels pour l'accessibilité (`aria-label`) soient bien formés.
   - Utilise une hiérarchie de titres (`<h1>` pour le composant "hero", `<h2>`, `<h3>`) cohérente.

2. **Environnement de Couleur / Body Theme** :
   - La couleur dominante de fond est le rouge (`bg-red-600`) et le texte est contrasté noir/rouge.
   - Entier de la page a une balise curseur (`custom-cursor-content`) affichant le mot "SCROLL" suivant la souris.

3. **Interface Menu Fullscreen (Hamburger Menu)** :
   - En-tête (`<header>`) : Nav links "Contacts" et "Menu" (`<button>`) avec un effet de `overflow-hidden` hébergeant deux spans, permettant au hover de faire slider le texte (CSS track translate-y). Au centre se trouve un lien avec le logo colossal circulaire en SVG.
   - Menu (`<nav>`) : Un gigantesque panneau (`container-hamburger-menu`) qui inclut les projets : PRISM, ECHOES, NEXUS. 
   - Chaque projet du menu affiche un `id-container` (ex: 01), 2 layers d'images absolues au centre empilées (une rouge monochrome, une photo) et à droite le gros titre avec polices custom (`font-ivarDisplay`). 

4. **Homepage et Scroll (Les Overlays de films)** :
   - Premier écran de l'accueil (`<section class="hero">`) : Vidéo plein écran dans le wrapper (`.hero-bg bg-red-800`), titre immense en bas (`NWPROD text-[12vw] origin-bottom`) et compteur `0%`.
   - Pendant le scroll, les vidéos "Projets" se chevauchent de manière fixe (`.overlay overflow-hidden h-[100vh] sticky ou absolute`). 
   - Chaque projet présente un énorme titre (PRISM, ECHOES, NEXUS), une numérotation stylisée au scroll et un fond asymétrique en couleur noire / rouge.

5. **Footer** :
   - Balise `<footer>` de hauteur modérée `h-[75vh]` fond rouge avec des textes colossaux (CONTACTS, FOLLOW) utilisant le même effet de glissement de texte. Mentions légales à la toute fin.

### Stack technique
- **HTML/CSS** / TailwindCSS. Police custom "Ivar Display".
- **GSAP & ScrollTrigger** + **Lenis** pour gérer la longue chorégraphie d'épinglage (pin) de la scène "Hero" et l'empilement vertical des sections overlays pour donner un effet de "curtain pull" de haut en bas ou reverse.
- Le code JavaScript doit gérer l'ouverture du menu et les animations de curseur, tout en ciblant de préférence des balises bien nommées et indépendantes sémantiquement.
