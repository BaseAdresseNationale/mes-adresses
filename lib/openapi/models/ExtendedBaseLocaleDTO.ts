/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Sync } from './Sync';

export type ExtendedBaseLocaleDTO = {
    _id: string;
    banId: string;
    _created: string;
    _updated: string;
    _deleted: string;
    nom: string;
    emails: Array<string>;
    token: string;
    status: ExtendedBaseLocaleDTO.status;
    _habilitation: string;
    commune: string;
    enableComplement: boolean;
    sync: Sync;
    nbNumeros: number;
    nbNumerosCertifies: number;
    isAllCertified: boolean;
    commentedNumeros: Array<string>;
};

export namespace ExtendedBaseLocaleDTO {

    export enum status {
        DRAFT = 'draft',
        PUBLISHED = 'published',
        DEMO = 'demo',
        REPLACED = 'replaced',
    }


}

