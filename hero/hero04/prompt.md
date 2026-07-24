Tu es un intégrateur Web Expert (GSAP, TailwindCSS). Ton but est de reproduire à l'identique une landing page de portfolio nommée "Hero 01".

### Architecture et Design attendus :
1. **Structure Générale** : 
   - Utilise une structure sémantique `<main>` avec une classe `main h-full w-full relative overflow-hidden`.
   - Inclure une `<div class="hero">` qui occupe 100vh.

2. **Écran de progression (Overlay)** :
   - Un calque absolu (`z-10`) recouvrant l'écran avec un fond sombre.
   - Contient une barre de progression en haut avec le fond `bg-neutral-700` et un curseur `bg-gray-200` qui s'anime (`translate-x-[-100%]`).
   - Au centre, une image de portrait (`w-[240px] h-[280px]`).
   - En bas, 3 textes animés (Leonel, un pourcentage, Yimga) répartis (gauche, centre, droite).

3. **Contenu Principal (sous l'overlay)** :
   - Fond `bg-gray-200`, flexbox contenant l'interface réelle.
   - Un `header` divisé en grille ou flex contenant : le nom (Léonel Yimga : Freelance), la localisation (Yaoundé), la liste de navigation (Index, Work, Archive, Contact) et le Toggle de Thème.
   - Au centre de la page : Une image wrapper de taille identique à l'overlay (`w-[240px] h-[280px]`) contenant le même portrait.
   - En bas, un très grand titre (`Léonel NexStep`) prenant toute la largeur (`text-[14.60vw]`).

### Stack technique
- **HTML5** : Sémantique, attributs SEO/Accessibilité.
- **TailwindCSS** v4 (CDN).
- **GSAP** : Pour animer la barre de progression, faire disparaître l'overlay, révéler l'image centrale et le grand texte `Léonel NexStep`.
- **Typographie** : Polices custom (`Bulevar` ou `me`) pour les titres et `NeueMontreal` (`mo`) pour les paragraphes.
