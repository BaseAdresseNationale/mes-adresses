/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllDeletedInBalDTO } from '../models/AllDeletedInBalDTO';
import type { BaseLocale } from '../models/BaseLocale';
import type { BatchNumeroResponseDTO } from '../models/BatchNumeroResponseDTO';
import type { CreateBaseLocaleDTO } from '../models/CreateBaseLocaleDTO';
import type { CreateDemoBaseLocaleDTO } from '../models/CreateDemoBaseLocaleDTO';
import type { CreateToponymeDTO } from '../models/CreateToponymeDTO';
import type { CreateVoieDTO } from '../models/CreateVoieDTO';
import type { DeleteBatchNumeroDTO } from '../models/DeleteBatchNumeroDTO';
import type { ExtendedBaseLocaleDTO } from '../models/ExtendedBaseLocaleDTO';
import type { ExtendedVoieDTO } from '../models/ExtendedVoieDTO';
import type { ExtentedToponymeDTO } from '../models/ExtentedToponymeDTO';
import type { ImportFileBaseLocaleDTO } from '../models/ImportFileBaseLocaleDTO';
import type { Numero } from '../models/Numero';
import type { PageBaseLocaleDTO } from '../models/PageBaseLocaleDTO';
import type { RecoverBaseLocaleDTO } from '../models/RecoverBaseLocaleDTO';
import type { SearchNumeroDTO } from '../models/SearchNumeroDTO';
import type { Toponyme } from '../models/Toponyme';
import type { UpdateBaseLocaleDemoDTO } from '../models/UpdateBaseLocaleDemoDTO';
import type { UpdateBaseLocaleDTO } from '../models/UpdateBaseLocaleDTO';
import type { UpdateBatchNumeroDTO } from '../models/UpdateBatchNumeroDTO';
import type { Voie } from '../models/Voie';
import type { VoieMetas } from '../models/VoieMetas';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BasesLocalesService {

    /**
     * Create a base locale
     * @param requestBody
     * @returns BaseLocale
     * @throws ApiError
     */
    public static createBaseLocale(
        requestBody: CreateBaseLocaleDTO,
    ): CancelablePromise<BaseLocale> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Create a base locale
     * @param requestBody
     * @returns BaseLocale
     * @throws ApiError
     */
    public static createBaseLocaleDemo(
        requestBody: CreateDemoBaseLocaleDTO,
    ): CancelablePromise<BaseLocale> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/create-demo',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Search BAL by filters
     * @param limit
     * @param offset
     * @param deleted
     * @param commune
     * @param email
     * @param status
     * @returns PageBaseLocaleDTO
     * @throws ApiError
     */
    public static searchBaseLocale(
        limit?: string,
        offset?: string,
        deleted?: string,
        commune?: string,
        email?: string,
        status?: string,
    ): CancelablePromise<PageBaseLocaleDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/bases-locales/search',
            query: {
                'limit': limit,
                'offset': offset,
                'deleted': deleted,
                'commune': commune,
                'email': email,
                'status': status,
            },
        });
    }

    /**
     * Find Base_Locale by id
     * @param baseLocaleId
     * @param isExist
     * @returns ExtendedBaseLocaleDTO
     * @throws ApiError
     */
    public static findBaseLocale(
        baseLocaleId: string,
        isExist?: boolean,
    ): CancelablePromise<ExtendedBaseLocaleDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/bases-locales/{baseLocaleId}',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            query: {
                'isExist': isExist,
            },
        });
    }

    /**
     * Update one base locale
     * @param baseLocaleId
     * @param requestBody
     * @returns BaseLocale
     * @throws ApiError
     */
    public static updateBaseLocale(
        baseLocaleId: string,
        requestBody: UpdateBaseLocaleDTO,
    ): CancelablePromise<BaseLocale> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/bases-locales/{baseLocaleId}',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete one base locale
     * @param baseLocaleId
     * @returns void
     * @throws ApiError
     */
    public static deleteBaseLocale(
        baseLocaleId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v2/bases-locales/{baseLocaleId}',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Update one base locale status to draft
     * @param baseLocaleId
     * @param requestBody
     * @returns BaseLocale
     * @throws ApiError
     */
    public static updateBaseLocaleDemoToDraft(
        baseLocaleId: string,
        requestBody: UpdateBaseLocaleDemoDTO,
    ): CancelablePromise<BaseLocale> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/bases-locales/{baseLocaleId}/transform-to-draft',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Upload a CSV BAL file
     * @param baseLocaleId
     * @param formData
     * @returns ImportFileBaseLocaleDTO
     * @throws ApiError
     */
    public static uploadCsvBalFile(
        baseLocaleId: string,
        formData: {
            file?: Blob;
        },
    ): CancelablePromise<ImportFileBaseLocaleDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/{baseLocaleId}/upload',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * Recover BAL access
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static recoveryBasesLocales(
        requestBody: RecoverBaseLocaleDTO,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/recovery',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Restore deleted BAL
     * @param token
     * @param baseLocaleId
     * @returns void
     * @throws ApiError
     */
    public static recoveryBaseLocale(
        token: string,
        baseLocaleId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/bases-locales/{baseLocaleId}/{token}/recovery',
            path: {
                'token': token,
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Populate Base Locale
     * @param baseLocaleId
     * @returns BaseLocale
     * @throws ApiError
     */
    public static populateBaseLocale(
        baseLocaleId: string,
    ): CancelablePromise<BaseLocale> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/{baseLocaleId}/populate',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Is populate Base Locale
     * @param baseLocaleId
     * @returns boolean
     * @throws ApiError
     */
    public static isPopulatingBaseLocale(
        baseLocaleId: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/{baseLocaleId}/is_populating',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Renew Base Locale token
     * @param baseLocaleId
     * @returns BaseLocale
     * @throws ApiError
     */
    public static renewTokenBaseLocale(
        baseLocaleId: string,
    ): CancelablePromise<BaseLocale> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/{baseLocaleId}/token/renew',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Find Base_Locale parcelles
     * @param baseLocaleId
     * @returns string
     * @throws ApiError
     */
    public static findBaseLocaleParcelles(
        baseLocaleId: string,
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/bases-locales/{baseLocaleId}/parcelles',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Publish base locale
     * @param baseLocaleId
     * @returns BaseLocale
     * @throws ApiError
     */
    public static publishBaseLocale(
        baseLocaleId: string,
    ): CancelablePromise<BaseLocale> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/{baseLocaleId}/sync/exec',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Update isPaused sync BAL to true
     * @param baseLocaleId
     * @returns boolean
     * @throws ApiError
     */
    public static pauseBaseLocale(
        baseLocaleId: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/{baseLocaleId}/sync/pause',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Update isPaused sync BAL to false
     * @param baseLocaleId
     * @returns boolean
     * @throws ApiError
     */
    public static resumeBaseLocale(
        baseLocaleId: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/{baseLocaleId}/sync/resume',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Find all model deleted in Bal
     * @param baseLocaleId
     * @returns AllDeletedInBalDTO
     * @throws ApiError
     */
    public static findAllDeleted(
        baseLocaleId: string,
    ): CancelablePromise<AllDeletedInBalDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/bases-locales/{baseLocaleId}/all/deleted',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Search numero
     * @param baseLocaleId
     * @param requestBody
     * @returns Numero
     * @throws ApiError
     */
    public static searchNumeros(
        baseLocaleId: string,
        requestBody: SearchNumeroDTO,
    ): CancelablePromise<Array<Numero>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/bases-locales/{baseLocaleId}/numeros',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Multi update numeros
     * @param baseLocaleId
     * @param requestBody
     * @returns BatchNumeroResponseDTO
     * @throws ApiError
     */
    public static updateNumeros(
        baseLocaleId: string,
        requestBody: UpdateBatchNumeroDTO,
    ): CancelablePromise<BatchNumeroResponseDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/bases-locales/{baseLocaleId}/numeros/batch',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Multi delete numeros
     * @param baseLocaleId
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static deleteNumeros(
        baseLocaleId: string,
        requestBody: DeleteBatchNumeroDTO,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v2/bases-locales/{baseLocaleId}/numeros/batch',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Multi soft delete numeros
     * @param baseLocaleId
     * @param requestBody
     * @returns BatchNumeroResponseDTO
     * @throws ApiError
     */
    public static softDeleteNumeros(
        baseLocaleId: string,
        requestBody: DeleteBatchNumeroDTO,
    ): CancelablePromise<BatchNumeroResponseDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/bases-locales/{baseLocaleId}/numeros/batch/soft-delete',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Find all Voie in Bal
     * @param baseLocaleId
     * @returns ExtendedVoieDTO
     * @throws ApiError
     */
    public static findBaseLocaleVoies(
        baseLocaleId: string,
    ): CancelablePromise<Array<ExtendedVoieDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/bases-locales/{baseLocaleId}/voies',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Create Voie in Bal
     * @param baseLocaleId
     * @param requestBody
     * @returns Voie
     * @throws ApiError
     */
    public static createVoie(
        baseLocaleId: string,
        requestBody: CreateVoieDTO,
    ): CancelablePromise<Voie> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/{baseLocaleId}/voies',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * get geojson of filaires voies
     * @param baseLocaleId
     * @returns any
     * @throws ApiError
     */
    public static findFilairesVoiesGeoJson(
        baseLocaleId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/bases-locales/{baseLocaleId}/voies/geojson',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Find all Metas Voie in Bal
     * @param baseLocaleId
     * @returns VoieMetas
     * @throws ApiError
     */
    public static findVoieMetasByBal(
        baseLocaleId: string,
    ): CancelablePromise<Array<VoieMetas>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/bases-locales/{baseLocaleId}/voies/metas',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Find all Toponymes in Bal
     * @param baseLocaleId
     * @returns ExtentedToponymeDTO
     * @throws ApiError
     */
    public static findBaseLocaleToponymes(
        baseLocaleId: string,
    ): CancelablePromise<Array<ExtentedToponymeDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/bases-locales/{baseLocaleId}/toponymes',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Create Toponyme in Bal
     * @param baseLocaleId
     * @param requestBody
     * @returns Toponyme
     * @throws ApiError
     */
    public static createToponyme(
        baseLocaleId: string,
        requestBody: CreateToponymeDTO,
    ): CancelablePromise<Toponyme> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/{baseLocaleId}/toponymes',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
