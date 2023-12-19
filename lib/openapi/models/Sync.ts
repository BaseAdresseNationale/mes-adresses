/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Sync = {
    status: Sync.status;
    isPaused: boolean;
    lastUploadedRevisionId: string;
    currentUpdated: string;
};

export namespace Sync {

    export enum status {
        OUTDATED = 'outdated',
        SYNCED = 'synced',
        CONFLICT = 'conflict',
    }


}

