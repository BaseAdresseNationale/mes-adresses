/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateSignalementDTO = {
    ids: Array<string>;
    status: UpdateSignalementDTO.status;
};

export namespace UpdateSignalementDTO {

    export enum status {
        PENDING = 'PENDING',
        IGNORED = 'IGNORED',
        PROCESSED = 'PROCESSED',
        EXPIRED = 'EXPIRED',
    }


}

