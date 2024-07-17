/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseLocale } from './BaseLocale';
import type { Numero } from './Numero';

export type ExtendedVoieDTO = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    balId: string;
    nom: string;
    nomAlt: Record<string, any>;
    typeNumerotation: ExtendedVoieDTO.typeNumerotation;
    centroid: Record<string, any>;
    trace: Record<string, any>;
    baseLocale: BaseLocale;
    numeros: Array<Numero>;
    nbNumeros: number;
    nbNumerosCertifies: number;
    isAllCertified: boolean;
    commentedNumeros: Array<string>;
    bbox: Record<string, any>;
};

export namespace ExtendedVoieDTO {

    export enum typeNumerotation {
        NUMERIQUE = 'numerique',
        METRIQUE = 'metrique',
    }


}

