/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CommuneCogDTO } from './CommuneCogDTO';

export type CommuneDTO = {
    code: string;
    nom: string;
    typeLiaison: number;
    zone: string;
    arrondissement: string;
    departement: string;
    region: string;
    type: string;
    rangChefLieu: number;
    siren: string;
    codesPostaux: Array<string>;
    population: number;
    isCOM: boolean;
    hasCadastre: boolean;
    hasOpenMapTiles: boolean;
    hasOrtho: boolean;
    hasPlanIGN: boolean;
    communesDeleguees: Array<CommuneCogDTO>;
};

