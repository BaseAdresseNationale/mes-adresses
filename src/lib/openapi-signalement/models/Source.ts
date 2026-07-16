/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Author } from './Author';
import type { Report } from './Report';
export type Source = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    nom: string;
    type: Source.type;
    siret?: string | null;
    reports?: Array<Report> | null;
    defaultAuthor?: Author | null;
};
export namespace Source {
    export enum type {
        PUBLIC = 'PUBLIC',
        PRIVATE = 'PRIVATE',
    }
}

