/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateNumeroDto } from '../models/CreateNumeroDto';
import type { ExtendedVoie } from '../models/ExtendedVoie';
import type { Numero } from '../models/Numero';
import type { RestoreVoieDto } from '../models/RestoreVoieDto';
import type { Toponyme } from '../models/Toponyme';
import type { UpdateVoieDto } from '../models/UpdateVoieDto';
import type { Voie } from '../models/Voie';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class VoiesService {

    /**
     * Find Voie by id
     * @param voieId
     * @returns ExtendedVoie
     * @throws ApiError
     */
    public static findVoie(
        voieId: string,
    ): CancelablePromise<ExtendedVoie> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/voies/{voieId}',
            path: {
                'voieId': voieId,
            },
        });
    }

    /**
     * Update Voie by id
     * @param voieId
     * @param requestBody
     * @returns Voie
     * @throws ApiError
     */
    public static updateVoie(
        voieId: string,
        requestBody: UpdateVoieDto,
    ): CancelablePromise<Voie> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/voies/{voieId}',
            path: {
                'voieId': voieId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete Voie by id
     * @param voieId
     * @returns void
     * @throws ApiError
     */
    public static deleteVoie(
        voieId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v2/voies/{voieId}',
            path: {
                'voieId': voieId,
            },
        });
    }

    /**
     * Soft delete Voie by id
     * @param voieId
     * @returns Voie
     * @throws ApiError
     */
    public static softDeleteVoie(
        voieId: string,
    ): CancelablePromise<Voie> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/voies/{voieId}/soft-delete',
            path: {
                'voieId': voieId,
            },
        });
    }

    /**
     * Restore Voie by id
     * @param voieId
     * @param requestBody
     * @returns Voie
     * @throws ApiError
     */
    public static restoreVoie(
        voieId: string,
        requestBody: RestoreVoieDto,
    ): CancelablePromise<Voie> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/voies/{voieId}/restore',
            path: {
                'voieId': voieId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Find all numeros which belong to the voie
     * @param voieId
     * @param isdeleted
     * @returns Numero
     * @throws ApiError
     */
    public static findVoieNumeros(
        voieId: string,
        isdeleted?: boolean,
    ): CancelablePromise<Array<Numero>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/voies/{voieId}/numeros',
            path: {
                'voieId': voieId,
            },
            query: {
                'isdeleted': isdeleted,
            },
        });
    }

    /**
     * Create numero on the voie
     * @param voieId
     * @param requestBody
     * @returns Numero
     * @throws ApiError
     */
    public static createNumero(
        voieId: string,
        requestBody: CreateNumeroDto,
    ): CancelablePromise<Numero> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/voies/{voieId}/numeros',
            path: {
                'voieId': voieId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Convert Voie (without numeros) to Toponyme
     * @param voieId
     * @returns Toponyme
     * @throws ApiError
     */
    public static convertToToponyme(
        voieId: string,
    ): CancelablePromise<Toponyme> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/voies/{voieId}/convert-to-toponyme',
            path: {
                'voieId': voieId,
            },
        });
    }

}
