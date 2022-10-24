# NumÉcoDiag 

Cette WebExtension développée et mise à disposition gratuitement par la [MiNumEco](https://ecoresponsable.numerique.gouv.fr/) facilite l’auto-évaluation de l’écoconception d’un service numérique, conformément au [Référentiel Général d'Écoconception de Services Numériques](https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/) (RGESN).

Réalisation : [Pôle écoconception Temesis](https://www.temesis.com/).

## Installation automatique :

* Firefox : (lien à venir)
* Chrome : (lien à venir)

## Installation manuelle

1. Installer [nodeJS](https://nodejs.org/fr/) (v16 minimum) et le gestionnaire de paquets NPM.
2. Dans un terminal, depuis le dossier téléchargé, lancer la commande `npm install` pour télécharger / installer les dépendances de développement du projet. 
3. Dans le même terminal, lancer ensuite la commande `npm run build` pour construire l'application depuis les sources fournies.
4. Procédure d'installation spécifique 
    - Sur Firefox :
        1. Renommer le fichier `/public/manifest-v2.json` en `manifest.json`.
        2. Charger l'extension depuis l'adresse `about:debbuging` en sélectionnant le fichier `public/manifest.json`
    - Sur Chrome :
        1. Renommer le fichier `/public/manifest-v3.json` en `manifest.json`.
        2. Charger l'extension depuis l'adresse `chrome://extensions/` en sélectionnant le dossier `public`.
5. L'accès au popup se fait depuis la partie supérieure droite du navigateur.

## Licenses

* Le RGESN est sous [licence ouverte Etalab v2](https://www.etalab.gouv.fr/licence-ouverte-open-licence).
* L'extension est sous [licence European Union Public License 1](https://joinup.ec.europa.eu/sites/default/files/inline-files/EUPL%20v1_2%20FR.txt)</a>.