# CLAUDE.md

Éditeur web permettant aux communes de créer, éditer et publier leur Base Adresse Locale (voies, toponymes, numéros, positions sur carte). Backend : mes-adresses-api.

## Commandes

```bash
yarn                 # install (yarn uniquement)
cp .env.sample .env
yarn dev             # Next.js en dev
yarn build           # génère available-flags.json puis next build
yarn lint
yarn test            # Playwright e2e (lance `yarn dev` automatiquement)
yarn test:ui         # Playwright en mode UI
yarn generate:openapi:api-bal       # régénère src/lib/openapi-api-bal (mes-adresses-api doit tourner en local)
yarn generate:openapi:signalement   # régénère src/lib/openapi-signalement (api-signalement doit tourner en local)
```

## Architecture

Next.js 16 **App Router**, React 19, UI **evergreen-ui**, carte **maplibre-gl** / react-map-gl. Sentry configuré (`sentry.*.config.ts`, `instrumentation.ts`).

- `src/app/` : routes. L'essentiel est sous `bal/[balId]/` (`voies/`, `toponymes/`, `signalements/`, `[token]/` pour l'accès admin par lien+token).
- `src/contexts/` : état global via React Context — `bal-data.tsx` (données de la BAL courante), `token.tsx` (droits d'édition), `map.tsx`, `draw.tsx`, `markers.tsx`, `open-api.tsx` (configure `OpenAPI.BASE`/token des clients générés), `signalement.tsx`…
- `src/hooks/` : logique réutilisable (`publish-process.ts`, `habilitation.ts`, `fusion-voies.ts`, `trash.ts`…).
- `src/components/` : composants par domaine (`bal/`, `voie/`, `toponyme/`, `map/`, `signalement/`, `habilitation-process/`…).
- `src/lib/` : clients externes. `openapi-api-bal/` et `openapi-signalement/` sont **générés — ne pas éditer à la main**, régénérer après un changement d'API.
- `e2e-tests/` : tests Playwright (`playwright.config.ts`).

## Points d'attention

- Tout appel à mes-adresses-api passe par les services générés de `src/lib/openapi-api-bal` (pas de fetch manuel).
- `available-flags.json` (drapeaux des langues régionales) est généré par `scripts/build-available-flags.mjs` au build.
- `react-map-gl-draw` impose `@turf/difference` en 6.0.1 (voir DEVELOPER_NOTES.md).
