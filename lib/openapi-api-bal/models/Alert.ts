/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseLocale } from './BaseLocale';
import type { Numero } from './Numero';
import type { Toponyme } from './Toponyme';
import type { Voie } from './Voie';

export type Alert = {
    id: string;
    balId: string;
    voieId: string;
    toponymeId: string;
    numeroId: string;
    field: string;
    value: string;
    error: string;
    severity: Alert.severity;
    isIgnored: boolean;
    baseLocale: BaseLocale;
    voie: Voie;
    toponyme: Toponyme;
    numero: Numero;
};

export namespace Alert {

    export enum severity {
        E = 'E',
        W = 'W',
        I = 'I',
    }


}

