/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { _UpdateSignalementDTO } from '../models/_UpdateSignalementDTO';

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

    /**
     * Update a given signalement
     * @param requestBody
     * @returns any[]
     * @throws ApiError
     */
    public static updateSignalement(
        requestBody: _UpdateSignalementDTO,
    ): CancelablePromise<any[]> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/signalements',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
