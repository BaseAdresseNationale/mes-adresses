/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateSignalementDTO } from '../models/UpdateSignalementDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SignalementsService {

    /**
     * Update signalements
     * @param baseLocaleId
     * @param requestBody
     * @returns boolean
     * @throws ApiError
     */
    public static updateSignalements(
        baseLocaleId: string,
        requestBody: UpdateSignalementDTO,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/signalements/{baseLocaleId}',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get author by signalement id
     * @param idSignalement
     * @param baseLocaleId
     * @returns any
     * @throws ApiError
     */
    public static getAuthor(
        idSignalement: string,
        baseLocaleId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/signalements/{baseLocaleId}/{idSignalement}/author',
            path: {
                'idSignalement': idSignalement,
                'baseLocaleId': baseLocaleId,
            },
        });
    }

}
