/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ExportCsvService {

    /**
     * Get Bal csv file
     * @param withComment
     * @param baseLocaleId
     * @returns any
     * @throws ApiError
     */
    public static getCsvBal(
        withComment: boolean,
        baseLocaleId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/bases-locales/{baseLocaleId}/csv',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            query: {
                'withComment': withComment,
            },
        });
    }

    /**
     * Get voies csv file
     * @param baseLocaleId
     * @returns any
     * @throws ApiError
     */
    public static getCsvVoies(
        baseLocaleId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/bases-locales/{baseLocaleId}/voies/csv',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

}
