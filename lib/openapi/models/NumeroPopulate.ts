/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Position } from './Position';
import type { Voie } from './Voie';

export type NumeroPopulate = {
    _id: string;
    banId: string;
    _created: string;
    _updated: string;
    _deleted: string;
    _bal: string;
    numero: number;
    numeroComplet: string;
    commune: string;
    suffixe: string;
    comment: string;
    toponyme: string;
    voie: Voie;
    parcelles: Array<string>;
    certifie: boolean;
    positions: Array<Position>;
    tiles: Array<string>;
};

