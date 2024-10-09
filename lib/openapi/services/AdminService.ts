/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AdminService {

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

    /**
     * Get filaires voies from the published BALs
     * @returns any[]
     * @throws ApiError
     */
    public static getFilairesVoies(): CancelablePromise<Array<any[]>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/admin/filaires-voies',
        });
    }

}
