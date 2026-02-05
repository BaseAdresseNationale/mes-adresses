/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { CommuneDTO } from '../models/CommuneDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CommuneService {
    /**
     * Find info commune
     * @param codeCommune
     * @returns CommuneDTO
     * @throws ApiError
     */
    public static findCommune(
        codeCommune: string,
    ): CancelablePromise<CommuneDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/commune/{codeCommune}',
            path: {
                'codeCommune': codeCommune,
            },
        });
    }
}
