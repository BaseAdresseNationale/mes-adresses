/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { BaseLocale } from './BaseLocale';
import type { Numero } from './Numero';
import type { Position } from './Position';
export type ExtentedToponymeDTO = {
    id: string;
    banId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    balId: string;
    nom: string;
    nomAlt: Record<string, any>;
    communeDeleguee: string;
    parcelles: Array<string>;
    positions: Array<Position>;
    baseLocale: BaseLocale;
    numeros: Array<Numero>;
    nbNumeros: number;
    nbNumerosCertifies: number;
    isAllCertified: boolean;
    commentedNumeros: Array<string>;
    bbox: Record<string, any>;
};

