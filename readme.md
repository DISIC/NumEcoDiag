# NumÉcoDiag 

Cette webExtension développée et mise à disposition gratuitement par la [MiNumEco](https://ecoresponsable.numerique.gouv.fr/) facilite l’auto-diagnostic de l’écoconception d’un service numérique, conformément au [Référentiel Général d'Écoconception de Services Numériques](https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/) (RGESN).

Réalisation : [Pôle écoconception Temesis](https://www.temesis.com/).

## Installation de l'extension

* [Firefox](https://addons.mozilla.org/fr/firefox/addon/num%C3%A9codiag/)
* [Chrome](https://chrome.google.com/webstore/detail/num%C3%A9codiag/fhdeahmddgflanbgilcglipaeofmcabc)
* Edge (à venir, utiliser en attendant l'extension [Chrome](https://chrome.google.com/webstore/detail/num%C3%A9codiag/fhdeahmddgflanbgilcglipaeofmcabc))

## Installation manuelle

### Installer en tant que webExtension

1. Installer [nodeJS](https://nodejs.org/fr/) (v16 minimum) et le gestionnaire de paquets NPM.
2. Dans un terminal, depuis le dossier téléchargé, lancer la commande `npm install` pour télécharger / installer les dépendances de développement du projet. 
3. Dans le même terminal, lancer ensuite la commande `npm run build` pour construire l'application depuis les sources fournies.
4. Procédure d'installation spécifique aux navigateurs web :
    * Sur Firefox : charger l'extension depuis l'adresse "about:debbuging" en sélectionnant le fichier "public/manifest.json".
    * Sur Chrome :
        1. Supprimer le fichier "/public/manifest.json".
        2. Renommer le fichier "/public/manifest-chrome.json" en "manifest.json".
        3. Charger l'extension depuis l'adresse "chrome://extensions/" en sélectionnant le dossier "public".

### Utiliser en tant que webApplication

1. Installer [nodeJS](https://nodejs.org/fr/) (v16 minimum) et le gestionnaire de paquets NPM.
2. Dans un terminal, depuis le dossier téléchargé, lancer la commande `npm install` pour télécharger / installer les dépendances de développement du projet. 
3. Dans le même terminal, lancer ensuite la commande `npm run dev` pour travailler sur le projet.
4. Passer la valeur de la constante `webAppMode` du fichier "/src/modules/webAppMode.mjs" à `true.
5. Se rendre à l'adresse "http://localhost:37271/". 

### Différences entre les deux versions

* La webExtension utilise l'[API storage](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/webExtensions/API/storage) alors que la webApplication l'application utilise l'[API Web Storage](https://developer.mozilla.org/fr/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API).

## Licences

* Le RGESN est sous [licence ouverte Etalab v2](https://www.etalab.gouv.fr/licence-ouverte-open-licence).
* L'extension est sous [licence European Union Public License 1](https://joinup.ec.europa.eu/sites/default/files/inline-files/EUPL%20v1_2%20FR.txt)</a>.
