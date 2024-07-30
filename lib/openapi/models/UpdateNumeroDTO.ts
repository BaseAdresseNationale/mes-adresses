/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Position } from './Position';

export type UpdateNumeroDTO = {
    numero?: number;
    suffixe?: string | null;
    comment?: string | null;
    toponymeId?: string | null;
    voieId?: string;
    parcelles?: Array<string>;
    certifie?: boolean;
    positions?: Array<Position>;
};

