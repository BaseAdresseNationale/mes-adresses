// HABILITATION

import { HabilitationDTO } from "../openapi-api-bal";

// FILE

export enum TypeFileEnum {
  BAL = "bal",
}
export type File = {
  id?: string;
  revisionId?: string;
  size?: number;
  hash?: string;
  type?: TypeFileEnum;
  createdAt?: Date;
};

export enum StatusRevisionEnum {
  PENDING = "pending",
  PUBLISHED = "published",
}

// REVISION

export type ParseError = {
  type: string;
  code: string;
  message: string;
  row: number;
};

export type Validation = {
  valid: boolean;
  validatorVersion?: string;
  parseErrors?: ParseError[];
  errors?: string[];
  warnings?: string[];
  infos?: string[];
  rowsCount?: number;
};

export type Context = {
  nomComplet?: string;
  organisation?: string;
  extras?: Record<string, any> | null;
};

export type PublicClient = {
  id: string;
  legacyId?: string;
  nom: string;
  mandataire: string;
  chefDeFile?: string;
  chefDeFileEmail?: string;
};

export type Revision = {
  id?: string;
  clientId?: string;
  codeCommune: string;
  isReady: boolean;
  isCurrent: boolean;
  status: StatusRevisionEnum;
  context?: Context;
  validation?: Validation | null;
  habilitation?: HabilitationDTO | null;
  files?: File[];
  client?: PublicClient;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

// CHEF DE FILE

export enum TypePerimeterEnum {
  COMMUNE = "commune",
  DEPARTEMENT = "departement",
  EPCI = "epci",
}

export type Perimeter = {
  id?: string;
  chefDeFileId?: string;
  type: TypePerimeterEnum;
  code: string;
};

export type ChefDeFile = {
  id?: string;
  nom?: string;
  email?: string;
  isEmailPublic?: boolean;
  isSignataireCharte?: boolean;
  perimeters?: Perimeter[];
  createdAt?: Date;
  updatedAt?: Date;
};

// MANDATAIRE

export type Mandataire = {
  id?: string;
  nom: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

// CLIENT

export enum AuthorizationStrategyEnum {
  INTERNAL = "internal",
  CHEF_DE_FILE = "chef-de-file",
  HABILITATION = "habilitation",
}

export type Client = {
  id?: string;
  mandataireId?: string;
  chefDeFileId?: string;
  legacyId: string;
  nom: string;
  isActive: boolean;
  isRelaxMode: boolean;
  token?: string;
  authorizationStrategy: AuthorizationStrategyEnum;
  createdAt: Date;
  updatedAt: Date;
};
