/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConvertVoieToToponymeAfterPayload } from './ConvertVoieToToponymeAfterPayload';
import type { ConvertVoieToToponymeBeforePayload } from './ConvertVoieToToponymeBeforePayload';
import type { MergeVoiesAfterPayload } from './MergeVoiesAfterPayload';
import type { MergeVoiesBeforePayload } from './MergeVoiesBeforePayload';
import type { SerializedNumero } from './SerializedNumero';
import type { SerializedPosition } from './SerializedPosition';
import type { SerializedToponyme } from './SerializedToponyme';
import type { SerializedVoie } from './SerializedVoie';
export type Event = {
    id: string;
    balId: string;
    voieId: string;
    parentEventId: string;
    childEvents: Array<Event> | null;
    entityType: Event.entityType;
    entityId: string;
    action: Event.action;
    payloadBefore: (SerializedVoie | SerializedToponyme | SerializedNumero | SerializedPosition | ConvertVoieToToponymeBeforePayload | ConvertVoieToToponymeAfterPayload | MergeVoiesBeforePayload | MergeVoiesAfterPayload) | null;
    payloadAfter: (SerializedVoie | SerializedToponyme | SerializedNumero | SerializedPosition | ConvertVoieToToponymeBeforePayload | ConvertVoieToToponymeAfterPayload | MergeVoiesBeforePayload | MergeVoiesAfterPayload) | null;
    isSynced: boolean;
    syncedAt: string;
    createdAt: string;
    updatedAt: string;
};
export namespace Event {
    export enum entityType {
        VOIE = 'voie',
        TOPONYME = 'toponyme',
        NUMERO = 'numero',
        POSITION = 'position',
        COMPOSITE = 'composite',
    }
    export enum action {
        CREATE = 'CREATE',
        UPDATE = 'UPDATE',
        DELETE = 'DELETE',
        MERGE_VOIES = 'MERGE_VOIES',
        CONVERT_VOIE_TO_TOPONYME = 'CONVERT_VOIE_TO_TOPONYME',
    }
}

