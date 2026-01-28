/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseLocale } from '../models/BaseLocale';
import type { FusionCommunesDTO } from '../models/FusionCommunesDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AdminService {

    /**
     * Fusion communes
     * @param requestBody
     * {
         * "codeCommune": "08439",
         * "nom": "BAL Tannay-le-Mont-Dieu (08439)",
         * "emails": [
             * "adresse@data.gouv.fr"
             * ],
             * "communes": [
                 * {
                     * "codeCommune": "08300"
                     * },
                     * {
                         * "codeCommune": "08439",
                         * "balId": "679bac11cba48267afdca26b"
                         * }
                         * ]
                         * }
                         * @returns BaseLocale
                         * @throws ApiError
                         */
                        public static fusionCommunes(
                            requestBody: FusionCommunesDTO,
                        ): CancelablePromise<Array<BaseLocale>> {
                            return __request(OpenAPI, {
                                method: 'POST',
                                url: '/v2/admin/fusion-communes',
                                body: requestBody,
                                mediaType: 'application/json',
                            });
                        }

                    }
