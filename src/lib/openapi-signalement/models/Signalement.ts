/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Author } from './Author';
import type { Client } from './Client';
import type { DeleteNumeroChangesRequestedDTO } from './DeleteNumeroChangesRequestedDTO';
import type { ExistingNumero } from './ExistingNumero';
import type { ExistingToponyme } from './ExistingToponyme';
import type { ExistingVoie } from './ExistingVoie';
import type { NumeroChangesRequestedDTO } from './NumeroChangesRequestedDTO';
import type { Source } from './Source';
import type { ToponymeChangesRequestedDTO } from './ToponymeChangesRequestedDTO';
import type { VoieChangesRequestedDTO } from './VoieChangesRequestedDTO';
export type Signalement = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    codeCommune: string;
    nomCommune?: string | null;
    type: Signalement.type;
    author?: Author | null;
    status: Signalement.status;
    point: Record<string, any>;
    source: Source;
    processedBy?: Client | null;
    rejectionReason?: string;
    reportKind: Signalement.reportKind;
    existingLocation?: (ExistingNumero | ExistingVoie | ExistingToponyme) | null;
    changesRequested: (NumeroChangesRequestedDTO | DeleteNumeroChangesRequestedDTO | ToponymeChangesRequestedDTO | VoieChangesRequestedDTO);
};
export namespace Signalement {
    export enum type {
        LOCATION_TO_UPDATE = 'LOCATION_TO_UPDATE',
        LOCATION_TO_DELETE = 'LOCATION_TO_DELETE',
        LOCATION_TO_CREATE = 'LOCATION_TO_CREATE',
    }
    export enum status {
        PENDING = 'PENDING',
        IGNORED = 'IGNORED',
        PROCESSED = 'PROCESSED',
        EXPIRED = 'EXPIRED',
    }
    export enum reportKind {
        ALERT = 'alert',
        SIGNALEMENT = 'signalement',
    }
}

