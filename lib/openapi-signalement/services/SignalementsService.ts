/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSignalementDTO } from '../models/CreateSignalementDTO';
import type { Signalement } from '../models/Signalement';
import type { UpdateSignalementDTO } from '../models/UpdateSignalementDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SignalementsService {

    /**
     * Get all signalements for a given codeCommune
     * @param codeCommune
     * @param sourceId
     * @param type
     * @param status
     * @param limit
     * @param page
     * @returns any[]
     * @throws ApiError
     */
    public static getSignalementsByCodeCommune(
        codeCommune: string,
        sourceId?: string,
        type?: 'LOCATION_TO_UPDATE' | 'LOCATION_TO_DELETE' | 'LOCATION_TO_CREATE' | 'OTHER',
        status?: 'PENDING' | 'IGNORED' | 'PROCESSED',
        limit?: number,
        page?: number,
    ): CancelablePromise<any[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/signalements/{codeCommune}',
            path: {
                'codeCommune': codeCommune,
            },
            query: {
                'sourceId': sourceId,
                'type': type,
                'status': status,
                'limit': limit,
                'page': page,
            },
        });
    }

    /**
     * Create a new signalement
     * @param requestBody
     * @returns Signalement
     * @throws ApiError
     */
    public static createSignalement(
        requestBody: CreateSignalementDTO,
    ): CancelablePromise<Signalement> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/signalements',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Update a given signalement
     * @param requestBody
     * @returns Signalement
     * @throws ApiError
     */
    public static updateSignalement(
        requestBody: UpdateSignalementDTO,
    ): CancelablePromise<Signalement> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/signalements',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
