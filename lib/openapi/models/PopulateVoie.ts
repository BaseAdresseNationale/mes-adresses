/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FeaturePoint } from './FeaturePoint';
import type { LineString } from './LineString';
import type { Numero } from './Numero';

export type PopulateVoie = {
    _id: string;
    banId: string;
    _created: string;
    _updated: string;
    _deleted: string;
    _bal: string;
    nom: string;
    commune: string;
    nomAlt: Record<string, any>;
    centroid: FeaturePoint;
    centroidTiles: Array<string>;
    typeNumerotation: PopulateVoie.typeNumerotation;
    trace: LineString;
    traceTiles: Array<string>;
    numeros: Array<Numero>;
};

export namespace PopulateVoie {

    export enum typeNumerotation {
        NUMERIQUE = 'numerique',
        METRIQUE = 'metrique',
    }


}

