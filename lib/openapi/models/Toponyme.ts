/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Position } from './Position';

export type Toponyme = {
    _id: string;
    banId: string;
    _created: string;
    _updated: string;
    _deleted: string;
    _bal: string;
    nom: string;
    commune: string;
    nomAlt: Record<string, any>;
    parcelles: Array<string>;
    positions: Array<Position>;
};

