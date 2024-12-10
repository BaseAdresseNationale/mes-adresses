/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LineString } from './LineString';

export type UpdateVoieDTO = {
    nom?: string;
    nomAlt?: Record<string, any> | null;
    typeNumerotation?: UpdateVoieDTO.typeNumerotation;
    trace?: LineString;
    comment?: string | null;
};

export namespace UpdateVoieDTO {

    export enum typeNumerotation {
        NUMERIQUE = 'numerique',
        METRIQUE = 'metrique',
    }


}

