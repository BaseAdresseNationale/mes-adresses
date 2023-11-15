/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectId } from './ObjectId';
import type { Position } from './Position';

export type Toponyme = {
    _id: ObjectId;
    _created: string;
    _updated: string;
    _deleted: string;
    _bal: ObjectId;
    nom: string;
    commune: string;
    nomAlt: Record<string, any>;
    parcelles: Array<string>;
    positions: Array<Position>;
};

