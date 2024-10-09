/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LineString } from './LineString';

export type UpdateVoieDTO = {
    nom?: string;
    nomAlt?: Record<string, any> | null;
    communeDeleguee?: string | null;
    typeNumerotation?: UpdateVoieDTO.typeNumerotation;
    trace?: LineString;
};

export namespace UpdateVoieDTO {

    export enum typeNumerotation {
        NUMERIQUE = 'numerique',
        METRIQUE = 'metrique',
    }


}

