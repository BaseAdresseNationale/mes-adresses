/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HabilitationDTO } from '../models/HabilitationDTO';
import type { ValidatePinCodeDTO } from '../models/ValidatePinCodeDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HabilitationService {

    /**
     * Find habiliation is Valid
     * @param baseLocaleId
     * @returns boolean
     * @throws ApiError
     */
    public static findIsValid(
        baseLocaleId: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/bases-locales/{baseLocaleId}/habilitation/is-valid',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Find habiliation
     * @param baseLocaleId
     * @returns HabilitationDTO
     * @throws ApiError
     */
    public static findHabilitation(
        baseLocaleId: string,
    ): CancelablePromise<HabilitationDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/bases-locales/{baseLocaleId}/habilitation',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Create habiliation
     * @param baseLocaleId
     * @returns HabilitationDTO
     * @throws ApiError
     */
    public static createHabilitation(
        baseLocaleId: string,
    ): CancelablePromise<HabilitationDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/{baseLocaleId}/habilitation',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Send pin code of habilitation
     * @param baseLocaleId
     * @returns any
     * @throws ApiError
     */
    public static sendPinCodeHabilitation(
        baseLocaleId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/{baseLocaleId}/habilitation/email/send-pin-code',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

    /**
     * Valide pin code of habiliation
     * @param baseLocaleId
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static validePinCodeHabilitation(
        baseLocaleId: string,
        requestBody: ValidatePinCodeDTO,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/{baseLocaleId}/habilitation/email/validate-pin-code',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
