/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SerializedVoie = {
    id: string;
    banId: string;
    createdAt: string;
    balId: string;
    nom: string;
    nomAlt: Record<string, any>;
    typeNumerotation: SerializedVoie.typeNumerotation;
    centroid: Record<string, any>;
    trace: Record<string, any>;
    bbox: Array<number>;
    codeVoie: string;
    comment: string;
};
export namespace SerializedVoie {
    export enum typeNumerotation {
        NUMERIQUE = 'numerique',
        METRIQUE = 'metrique',
    }
}

