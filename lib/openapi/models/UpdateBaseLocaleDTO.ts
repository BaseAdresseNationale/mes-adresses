/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateBaseLocaleDTO = {
    nom?: string;
    status?: UpdateBaseLocaleDTO.status;
    emails?: Array<string>;
};

export namespace UpdateBaseLocaleDTO {

    export enum status {
        DRAFT = 'draft',
        PUBLISHED = 'published',
        DEMO = 'demo',
        REPLACED = 'replaced',
    }


}

