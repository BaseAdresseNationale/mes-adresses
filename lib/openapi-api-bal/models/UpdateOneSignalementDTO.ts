/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateOneSignalementDTO = {
    status: UpdateOneSignalementDTO.status;
    rejectionReason?: string;
};

export namespace UpdateOneSignalementDTO {

    export enum status {
        PENDING = 'PENDING',
        IGNORED = 'IGNORED',
        PROCESSED = 'PROCESSED',
        EXPIRED = 'EXPIRED',
    }


}

