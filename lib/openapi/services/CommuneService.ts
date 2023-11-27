/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommuneExtraDTO } from '../models/CommuneExtraDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CommuneService {

    /**
     * Find info commune
     * @param codeCommune
     * @returns CommuneExtraDTO
     * @throws ApiError
     */
    public static findCommune(
        codeCommune: string,
    ): CancelablePromise<CommuneExtraDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/commune/{codeCommune}',
            path: {
                'codeCommune': codeCommune,
            },
        });
    }

}
