/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NumeroDto } from '../models/NumeroDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NumerosService {

    /**
     * @param numeroId
     * @returns NumeroDto Numero trouvé.
     * @throws ApiError
     */
    public static numerosControllerFind(
        numeroId: string,
    ): CancelablePromise<NumeroDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/numeros/{numeroId}',
            path: {
                'numeroId': numeroId,
            },
        });
    }

}
