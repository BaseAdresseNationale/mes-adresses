/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { Position } from './Position';
export type UpdateNumeroDTO = {
    numero?: number;
    suffixe?: string | null;
    comment?: string | null;
    toponymeId?: string | null;
    voieId?: string;
    parcelles?: Array<string>;
    certifie?: boolean;
    communeDeleguee?: string;
    positions?: Array<Position>;
};

