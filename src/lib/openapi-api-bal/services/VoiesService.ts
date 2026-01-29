/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateNumeroDTO } from '../models/CreateNumeroDTO';
import type { ExtendedVoieDTO } from '../models/ExtendedVoieDTO';
import type { Numero } from '../models/Numero';
import type { RestoreVoieDTO } from '../models/RestoreVoieDTO';
import type { Toponyme } from '../models/Toponyme';
import type { UpdateVoieDTO } from '../models/UpdateVoieDTO';
import type { Voie } from '../models/Voie';
import type { VoieMetas } from '../models/VoieMetas';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class VoiesService {

    /**
     * Find Voie by id
     * @param voieId
     * @returns ExtendedVoieDTO
     * @throws ApiError
     */
    public static findVoie(
        voieId: string,
    ): CancelablePromise<ExtendedVoieDTO> {
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
        requestBody: UpdateVoieDTO,
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
     * Find Voie Metas by id
     * @param voieId
     * @returns VoieMetas
     * @throws ApiError
     */
    public static findVoieMetas(
        voieId: string,
    ): CancelablePromise<VoieMetas> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/voies/{voieId}/metas',
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
        requestBody: RestoreVoieDTO,
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
        requestBody: CreateNumeroDTO,
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

    /**
     * Certify Voie numeros in Bal
     * @param voieId
     * @returns any
     * @throws ApiError
     */
    public static certifyVoieNumeros(
        voieId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/voies/{voieId}/numeros/certify-all',
            path: {
                'voieId': voieId,
            },
        });
    }

    /**
     * Generate the arrete de numerotation by voie id
     * @param voieId
     * @param formData
     * @returns string URL of the generated PDF arrête de numérotation
     * @throws ApiError
     */
    public static generateArreteDeNumerotation(
        voieId: string,
        formData: {
            file?: Blob;
        },
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/voies/generate-arrete-de-numerotation/{voieId}',
            path: {
                'voieId': voieId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

}
