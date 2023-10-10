/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Numero } from '../models/Numero';
import type { UpdateNumeroDto } from '../models/UpdateNumeroDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NumerosService {

    /**
     * @param numeroId
     * @param token
     * @returns Numero
     * @throws ApiError
     */
    public static numeroControllerFind(
        numeroId: string,
        token?: string,
    ): CancelablePromise<Numero> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/numeros/{numeroId}',
            path: {
                'numeroId': numeroId,
            },
            headers: {
                'Token': token,
            },
        });
    }

    /**
     * @param numeroId
     * @param requestBody
     * @param token
     * @returns Numero
     * @throws ApiError
     */
    public static numeroControllerUpdate(
        numeroId: string,
        requestBody: UpdateNumeroDto,
        token?: string,
    ): CancelablePromise<Numero> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/numeros/{numeroId}',
            path: {
                'numeroId': numeroId,
            },
            headers: {
                'Token': token,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
