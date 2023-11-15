/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ValidatePinCodeDTO } from '../models/ValidatePinCodeDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HabilitationService {

    /**
     * Find habiliation
     * @param baseLocaleId
     * @param token
     * @returns any
     * @throws ApiError
     */
    public static findHabilitation(
        baseLocaleId: string,
        token?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/bases-locales/{baseLocaleId}/habilitation',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            headers: {
                'Token': token,
            },
        });
    }

    /**
     * Create habiliation
     * @param baseLocaleId
     * @param token
     * @returns any
     * @throws ApiError
     */
    public static createHabilitation(
        baseLocaleId: string,
        token?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/{baseLocaleId}/habilitation',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            headers: {
                'Token': token,
            },
        });
    }

    /**
     * Send pin code of habilitation
     * @param baseLocaleId
     * @param token
     * @returns any
     * @throws ApiError
     */
    public static sendPinCodeHabilitation(
        baseLocaleId: string,
        token?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/{baseLocaleId}/habilitation/email/send-pin-code',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            headers: {
                'Token': token,
            },
        });
    }

    /**
     * Valide pin code of habiliation
     * @param baseLocaleId
     * @param requestBody
     * @param token
     * @returns any
     * @throws ApiError
     */
    public static validePinCodeHabilitation(
        baseLocaleId: string,
        requestBody: ValidatePinCodeDTO,
        token?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/bases-locales/{baseLocaleId}/habilitation/email/validate-pin-code',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            headers: {
                'Token': token,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
