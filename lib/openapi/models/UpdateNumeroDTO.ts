/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectId } from './ObjectId';
import type { Position } from './Position';

export type UpdateNumeroDTO = {
    numero?: number;
    suffixe?: string | null;
    comment?: string | null;
    toponyme?: ObjectId | null;
    voie?: ObjectId;
    parcelles?: Array<string>;
    certifie?: boolean;
    positions?: Array<Position>;
};

