/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthorInput } from './AuthorInput';
export type CreateSourceDTO = {
    nom: string;
    type: CreateSourceDTO.type;
    siret?: string | null;
    defaultAuthor?: AuthorInput | null;
};
export namespace CreateSourceDTO {
    export enum type {
        PUBLIC = 'PUBLIC',
        PRIVATE = 'PRIVATE',
    }
}

