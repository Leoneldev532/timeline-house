Tu es un Expert TailwindCSS et Animations GSAP. Ton but est de reproduire le projet multimédia "Hero 06" (NWPROD).

### Architecture et Design attendus :
1. **Éléments globaux et Interface UI** :
   - Un header absolu mix-blend-difference contenant : un titre NWPROD, une heure locale (PST) et un bouton menu hamburger.
   - Un curseur personnalisé (`custom-cursor`) géré en absolut pointer-events-none (composé de coins de cadres photo).
   - Un menu hamburger fullscreen (`#hamburger-menu`) caché sur un z-index inférieur mais révélé par défilement/clic avec `z-index`, fond `bg-green-700` (`#hamburger-menu`), et une navigation verticale listant (01 Home, 02 Projects... avec masque hover utilisant GSAP/CSS bounds).

2. **Le Slider/Carousel (Contenu central)** :
   - La scène héberge plusieurs vidéos plecran empilées en absolu (`.hero__slide`). 
   - Sous les vidéos, une navigation `.hero__nav` (z-index élevé) avec les infos de progression du slider :
     - Compteur de slide / Titres croisés (`.hero__title` masque un texte pour en révéler un autre).
     - La zone `.hero__ruler` qui centralise une piste scrollable horizontale contenant plein de graduations (`ruler__tick` blanc transparent/masqué), avec un fade-mask CSS. Géré au swipe pour diriger le carrousel.
     - Boutons Previous/Next (`hero__btn`) avec flèches SVG.

3. **Overlays HUD de caméscope** :
   - `hero__overlay-panel--top` et `--bottom` avec `mix-blend-mode` ou fond noir, décrivant en texte "NWPROD / Maîtrise de l'audiovisuel" et "02:09 / FPS:60" comme une interface de caméra cinéma.
   - `.hero__overlay-progress-bar-container` : Barre de progression horizontale centrale sur la scène vidéo.

### Stack technique
- **TailwindCSS** (CDN).
- **GSAP & Draggable** : Animation du menu hamburger (hauteurs et split text), masque hover du menu, synchronisation de l'avancée du `.hero__ruler` pour manipuler le défilement horizontal et faire un fondu croisé des vidéos.
