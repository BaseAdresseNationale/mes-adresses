/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { ExtentedToponymeDTO } from '../models/ExtentedToponymeDTO';
import type { Numero } from '../models/Numero';
import type { Toponyme } from '../models/Toponyme';
import type { UpdateToponymeDTO } from '../models/UpdateToponymeDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ToponymesService {
    /**
     * Find Toponyme by id
     * @param toponymeId
     * @returns ExtentedToponymeDTO
     * @throws ApiError
     */
    public static findToponyme(
        toponymeId: string,
    ): CancelablePromise<ExtentedToponymeDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/toponymes/{toponymeId}',
            path: {
                'toponymeId': toponymeId,
            },
        });
    }
    /**
     * Update Toponyme by id
     * @param toponymeId
     * @param requestBody
     * @returns Toponyme
     * @throws ApiError
     */
    public static updateToponyme(
        toponymeId: string,
        requestBody: UpdateToponymeDTO,
    ): CancelablePromise<Toponyme> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/toponymes/{toponymeId}',
            path: {
                'toponymeId': toponymeId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete Toponyme by id
     * @param toponymeId
     * @returns void
     * @throws ApiError
     */
    public static deleteToponyme(
        toponymeId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v2/toponymes/{toponymeId}',
            path: {
                'toponymeId': toponymeId,
            },
        });
    }
    /**
     * Soft delete Tpponyme by id
     * @param toponymeId
     * @returns Toponyme
     * @throws ApiError
     */
    public static softDeleteToponyme(
        toponymeId: string,
    ): CancelablePromise<Toponyme> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/toponymes/{toponymeId}/soft-delete',
            path: {
                'toponymeId': toponymeId,
            },
        });
    }
    /**
     * Restore Toponyme by id
     * @param toponymeId
     * @returns Toponyme
     * @throws ApiError
     */
    public static restoreToponyme(
        toponymeId: string,
    ): CancelablePromise<Toponyme> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/toponymes/{toponymeId}/restore',
            path: {
                'toponymeId': toponymeId,
            },
        });
    }
    /**
     * Find all numeros which belong to the toponyme
     * @param toponymeId
     * @returns Numero
     * @throws ApiError
     */
    public static findToponymeNumeros(
        toponymeId: string,
    ): CancelablePromise<Array<Numero>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/toponymes/{toponymeId}/numeros',
            path: {
                'toponymeId': toponymeId,
            },
        });
    }
}
