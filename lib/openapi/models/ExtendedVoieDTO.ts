/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FeaturePoint } from './FeaturePoint';
import type { LineString } from './LineString';

export type ExtendedVoieDTO = {
    _id: string;
    _created: string;
    _updated: string;
    _deleted: string;
    _bal: string;
    nom: string;
    commune: string;
    nomAlt: Record<string, any>;
    centroid: FeaturePoint;
    centroidTiles: Array<string>;
    typeNumerotation: ExtendedVoieDTO.typeNumerotation;
    trace: LineString;
    traceTiles: Array<string>;
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

