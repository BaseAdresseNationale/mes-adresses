/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseLocale } from './BaseLocale';
import type { Numero } from './Numero';

export type Voie = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    balId: string;
    nom: string;
    nomAlt: Record<string, any>;
    typeNumerotation: Voie.typeNumerotation;
    centroid: Record<string, any>;
    trace: Record<string, any>;
    baseLocale: BaseLocale;
    numeros: Array<Numero>;
};

export namespace Voie {

    export enum typeNumerotation {
        NUMERIQUE = 'numerique',
        METRIQUE = 'metrique',
    }


}

