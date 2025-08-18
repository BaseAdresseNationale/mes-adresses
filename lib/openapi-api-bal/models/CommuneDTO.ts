/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CommunePrecedenteDTO } from './CommunePrecedenteDTO';

export type CommuneDTO = {
    code: string;
    codeCommuneCadastre: string;
    nom: string;
    isCOM: boolean;
    hasCadastre: boolean;
    hasOpenMapTiles: boolean;
    hasOrtho: boolean;
    hasPlanIGN: boolean;
    communesDeleguees: Array<CommunePrecedenteDTO>;
};

