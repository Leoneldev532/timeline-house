Tu es un intégrateur Web Expert. Ton but est de reproduire le projet "Hero 02".

### Architecture et Design attendus :
1. **Structure et Overlay** :
   - Fond de base de la page : Noir (`bg-black`).
   - Un conteneur absolu (`z-20`) utilise la propriété CSS `--webkit-mask-image` avec une forme de fleur inversée. Le masque s'agrandit grâce à GSAP pour révéler le site en dessous, dévoilant un fond blanc et en cachant le texte "Loading" de la page d'overlay. L'écran de fond de base inclut le texte "Loading 00%".

2. **Contenu Principal (Site Révélé)** :
   - Le fond passe au blanc avec du padding.
   - **En haut** : Un gros titre séparé en deux lignes (`LEONEL` / `NEXTSTEP`), très grand (`16vw`), avec des mots gérés avec `overflow-hidden`.
   - **Sur la droite** du titre : Une bio ("Photographer from FRANCE based in Paris"), "Last Update Feb 2025" et un bout de menu (Index, Work, Gallery, About).
   - **En bas** : Un paragraphe de copyright ("All pictures on this site are protected by copyright").

3. **Lancement d'Images Absolues** :
   - Des images positionnées en absolu en bas et à droite (`hero_image-wrapper-1` énorme à droite, et `hero_image-wrapper-2` plus petite sur la gauche).

### Stack technique
- **HTML5** : `<main>`, attributs `alt=""`.
- **CSS** : Utilisation intensive de `mask-image`, polices custom.
- **TailwindCSS** (CDN).
- **GSAP** : Animation du scale sur le masque de l'overlay, suivi d'une apparition étagée (`stagger`) pour le texte, la navigation et les images depuis le bas.
