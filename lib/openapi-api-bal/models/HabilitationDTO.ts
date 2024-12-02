/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Strategy } from './Strategy';

export type HabilitationDTO = {
    _id: string;
    codeCommune: string;
    emailCommune: string;
    franceconnectAuthenticationUrl: string;
    strategy: Strategy;
    client: string;
    status: HabilitationDTO.status;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
};

export namespace HabilitationDTO {

    export enum status {
        PENDING = 'pending',
        ACCEPTED = 'accepted',
        REJECTED = 'rejected',
    }


}

