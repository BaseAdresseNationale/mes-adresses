# Mes Adresses

"Mes Adresses" est un outil en ligne qui vous permet de gérer simplement vos adresses, de la constitution d’une Base Adresse Locale à sa mise à jour. Il est accessible sans compétences techniques et dispose d’un tutoriel embarqué.

Il est disponible en ligne à l'adresse [mes-adresses.data.gouv.fr](https://mes-adresses.data.gouv.fr).

[![XO code style](https://badgen.net/badge/code%20style/XO/cyan)](https://github.com/xojs/xo)

## Guide

https://adresse.data.gouv.fr/data/docs/guide-mes-adresses-v4.0.pdf

## Pré-requis

- [Node.js](https://nodejs.org) 14+
- [yarn](https://www.yarnpkg.com)

## Installation

Installation des dépendances Node.js

```
$ yarn
```

## Drapeaux disponible pour les langues régionales
```
$ yarn build-available-flags
```

## Développement

Lancer le serveur de développement :

```
$ yarn dev
```

## Production

Créer une version de production :

```
$ yarn build
```

Démarrer le serveur (port 3000 par défaut) :

```
$ yarn start
```

## Configuration

Cette application utilise des variables d'environnement pour sa configuration.
Elles peuvent être définies classiquement ou en créant un fichier `.env` sur la base du modèle `.env.sample`.

| Nom de la variable   | Description                                                                 |
| -------------------- | --------------------------------------------------------------------------- |
| `NEXT_PUBLIC_BAL_API_URL` | URL de base de l’API BAL             |
| `NEXT_PUBLIC_GEO_API_URL` | URL de base de l’API Géo             |
| `NEXT_PUBLIC_ADRESSE_URL` | URL de base du site adresse.data.gouv.fr |

Toutes ces variables ont des valeurs par défaut que vous trouverez dans le fichier `.env.sample`.

## Gouvernance

Ce outil a été conçu à l'initiative d'Etalab. Il est depuis 2020 piloté conjointement par Etalab et l'ANCT.

## Licence

MIT
