/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StrategyDTO = {
    type: StrategyDTO.type;
    pinCode: string;
    pinCodeExpiration: string;
    remainingAttempts: number;
    createdAt: string;
};
export namespace StrategyDTO {
    export enum type {
        EMAIL = 'email',
        FRANCECONNECT = 'franceconnect',
        PROCONNECT = 'proconnect',
        INTERNAL = 'internal',
    }
}

