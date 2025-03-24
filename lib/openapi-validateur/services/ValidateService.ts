/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileUploadDTO } from '../models/FileUploadDTO';
import type { ValidateProfileDTO } from '../models/ValidateProfileDTO';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ValidateService {

    /**
     * Validate File
     * @param formData
     * @returns ValidateProfileDTO
     * @throws ApiError
     */
    public static validateFile(
        formData: FileUploadDTO,
    ): CancelablePromise<ValidateProfileDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/validate/file',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

}
