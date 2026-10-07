/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SerializedPosition = {
    id: string;
    toponymeId: string;
    numeroId: string;
    type: SerializedPosition.type;
    source: string;
    rank: number;
    point: Record<string, any>;
};
export namespace SerializedPosition {
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

