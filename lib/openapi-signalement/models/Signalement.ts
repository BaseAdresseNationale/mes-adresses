/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Author } from './Author';
import type { ChangesRequested } from './ChangesRequested';
import type { Client } from './Client';
import type { ExistingNumero } from './ExistingNumero';
import type { ExistingToponyme } from './ExistingToponyme';
import type { ExistingVoie } from './ExistingVoie';
import type { ObjectId } from './ObjectId';
import type { Source } from './Source';

export type Signalement = {
    _id: ObjectId;
    _createdAt: number;
    _updatedAt: number;
    _deletedAt?: number | null;
    codeCommune: string;
    type: Signalement.type;
    author?: Author | null;
    source: Source;
    existingLocation?: (ExistingNumero | ExistingVoie | ExistingToponyme) | null;
    changesRequested: ChangesRequested;
    status?: Signalement.status | null;
    processedBy?: Client | null;
};

export namespace Signalement {

    export enum type {
        LOCATION_TO_UPDATE = 'LOCATION_TO_UPDATE',
        LOCATION_TO_DELETE = 'LOCATION_TO_DELETE',
        LOCATION_TO_CREATE = 'LOCATION_TO_CREATE',
        OTHER = 'OTHER',
    }

    export enum status {
        PENDING = 'PENDING',
        IGNORED = 'IGNORED',
        PROCESSED = 'PROCESSED',
    }


}

