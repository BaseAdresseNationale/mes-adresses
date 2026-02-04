/* generated using openapi-typescript-codegen -- do not edit */
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
    communeDeleguee?: string;
    positions: Array<Position>;
};

