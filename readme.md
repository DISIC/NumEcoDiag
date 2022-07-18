# Checklist RGESN 

 Aide à l'évaluation de la conformité d’un service numérique selon le [Référentiel Général d'Écoconception de Services Numériques](https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/) (RGESN)

## Téléchargement et installation :

- Firefox : (lien à venir)
- Chrome : (lien à venir)

## Installation manuelle

L'extension fonctionne aussi bien sur Chrome et Firefox, toutefois la prise en charge du manifeste utile à son identification est différente d'un navigateur à l'autre.

Pour installer manuellement l'extension :
- Sur Firefox :
    1. Renommer le fichier `/public/manifest-v2.json` en `manifest.json`.
    2. Charger l'extension depuis l'adresse `about:debbuging`.
- Sur Chrome :
    1. Renommer le fichier `/public/manifest-v3.json` en `manifest.json`.
    2. Charger l'extension depuis l'adresse `chrome://extensions/`.

## Travailler sur l'extension depuis Chrome

1. Installer nodeJS (v16 minimum) et NPM (inclu avec NodeJS).
2. Dans un terminal, depuis le dossier téléchargé, lancer la commande `npm install` pour télécharger / installer les dépendances puis `npm run build` pour construire l'application depuis les sources fournies.
3. Lancer Google Chrome et naviguer à l'adresse `chrome://extensions/`.
4. Si nécessaire, activer le `Mode développeur`.
5. Cliquer sur le bouton `Charger l'extension non empaquetée` puis sélectionner le dossier de l'extension.
6. L'accès au popup se fait depuis la partie supérieure droite du navigateur.