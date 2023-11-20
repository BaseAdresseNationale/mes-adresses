/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectId } from './ObjectId';

export type Sync = {
    status: Sync.status;
    isPaused: boolean;
    lastUploadedRevisionId: ObjectId;
    currentUpdated: string;
};

export namespace Sync {

    export enum status {
        OUTDATED = 'outdated',
        SYNCED = 'synced',
        CONFLICT = 'conflict',
    }


}

