/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Position } from './Position';
export type CreateToponymeDTO = {
    nom: string;
    nomAlt?: Record<string, any> | null;
    communeDeleguee?: string | null;
    parcelles?: Array<string> | null;
    positions?: Array<Position>;
};

