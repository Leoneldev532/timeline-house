# Prompt - Carousel 02 (Creative Production Studio)

## Description Globale
Ce composant est un carrousel plein écran (fullscreen) au design premium, conçu pour un studio de production créatif (ex: "Cam Studios"). Il combine une navigation fluide, un défilement infini de miniatures et des transitions vidéo/texte sophistiquées. L'interface est divisée en plusieurs zones distinctes (titre, description du projet, vidéo, et barre de miniatures) avec un fond sombre (dark mode) et des effets de flou (backdrop-blur).

## Structure Visuelle et Fonctionnalités

### 1. Header (En-tête)
- Barre de navigation fixe (fixed) avec un effet `backdrop-blur`.
- Sur desktop : Liens de navigation à gauche (Home, Work, Contact).
- Sur mobile : Logo texte ("Cam Studios") et un bouton hamburger pour le menu.

### 2. Layout Principal (Hero Section)
- **Panneau de gauche (Desktop uniquement) :** Contient le grand titre de la marque ("Cam Studios") utilisant une typographie personnalisée (`carlos-font`) et un sous-titre de présentation du studio.
- **Panneau central (Description du projet) :**
  - Affiche le titre du projet en cours, un paragraphe descriptif et les crédits (Director, DOP, Editor, Producer).
  - Ce texte est animé à chaque changement de projet à l'aide de **GSAP SplitText** : l'ancien texte glisse vers le haut en se masquant, et le nouveau texte apparaît ligne par ligne avec un effet d'apparition fluide par le bas.
- **Panneau central (Lecteur Vidéo) :**
  - Contient un lecteur vidéo avec un bouton de lecture/pause personnalisé.
  - **Bouton magnétique :** Le bouton play/pause (avec icônes SVG) suit la souris de manière fluide et magnétique (grâce à GSAP) dans les limites du conteneur vidéo lorsqu'on le survole.
  - **Transitions Vidéo :** Lors du clic sur une miniature, une animation GSAP orchestre le changement de vidéo. La nouvelle vidéo arrive avec un effet de translation (yPercent) et un effet de scale (de 0.4 à 1), pendant que l'ancienne vidéo se rétracte et sort du cadre.

### 3. Barre de Miniatures (Infinite Scroll Thumbnail)
- Située sur la droite (verticale sur desktop) ou en bas (horizontale sur mobile).
- Contient les images (posters) représentant chaque projet.
- **Effet de luminosité :** Les images des miniatures ont une luminosité de base réduite (`filter: brightness(0.5)`). Au survol, elles s'illuminent doucement (`brightness(1)`) via une transition CSS de `0.4s`.
- **Défilement Infini :** Géré en JavaScript natif et GSAP. L'événement `wheel` est capturé pour déplacer le conteneur des miniatures avec une inertie mathématique (friction et vélocité). Lorsque les éléments sortent du cadre, ils bouclent de manière infinie (wrap). Les éléments du DOM sont clonés au chargement pour assurer l'illusion d'une boucle continue.

## Technologies Utilisées
- **HTML5 & CSS3** (Vanilla CSS pour les polices et quelques animations spécifiques).
- **Tailwind CSS** : Utilisé de manière intensive via CDN pour la mise en page (flexbox, dimensions, positionnement) et le design responsive (breakpoints lg, xl).
- **GSAP (GreenSock)** : Moteur d'animation principal.
  - `gsap.to() / gsap.set()` : Pour les transitions d'état.
  - **GSAP SplitText** : Pour l'animation d'entrée/sortie des textes descriptifs des projets.
  - **GSAP ScrollTrigger & MatchMedia** : Pour gérer la responsivité des animations JS (ex: défilement horizontal sur mobile vs vertical sur desktop).
- **Lenis** : Implémenté pour assurer un smooth scroll global sur la page (bien que l'expérience principale soit un carrousel fixe 100vh).
- **JavaScript (Vanilla)** : Logique de la permutation des vidéos (`permutation.js`), logique mathématique du scroll infini (`main.js`), et gestion de la souris pour le bouton play magnétique.

## Points Clés de l'Intégration
- L'utilisation de vidéos optimisées (Cloudinary) en mode `muted loop playsinline` par défaut.
- Typographies personnalisées (ex: `NeueHaasGroteskDisplay` et `CalosFont`).
- Code séparé proprement :
  - `index.html` : Structure et CDN.
  - `style.css` : Définition des fonts, réglages globaux de scroll et effets CSS (hover brightness).
  - `permutation.js` : Logique de transition entre les projets (animation du texte et des vidéos).
  - `main.js` : Données du carrousel et logique du défilement infini des miniatures avec inertie.
