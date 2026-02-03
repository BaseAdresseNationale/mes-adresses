/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Position } from './Position';

export type UpdateToponymeDTO = {
    nom?: string;
    nomAlt?: Record<string, any> | null;
    communeDeleguee?: string | null;
    parcelles?: Array<string> | null;
    positions?: Array<Position>;
};

