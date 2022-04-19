## Objectif

Permettre au plus grand nombre d'auditer par leurs propres moyens et depuis leur navigateur web la conformité de leur service(s) numérique(s) au [référentiel général d'écoconception de services numériques](https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/) (RGESN).

## Fonctionnalités

[version concernée par la fonctionnalité]

* [1] Isoler les services numériques afin de pouvoir mener plusieurs audits à la fois
* [1] Générer la "grille" d'audit depuis source RGESN (distante si possible)
* [1] Valider / Rejeter ou définir un critère comme étant non applicable
* [1] Sauvegarder côté client à chaque changement (local storage)
* [1] Mettre en évidence les résultats (simplifié)
* [1] Permettre la sélection de la version du RGESN à utiliser
* [2] Permettre l'ajout des notes rédactionnelles pour chaque critère
* [2] Permettre l'ajout de contenu multimédia pour chaque critère (possible sans lien externe ?)
* [2] Permettre l'ajout d'une synthèse / conclusion générale
* [2] Mettre en évidence les résultats (poussé)
* [2] Permettre l'exportation de l'audit

## Approche

WebExtension rendue côté client avec Svelte, initialement conçue en tant que webApp traditionnelle afin d'en faciliter le développement.