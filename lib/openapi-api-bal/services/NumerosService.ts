/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GenerateCertificatDTO } from '../models/GenerateCertificatDTO';
import type { Numero } from '../models/Numero';
import type { UpdateNumeroDTO } from '../models/UpdateNumeroDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NumerosService {

    /**
     * Find the numero by id
     * @param numeroId
     * @returns Numero
     * @throws ApiError
     */
    public static findNumero(
        numeroId: string,
    ): CancelablePromise<Numero> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/numeros/{numeroId}',
            path: {
                'numeroId': numeroId,
            },
        });
    }

    /**
     * Update the numero by id
     * @param numeroId
     * @param requestBody
     * @returns Numero
     * @throws ApiError
     */
    public static updateNumero(
        numeroId: string,
        requestBody: UpdateNumeroDTO,
    ): CancelablePromise<Numero> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/numeros/{numeroId}',
            path: {
                'numeroId': numeroId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete the numero by id
     * @param numeroId
     * @returns void
     * @throws ApiError
     */
    public static deleteNumero(
        numeroId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v2/numeros/{numeroId}',
            path: {
                'numeroId': numeroId,
            },
        });
    }

    /**
     * Generate the certificat of the numero by id
     * @param numeroId
     * @param requestBody
     * @returns binary PDF certificate file
     * @throws ApiError
     */
    public static generateCertificat(
        numeroId: string,
        requestBody: GenerateCertificatDTO,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/numeros/generate-certificat/{numeroId}',
            path: {
                'numeroId': numeroId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Soft delete the numero by id
     * @param numeroId
     * @returns Numero
     * @throws ApiError
     */
    public static softDeleteNumero(
        numeroId: string,
    ): CancelablePromise<Numero> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/numeros/{numeroId}/soft-delete',
            path: {
                'numeroId': numeroId,
            },
        });
    }

}
