/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PositionDTO } from './PositionDTO';

export type NumeroChangesRequestedDTO = {
    numero: string;
    suffixe?: string;
    nomVoie: string;
    parcelles: Array<string>;
    positions: Array<PositionDTO>;
    comment?: string | null;
};

