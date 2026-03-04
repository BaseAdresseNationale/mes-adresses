/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateManySignalementDTO = {
    ids: Array<string>;
    status: UpdateManySignalementDTO.status;
};
export namespace UpdateManySignalementDTO {
    export enum status {
        PENDING = 'PENDING',
        IGNORED = 'IGNORED',
        PROCESSED = 'PROCESSED',
        EXPIRED = 'EXPIRED',
    }
}

