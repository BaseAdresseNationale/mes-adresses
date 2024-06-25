/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseLocale } from '../models/BaseLocale';
import type { FusionCommunesDTO } from '../models/FusionCommunesDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AdminService {

    /**
     * Fusion communes
     * @param requestBody
     * @returns BaseLocale
     * @throws ApiError
     */
    public static fusionCommunes(
        requestBody: FusionCommunesDTO,
    ): CancelablePromise<Array<BaseLocale>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/admin/fusion-communes',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * download email.csv
     * @returns any
     * @throws ApiError
     */
    public static downloadEmailCsv(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/admin/emails.csv',
        });
    }

}
