/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AuthorDTO } from './AuthorDTO';
import type { ExistingLocation } from './ExistingLocation';

export type CreateSignalementDTO = {
    codeCommune: string;
    type: CreateSignalementDTO.type;
    author?: AuthorDTO | null;
    existingLocation?: ExistingLocation | null;
    changesRequested: Record<string, any> | null;
};

export namespace CreateSignalementDTO {

    export enum type {
        LOCATION_TO_UPDATE = 'LOCATION_TO_UPDATE',
        LOCATION_TO_DELETE = 'LOCATION_TO_DELETE',
        LOCATION_TO_CREATE = 'LOCATION_TO_CREATE',
        OTHER = 'OTHER',
    }


}

