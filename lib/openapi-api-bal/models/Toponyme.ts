/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseLocale } from './BaseLocale';
import type { Numero } from './Numero';
import type { Position } from './Position';

export type Toponyme = {
    id: string;
    banId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    balId: string;
    nom: string;
    nomAlt: Record<string, any>;
    parcelles: Array<string>;
    positions: Array<Position>;
    baseLocale: BaseLocale;
    numeros: Array<Numero>;
};

