/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Author } from './Author';
import type { ChangesRequested } from './ChangesRequested';
import type { ExistingLocation } from './ExistingLocation';
import type { ObjectId } from './ObjectId';

export type Signalement = {
    _id: ObjectId;
    _created: string;
    _updated: string;
    _deleted?: string | null;
    codeCommune: string;
    type: string;
    author?: Author | null;
    existingLocation?: ExistingLocation | null;
    changesRequested: ChangesRequested;
    processedAt?: string | null;
};

