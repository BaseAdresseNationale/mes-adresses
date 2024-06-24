/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FeaturePoint } from './FeaturePoint';
import type { LineString } from './LineString';

export type Voie = {
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
    typeNumerotation: Voie.typeNumerotation;
    trace: LineString;
    traceTiles: Array<string>;
};

export namespace Voie {

    export enum typeNumerotation {
        NUMERIQUE = 'numerique',
        METRIQUE = 'metrique',
    }


}

