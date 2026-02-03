/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LineString } from './LineString';

export type CreateVoieDTO = {
    nom: string;
    nomAlt?: Record<string, any> | null;
    typeNumerotation?: CreateVoieDTO.typeNumerotation;
    trace?: LineString;
    comment?: string | null;
};

export namespace CreateVoieDTO {

    export enum typeNumerotation {
        NUMERIQUE = 'numerique',
        METRIQUE = 'metrique',
    }


}

