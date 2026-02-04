/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BaseLocaleSync = {
    status: BaseLocaleSync.status;
    isPaused: boolean;
    lastUploadedRevisionId: string;
    currentUpdated: string;
};
export namespace BaseLocaleSync {
    export enum status {
        OUTDATED = 'outdated',
        SYNCED = 'synced',
        CONFLICT = 'conflict',
    }
}

