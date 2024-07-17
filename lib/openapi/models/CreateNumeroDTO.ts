/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Position } from './Position';

export type CreateNumeroDTO = {
    numero: number;
    suffixe?: string | null;
    comment?: string | null;
    toponymeId?: string | null;
    parcelles?: Array<string>;
    certifie?: boolean;
    positions: Array<Position>;
};

