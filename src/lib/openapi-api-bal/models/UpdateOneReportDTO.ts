/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateOneReportDTO = {
    status: UpdateOneReportDTO.status;
    rejectionReason?: string | null;
};
export namespace UpdateOneReportDTO {
    export enum status {
        PENDING = 'PENDING',
        IGNORED = 'IGNORED',
        PROCESSED = 'PROCESSED',
        EXPIRED = 'EXPIRED',
    }
}

