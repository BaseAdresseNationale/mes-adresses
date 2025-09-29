/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseLocaleSetting } from './BaseLocaleSetting';

export type UpdateBaseLocaleDTO = {
    nom?: string;
    communeNomsAlt?: Record<string, any> | null;
    emails?: Array<string>;
    settings?: BaseLocaleSetting | null;
};

