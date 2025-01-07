/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Numero } from './Numero';
import type { Toponyme } from './Toponyme';

export type Position = {
    id: string;
    toponymeId: string;
    numeroId: string;
    type: Position.type;
    source: string;
    rank: number;
    point: Record<string, any>;
    toponyme: Toponyme;
    numero: Numero;
};

export namespace Position {

    export enum type {
        ENTR_E = 'entrée',
        B_TIMENT = 'bâtiment',
        CAGE_D_ESCALIER = 'cage d’escalier',
        LOGEMENT = 'logement',
        SERVICE_TECHNIQUE = 'service technique',
        D_LIVRANCE_POSTALE = 'délivrance postale',
        PARCELLE = 'parcelle',
        SEGMENT = 'segment',
    }


}

