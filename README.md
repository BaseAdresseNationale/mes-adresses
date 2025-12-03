# Mes Adresses

"Mes Adresses" est un outil en ligne qui vous permet de gérer simplement vos adresses, de la constitution d’une Base Adresse Locale à sa mise à jour. Il est accessible sans compétences techniques et dispose d’un tutoriel embarqué.

Il est disponible en ligne à l'adresse [mes-adresses.data.gouv.fr](https://mes-adresses.data.gouv.fr).

## Guide

https://adresse.data.gouv.fr/data/docs/guide-mes-adresses-v4.0.pdf

## 📚 Documentation

Une documentation plus complète et des guides d’utilisation sont disponibles dans le [Wiki](https://github.com/BaseAdresseNationale/mes-adresses/wiki).

## Pré-requis

- [Node.js](https://nodejs.org) 22
- [yarn](https://www.yarnpkg.com)

## Utilisation

### Installation

Installation des dépendances Node.js

```
$ yarn
```

Créer la liste des drapeaux disponibles pour les langues régionales

```
$ yarn build-available-flags
```

Créer les variables d'environnement

```bash
cp .env.sample .env
```

On pourra ensuite éditer les variables d'environnement dans le fichier `.env` si nécessaire.

### Développement

Lancer le serveur de développement :

```
$ yarn dev
```

### Production

Créer une version de production :

```
$ yarn build
```

Démarrer le serveur (port 3000 par défaut) :

```
$ yarn start
```

### Linter

Rapport du linter (eslint) :

```
$ yarn lint
```

## Configuration

Cette application utilise des variables d'environnement pour sa configuration.
Elles peuvent être définies classiquement ou en créant un fichier `.env` sur la base du modèle `.env.sample`.

| Nom de la variable               | Description                                                     |
| -------------------------------- | --------------------------------------------------------------- |
| `NEXT_PUBLIC_BAL_API_URL`        | URL de base de l’API BAL                                        |
| `NEXT_PUBLIC_GEO_API_URL`        | URL de base de l’API Géo                                        |
| `NEXT_PUBLIC_ADRESSE_URL`        | URL de base du site adresse.data.gouv.fr                        |
| `NEXT_PUBLIC_EDITEUR_URL`        | URL de base pour les redirection sur l'éditeur mes-adresses     |
| `NEXT_PUBLIC_API_BAN_URL`        | URL de base de ban plateforme                                   |
| `NEXT_PUBLIC_BAN_API_DEPOT`      | URL de base de l'api de depot                                   |
| `NEXT_PUBLIC_PEERTUBE`           | URL du peertube                                                 |
| `NEXT_PUBLIC_MATOMO_TRACKER_URL` | URL du matomo                                                   |
| `NEXT_PUBLIC_MATOMO_SITE_ID`     | Id du site sur matomo                                           |
| `NEXT_PUBLIC_API_SIGNALEMENT`    | URL de l'API signalement                                        |
| `NEXT_PUBLIC_BAL_ADMIN_URL`      | URL de base de bal admin                                        |
| `PORT`                           | Port de l'application                                           |
| `MATTERMOST_CHANNEL_URL`         | Channel Mattermost où sont publiées les actualités              |
| `MATTERMOST_TOKEN`               | Token pour afficher les messages de Mattermost sur la home page |
| `NEXT_PUBLIC_BAL_WIDGET_URL`     | URL de BAL-Widget                                               |
| `SENTRY_ENABLED`                 | Activation de Sentry                                            |

Toutes ces variables ont des valeurs par défaut que vous trouverez dans le fichier `.env.sample`.

## Gouvernance

Ce outil a été conçu à l'initiative d'Etalab. Il est depuis 2020 piloté conjointement par Etalab et l'ANCT.

## Licence

MIT
