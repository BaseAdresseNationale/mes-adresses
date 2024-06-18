/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSourceDTO } from '../models/CreateSourceDTO';
import type { Source } from '../models/Source';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SourcesService {

    /**
     * Get all sources
     * @param type
     * @returns any[]
     * @throws ApiError
     */
    public static getSources(
        type?: 'PUBLIC' | 'PRIVATE',
    ): CancelablePromise<any[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sources',
            query: {
                'type': type,
            },
        });
    }

    /**
     * Create a new source
     * @param requestBody
     * @returns Source
     * @throws ApiError
     */
    public static createSource(
        requestBody: CreateSourceDTO,
    ): CancelablePromise<Source> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sources',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get source by id
     * @param id
     * @returns Source
     * @throws ApiError
     */
    public static getSourceById(
        id: string,
    ): CancelablePromise<Source> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sources/{id}',
            path: {
                'id': id,
            },
        });
    }

}
