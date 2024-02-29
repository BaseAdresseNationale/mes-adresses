/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SignalementService {

    /**
     * Find all signalements for a given codeCommune
     * @param codeCommune
     * @returns any[]
     * @throws ApiError
     */
    public static getSignalements(
        codeCommune: string,
    ): CancelablePromise<any[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/signalements/{codeCommune}',
            path: {
                'codeCommune': codeCommune,
            },
        });
    }

}
