/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateManyReportsDTO } from '../models/UpdateManyReportsDTO';
import type { UpdateOneReportDTO } from '../models/UpdateOneReportDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SignalementsService {
    /**
     * Get report by id
     * @param reportId
     * @param baseLocaleId
     * @returns any
     * @throws ApiError
     */
    public static getReport(
        reportId: string,
        baseLocaleId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v2/signalements/{baseLocaleId}/{reportId}',
            path: {
                'reportId': reportId,
                'baseLocaleId': baseLocaleId,
            },
        });
    }
    /**
     * Update one report
     * @param reportId
     * @param baseLocaleId
     * @param requestBody
     * @returns boolean
     * @throws ApiError
     */
    public static updateReport(
        reportId: string,
        baseLocaleId: string,
        requestBody: UpdateOneReportDTO,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/signalements/{baseLocaleId}/{reportId}',
            path: {
                'reportId': reportId,
                'baseLocaleId': baseLocaleId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Update many reports
     * @param baseLocaleId
     * @param requestBody
     * @returns boolean
     * @throws ApiError
     */
    public static updateReports(
        baseLocaleId: string,
        requestBody: UpdateManyReportsDTO,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v2/signalements/{baseLocaleId}',
            path: {
                'baseLocaleId': baseLocaleId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
