/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HabilitationDTO } from '../models/HabilitationDTO';
import type { SendPinCodeResponseDTO } from '../models/SendPinCodeResponseDTO';
import type { ValidatePinCodeDTO } from '../models/ValidatePinCodeDTO';
import type { ValidatePinCodeResponseDTO } from '../models/ValidatePinCodeResponseDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HabilitationService {

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
     * @returns SendPinCodeResponseDTO
     * @throws ApiError
     */
    public static sendPinCodeHabilitation(
        baseLocaleId: string,
    ): CancelablePromise<SendPinCodeResponseDTO> {
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
     * @returns ValidatePinCodeResponseDTO
     * @throws ApiError
     */
    public static validePinCodeHabilitation(
        baseLocaleId: string,
        requestBody: ValidatePinCodeDTO,
    ): CancelablePromise<ValidatePinCodeResponseDTO> {
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
