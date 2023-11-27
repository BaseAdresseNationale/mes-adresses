/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Strategy = {
    type: Strategy.type;
    pinCode: string;
    pinCodeExpiration: string;
    remainingAttempts: number;
    createdAt: string;
};

export namespace Strategy {

    export enum type {
        EMAIL = 'email',
        FRANCECONNECT = 'franceconnect',
    }


}

