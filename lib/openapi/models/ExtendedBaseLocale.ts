/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectId } from './ObjectId';
import type { Sync } from './Sync';

export type ExtendedBaseLocale = {
    _id: ObjectId;
    _created: string;
    _updated: string;
    _deleted: string;
    nom: string;
    emails: Array<string>;
    token: string;
    status: ExtendedBaseLocale.status;
    _habilitation: string;
    commune: string;
    enableComplement: boolean;
    sync: Sync;
    nbNumeros: number;
    nbNumerosCertifies: number;
    isAllCertified: boolean;
    commentedNumeros: Array<string>;
};

export namespace ExtendedBaseLocale {

    export enum status {
        DRAFT = 'draft',
        READY_TO_PUBLISH = 'ready-to-publish',
        PUBLISHED = 'published',
        DEMO = 'demo',
        REPLACED = 'replaced',
    }


}

