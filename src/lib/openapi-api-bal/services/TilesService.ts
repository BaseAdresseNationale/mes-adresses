/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TilesService {
    /**
     * Get tile (with voies and numeros features)
     * @param z
     * @param x
     * @param y
     * @param baseLocaleId
     * @returns any
     * @throws ApiError
     */
    public static getBaseLocaleTile(
        z: string,
        x: string,
        y: string,
        baseLocaleId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/bases-locales/{baseLocaleId}/tiles/{z}/{x}/{y}.pbf',
            path: {
                'z': z,
                'x': x,
                'y': y,
                'baseLocaleId': baseLocaleId,
            },
        });
    }
}
