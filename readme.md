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

Dysfonctionnements connus à corriger :

* L'interface n'est pas réinitialisée lors du changement de la version RGESN à utiliser.

À implémenter par la suite ?

* Audits simultanés (note : terrain préparé via la gestion d'un tableau d'audits)
* Ajouter des notes rédactionnelles pour chaque critère
* Ajouter du contenu multimédia pour chaque critère (capture d'écran ? possible sans lien externe ?)
* Ajouter une synthèse / conclusion générale
* Exporter l'audit (sous quels formats ?)

## Technologies

Projet __initialement__ conçu en tant que webApp traditionnelle rendue côté client avec [Svelte](https://svelte.dev/) afin d'en faciliter le développement, l'objectif étant d'en faire une __WebExtension__.

À ce sujet :
* Il sera nécessaire de revoir la gestion du stockage côté client (API différentes).
* La possibilité de lire les référentiels depuis les ressources empaquetées reste à confirmer.
* En théorie, le portage devrait pouvoir se faire aisément aussi bien sur Chrome et sur Firefox.

## Tester le projet

1. Installer nodeJS (v16 minimum) et NPM (inclu avec NodeJS).
2. Dans un terminal, depuis le dossier téléchargé, lancer la commande `npm install` pour télécharger / installer les dépendances puis `npm run dev` pour démarrer le serveur.
3. Ouvrir la page http://localhost:8080.

## Licence

Projet : À définir.

__Important : les données RGESN bêta sont sous Licence Ouverte ETALAB v2.0. À mentionner au sein même du projet ?__

## Notes

* Est-il utile de conserver les deux versions à terme (application web + WebExtension) ?
* Faut-il réfléchir à une version plus élaborée pour les usages internes ? 