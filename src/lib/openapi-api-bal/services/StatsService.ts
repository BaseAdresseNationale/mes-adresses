/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseLocale } from '../models/BaseLocale';
import type { BasesLocalesCreationDTO } from '../models/BasesLocalesCreationDTO';
import type { BasesLocalesStatusDTO } from '../models/BasesLocalesStatusDTO';
import type { CodeCommuneDTO } from '../models/CodeCommuneDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StatsService {
    /**
     * Find all Bals (filtered by codeCommune)
     * @param requestBody
     * @param fields
     * @returns BaseLocale
     * @throws ApiError
     */
    public static findBalsStats(
        requestBody: CodeCommuneDTO,
        fields?: Array<string>,
    ): CancelablePromise<Array<BaseLocale>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/stats/bals',
            query: {
                'fields': fields,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Find all Bals status
     * @returns BasesLocalesStatusDTO
     * @throws ApiError
     */
    public static findBalsStatusStats(): CancelablePromise<Array<BasesLocalesStatusDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/stats/bals/status',
        });
    }
    /**
     * Find all created Bals between date
     * @param from
     * @param to
     * @returns BasesLocalesCreationDTO
     * @throws ApiError
     */
    public static findBalsCreationStats(
        from: string,
        to: string,
    ): CancelablePromise<Array<BasesLocalesCreationDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/stats/bals/creations',
            query: {
                'from': from,
                'to': to,
            },
        });
    }
}
