/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Alert } from '../models/Alert';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AlertsService {

    /**
     * Compute alerts on a BAL
     * @param baseLocaleId
     * @returns Alert
     * @throws ApiError
     */
    public static computeAlertBal(
        baseLocaleId: string,
    ): CancelablePromise<Array<Alert>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v2/alerts/{baseLocaleId}/compute',
            path: {
                'baseLocaleId': baseLocaleId,
            },
        });
    }

}
