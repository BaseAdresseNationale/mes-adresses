/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectId } from './ObjectId';
import type { Position } from './Position';

export type CreateNumeroDto = {
    numero: number;
    suffixe?: string | null;
    comment?: string | null;
    toponyme?: ObjectId | null;
    parcelles?: Array<string>;
    certifie?: boolean;
    positions: Array<Position>;
};

