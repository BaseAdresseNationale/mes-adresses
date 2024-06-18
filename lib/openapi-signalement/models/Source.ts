/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectId } from './ObjectId';

export type Source = {
    _id: ObjectId;
    _createdAt: number;
    _updatedAt: number;
    _deletedAt?: number | null;
    nom: string;
    type: Source.type;
};

export namespace Source {

    export enum type {
        PUBLIC = 'PUBLIC',
        PRIVATE = 'PRIVATE',
    }


}

