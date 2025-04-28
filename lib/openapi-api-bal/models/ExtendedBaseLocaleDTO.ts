/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseLocaleSync } from './BaseLocaleSync';
import type { Numero } from './Numero';
import type { Toponyme } from './Toponyme';
import type { Voie } from './Voie';

export type ExtendedBaseLocaleDTO = {
    id: string;
    banId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    nom: string;
    communeNomsAlt: Record<string, any>;
    commune: string;
    emails: Array<string>;
    token: string;
    status: ExtendedBaseLocaleDTO.status;
    habilitationId: string;
    sync: BaseLocaleSync;
    voies: Array<Voie>;
    toponymes: Array<Toponyme>;
    numeros: Array<Numero>;
    nbNumeros: number;
    nbNumerosCertifies: number;
    isAllCertified: boolean;
};

export namespace ExtendedBaseLocaleDTO {

    export enum status {
        DRAFT = 'draft',
        PUBLISHED = 'published',
        DEMO = 'demo',
        REPLACED = 'replaced',
    }


}

