# Outil embarqué pour audits RGESN 

## Objectif

Permettre au plus grand nombre d'auditer par leurs propres moyens et depuis leur navigateur web la conformité de leur service(s) numérique(s) au [référentiel général d'écoconception de services numériques](https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/) (RGESN).

## Fonctionnalités

À implémenter pour le lancement :

* [fait] Générer la "grille" d'audit depuis une source RGESN
* [fait] Sélectionner la version RGESN à utiliser
* [fait] Valider / Rejeter / définir un critère comme étant non applicable
* [fait] Annuler l'évaluation d'un critère
* [fait] Sauvegarder côté client chaque changement
* [fait] Générer une synthèse des résultats

À implémenter par la suite ?

* Audits simultanés (note : terrain préparé via la gestion d'un tableau d'audits)
* Ajouter des notes rédactionnelles pour chaque critère
* Ajouter du contenu multimédia pour chaque critère (capture d'écran ? possible sans lien externe ?)
* Ajouter une synthèse / conclusion générale
* Exporter l'audit (sous quels formats ?)

## Tester l'extension avec Google Chrome

1. Installer nodeJS (v16 minimum) et NPM (inclu avec NodeJS).
2. Dans un terminal, depuis le dossier téléchargé, lancer la commande `npm install` pour télécharger / installer les dépendances puis `npm run build` pour construire l'application depuis les sources fournies.
3. Lancer Google Chrome et naviguer à l'adresse `chrome://extensions/`.
4. Si nécessaire, activer le `Mode développeur`.
5. Cliquer sur le bouton `Charger l'extension non empaquetée` puis sélectionner le dossier de l'extension.
6. L'accès au popup se fait depuis la partie supérieure droite du navigateur.

## Licence

Projet : À définir.

__Important : les données RGESN bêta sont sous Licence Ouverte ETALAB v2.0. À mentionner au sein même du projet ?__