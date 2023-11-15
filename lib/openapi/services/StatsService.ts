/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseLocale } from '../models/BaseLocale';
import type { BasesLocalesCreationDto } from '../models/BasesLocalesCreationDto';
import type { BasesLocalesStatusDto } from '../models/BasesLocalesStatusDto';
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
     * @returns BasesLocalesStatusDto
     * @throws ApiError
     */
    public static findBalsStatusStats(): CancelablePromise<Array<BasesLocalesStatusDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/stats/bals/status',
        });
    }

    /**
     * Find all created Bals between date
     * @param from
     * @param to
     * @returns BasesLocalesCreationDto
     * @throws ApiError
     */
    public static findBalsCreationStats(
        from: string,
        to: string,
    ): CancelablePromise<Array<BasesLocalesCreationDto>> {
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
