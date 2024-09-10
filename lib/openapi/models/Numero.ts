/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseLocale } from './BaseLocale';
import type { Position } from './Position';
import type { Toponyme } from './Toponyme';
import type { Voie } from './Voie';

export type Numero = {
    id: string;
    banId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    balId: string;
    voieId: string;
    toponymeId: string;
    numero: number;
    suffixe: string;
    numeroComplet: string;
    comment: string;
    parcelles: Array<string>;
    certifie: boolean;
    positions: Array<Position>;
    baseLocale: BaseLocale;
    voie: Voie;
    toponyme: Toponyme;
};

