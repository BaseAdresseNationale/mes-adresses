/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSignalementDTO } from '../models/CreateSignalementDTO';
import type { PaginatedSignalementsDTO } from '../models/PaginatedSignalementsDTO';
import type { Signalement } from '../models/Signalement';
import type { UpdateSignalementDTO } from '../models/UpdateSignalementDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SignalementsService {

    /**
     * Get signalements
     * @param codeCommune
     * @param sourceId
     * @param type
     * @param status
     * @param limit
     * @param page
     * @returns PaginatedSignalementsDTO
     * @throws ApiError
     */
    public static getSignalements(
        codeCommune?: string,
        sourceId?: string,
        type?: 'LOCATION_TO_UPDATE' | 'LOCATION_TO_DELETE' | 'LOCATION_TO_CREATE' | 'OTHER',
        status?: 'PENDING' | 'IGNORED' | 'PROCESSED',
        limit?: number,
        page?: number,
    ): CancelablePromise<PaginatedSignalementsDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/signalements',
            query: {
                'codeCommune': codeCommune,
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
     * @param sourceId
     * @returns Signalement
     * @throws ApiError
     */
    public static createSignalement(
        requestBody: CreateSignalementDTO,
        sourceId?: string,
    ): CancelablePromise<Signalement> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/signalements',
            query: {
                'sourceId': sourceId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get signalement by id
     * @param idSignalement
     * @returns Signalement
     * @throws ApiError
     */
    public static getSignalementById(
        idSignalement: string,
    ): CancelablePromise<Signalement> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/signalements/{idSignalement}',
            path: {
                'idSignalement': idSignalement,
            },
        });
    }

    /**
     * Update a given signalement
     * @param idSignalement
     * @param requestBody
     * @returns Signalement
     * @throws ApiError
     */
    public static updateSignalement(
        idSignalement: string,
        requestBody: UpdateSignalementDTO,
    ): CancelablePromise<Signalement> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/signalements/{idSignalement}',
            path: {
                'idSignalement': idSignalement,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
