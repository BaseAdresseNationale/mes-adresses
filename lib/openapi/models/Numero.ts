/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectId } from './ObjectId';
import type { Position } from './Position';

export type Numero = {
    _id: ObjectId;
    _bal: ObjectId;
    numero: number;
    commune: string;
    suffixe: string;
    comment: string;
    toponyme: string;
    voie: string;
    parcelles: Array<string>;
    certifie: boolean;
    positions: Array<Position>;
    tiles: Array<string>;
    _created: string;
    _updated: string;
    _delete: string;
};

