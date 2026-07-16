/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProconnectService {
    /**
     * Initiate ProConnect login
     * @returns any
     * @throws ApiError
     */
    public static proConnectLogin(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/proconnect/login',
        });
    }
    /**
     * ProConnect login callback
     * @param code
     * @param state
     * @returns any
     * @throws ApiError
     */
    public static proConnectLoginCallback(
        code: string,
        state: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/proconnect/callback',
            query: {
                'code': code,
                'state': state,
            },
        });
    }
    /**
     * Initiate ProConnect logout
     * @param idToken
     * @returns any
     * @throws ApiError
     */
    public static proConnectLogout(
        idToken: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/proconnect/logout',
            query: {
                'idToken': idToken,
            },
        });
    }
}
