/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FeaturePoint } from './FeaturePoint';
import type { LineString } from './LineString';
import type { ObjectId } from './ObjectId';

export type ExtendedVoie = {
    _id: ObjectId;
    _created: string;
    _updated: string;
    _deleted: string;
    _bal: ObjectId;
    nom: string;
    commune: string;
    nomAlt: Record<string, any>;
    centroid: FeaturePoint;
    centroidTiles: Array<string>;
    typeNumerotation: Record<string, any>;
    trace: LineString;
    traceTiles: Array<string>;
    nbNumeros: number;
    nbNumerosCertifies: number;
    isAllCertified: boolean;
    commentedNumeros: Array<string>;
    bbox: Record<string, any>;
};

