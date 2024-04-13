/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Author } from './Author';
import type { ChangesRequested } from './ChangesRequested';
import type { ExistingNumero } from './ExistingNumero';
import type { ExistingToponyme } from './ExistingToponyme';
import type { ExistingVoie } from './ExistingVoie';
import type { ObjectId } from './ObjectId';

export type Signalement = {
    _id: ObjectId;
    _created: string;
    _updated: string;
    _deleted?: string | null;
    codeCommune: string;
    type: Signalement.type;
    author?: Author | null;
    existingLocation?: (ExistingNumero | ExistingVoie | ExistingToponyme) | null;
    changesRequested: ChangesRequested;
    processedAt?: string | null;
};

export namespace Signalement {

    export enum type {
        LOCATION_TO_UPDATE = 'LOCATION_TO_UPDATE',
        LOCATION_TO_DELETE = 'LOCATION_TO_DELETE',
        LOCATION_TO_CREATE = 'LOCATION_TO_CREATE',
        OTHER = 'OTHER',
    }


}

