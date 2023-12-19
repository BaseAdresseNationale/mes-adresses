/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Position } from './Position';

export type CreateNumeroDTO = {
    numero: number;
    suffixe?: string | null;
    comment?: string | null;
    toponyme?: string | null;
    parcelles?: Array<string>;
    certifie?: boolean;
    positions: Array<Position>;
};

