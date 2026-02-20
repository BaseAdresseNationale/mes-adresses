/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StrategyDTO } from './StrategyDTO';
export type HabilitationDTO = {
    id: string;
    codeCommune: string;
    emailCommune: string;
    strategy: StrategyDTO;
    client: string;
    status: HabilitationDTO.status;
    createdAt: string;
    updatedAt: string;
};
export namespace HabilitationDTO {
    export enum status {
        ACCEPTED = 'accepted',
        PENDING = 'pending',
        REJECTED = 'rejected',
    }
}

