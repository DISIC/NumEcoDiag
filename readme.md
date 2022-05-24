# Outil embarqué pour audits RGESN 

## Objectif

Permettre au plus grand nombre d'auditer par leurs propres moyens et depuis leur navigateur web la conformité de leur service(s) numérique(s) au [référentiel général d'écoconception de services numériques](https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/) (RGESN).

## Tester l'extension avec Google Chrome

1. Installer nodeJS (v16 minimum) et NPM (inclu avec NodeJS).
2. Dans un terminal, depuis le dossier téléchargé, lancer la commande `npm install` pour télécharger / installer les dépendances puis `npm run build` pour construire l'application depuis les sources fournies.
3. Lancer Google Chrome et naviguer à l'adresse `chrome://extensions/`.
4. Si nécessaire, activer le `Mode développeur`.
5. Cliquer sur le bouton `Charger l'extension non empaquetée` puis sélectionner le dossier de l'extension.
6. L'accès au popup se fait depuis la partie supérieure droite du navigateur.
