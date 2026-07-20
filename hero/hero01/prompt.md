Tu es un Expert Intégrateur Creative Developer. Ton but est de reproduire le Hero "Project Staircase" (Hero 07).

### Architecture et Design attendus :
1. **Composition de la page** :
   - Vidéo de fond en sourdine en boucle de classe `hero__carousel-images` en z-0.
   - Interface de texte flottante droite (`hero__container_info text-white z-20`) pour présenter "Nwprod Luxe", listes de liens "Featured, Archive...", et en bas à droite le titre "Most wanted" par "Christian Larson".
   - Affichage des images de background au défilement ou sur clic (`img` opacity-0 transition, `video` transition opacity).

2. **Bandeau de progression des projets ("Project Staircase")** :
   - Escaliers de sélection (`div` #wrap Absolute z-99) ou `.progress__bar_container` affichant verticalement et consécutivement les nombres romains VIII, VII, VI...
   - Chaque bloc "projet" possède une barre verticale `scale-y-0` (ligne d'avancement blanche, origine `top`) qui s'allonge pour souligner la progression.

### Stack technique
- **Lenis**
- **GSAP & ScrollTrigger**
- Utilisation de la timeline pour gérer le scale-y (`scale-y-100` progressif) lors du scroll vers le bas afin d'animer chaque élément de l'escalier l'un après l'autre.
- Gestion pointilleuse du `z-index` décrite : la vidéo est au fond (`z-0`), les textes UI en avant (`z-20`), et la staircase passe au-dessus ou en interaction avec un effet d'empilement complexe.
