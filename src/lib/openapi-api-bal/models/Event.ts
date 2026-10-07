/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
    payloadBefore: (SerializedVoie | SerializedToponyme | SerializedNumero | SerializedPosition) | null;
    payloadAfter: (SerializedVoie | SerializedToponyme | SerializedNumero | SerializedPosition) | null;
    isSyncedWithRevision: string | null;
    createdAt: string;
    updatedAt: string;
};
export namespace Event {
    export enum entityType {
        VOIE = 'voie',
        TOPONYME = 'toponyme',
        NUMERO = 'numero',
        POSITION = 'position',
    }
    export enum action {
        CREATE = 'CREATE',
        UPDATE = 'UPDATE',
        DELETE = 'DELETE',
    }
}

