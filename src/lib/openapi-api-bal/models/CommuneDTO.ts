/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { CommunePrecedenteDTO } from './CommunePrecedenteDTO';
export type CommuneDTO = {
    code: string;
    codeCommunesCadastre: Array<string>;
    nom: string;
    isCOM: boolean;
    hasCadastre: boolean;
    hasOpenMapTiles: boolean;
    hasOrtho: boolean;
    hasPlanIGN: boolean;
    communesDeleguees: Array<CommunePrecedenteDTO>;
};

