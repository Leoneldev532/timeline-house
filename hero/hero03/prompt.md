Tu es un Intégrateur Web Senior. Reproduis le composant hero "Lycreative Capturing Wonders" (Hero 03).

### Architecture et Design attendus :
1. **Défilement d'Images Cinematic** :
   - Grid de nombreuses images occupant une très large partie de l'écran, empilées les unes sous les autres.
   - Dimension des images : `w-full` et `h-[50vh]` ou `20vh` avec un effet de bord arrondi (`rounded-xl`). Il s'agit des "hero__cinematic-image". Elles recouvrent le background.

2. **Conteneur Vidéo Fixe & Titre (Hero)** :
   - En fin de scroll, on découvre un grand header de 100vh (`div class="hero__container relative h-screen w-full pb-6"`).
   - Ce conteneur a une barre de menu fixe (`fixed top-0 is-hidden`) qui apparaît après lors du défilement, contenant le logo "Lycreative" et un bouton "Menu".
   - Le background héberge une vidéo full-screen, de classe `h-full object-cover`.
   - Le texte inférieur superposé décrit : "Capturing wonders worldwide to shape vibrant brand stories." (gauche).
   - Un énorme texte à droite affiche "WE ARE MEANT TO" en orange `text-orange-700 font-extrabold`. Un slider vertical de mots s'anime de bas en haut (wow, amuse, dream, charm, explore, thrill) pour finir la phrase.

### Stack technique
- **Lenis** : Smooth scroll obligatoire.
- **TailwindCSS** (CDN).
- **GSAP & ScrollTrigger** : Pour l'animation d'apparition du top menu lors du scroll / changement de pin sur la vidéo finale. L'animation des mots verticaux (wow, amuse...) doit utiliser les `yPercent` de GSAP et reboucler de façon fluide.
