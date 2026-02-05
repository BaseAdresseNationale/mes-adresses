/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { UpdateManySignalementDTO } from '../models/UpdateManySignalementDTO';
import type { UpdateOneSignalementDTO } from '../models/UpdateOneSignalementDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SignalementsService {
    /**
     * Update one signalement
     * @param signalementId
     * @param baseLocaleId
     * @param requestBody
     * @returns boolean
     * @throws ApiError
     */
    public static updateSignalement(
        signalementId: string,
        baseLocaleId: string,
        requestBody: UpdateOneSignalementDTO,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/signalements/{baseLocaleId}/{signalementId}',
            path: {
                'signalementId': signalementId,
                'baseLocaleId': baseLocaleId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Update many signalements
     * @param baseLocaleId
     * @param requestBody
     * @returns boolean
     * @throws ApiError
     */
    public static updateSignalements(
        baseLocaleId: string,
        requestBody: UpdateManySignalementDTO,
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
