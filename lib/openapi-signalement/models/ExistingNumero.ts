/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExistingToponyme } from './ExistingToponyme';
import type { ExistingVoie } from './ExistingVoie';
import type { Position } from './Position';

export type ExistingNumero = {
    type: ExistingNumero.type;
    numero: number;
    suffixe: string;
    position: Position;
    toponyme: (ExistingVoie | ExistingToponyme);
};

export namespace ExistingNumero {

    export enum type {
        NUMERO = 'NUMERO',
        VOIE = 'VOIE',
        TOPONYME = 'TOPONYME',
    }


}

