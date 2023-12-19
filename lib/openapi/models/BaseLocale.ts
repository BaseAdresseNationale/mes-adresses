/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Sync } from './Sync';

export type BaseLocale = {
    _id: string;
    _created: string;
    _updated: string;
    _deleted: string;
    nom: string;
    emails: Array<string>;
    token: string;
    status: BaseLocale.status;
    _habilitation: string;
    commune: string;
    enableComplement: boolean;
    sync: Sync;
};

export namespace BaseLocale {

    export enum status {
        DRAFT = 'draft',
        READY_TO_PUBLISH = 'ready-to-publish',
        PUBLISHED = 'published',
        DEMO = 'demo',
        REPLACED = 'replaced',
    }


}

