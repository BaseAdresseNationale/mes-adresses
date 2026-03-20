/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MissingAddressContextDTO } from './MissingAddressContextDTO';
export type UpdateOneReportDTO = {
    status: UpdateOneReportDTO.status;
    rejectionReason?: string | null;
    context?: MissingAddressContextDTO | null;
};
export namespace UpdateOneReportDTO {
    export enum status {
        PENDING = 'PENDING',
        IGNORED = 'IGNORED',
        PROCESSED = 'PROCESSED',
        EXPIRED = 'EXPIRED',
    }
}

