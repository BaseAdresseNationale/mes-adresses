// HABILITATION

export enum StatusHabilitationEnum {
  ACCEPTED = "accepted",
  PENDING = "pending",
  REJECTED = "rejected",
}

export enum TypeStrategyEnum {
  EMAIL = "email",
  FRANCECONNECT = "franceconnect",
  INTERNAL = "internal",
}

export type Mandat = {
  nomMarital: string;
  nomNaissance: string;
  prenom: string;
};

export type Strategy = {
  type: TypeStrategyEnum;
  // EMAIL
  pinCode?: string;
  pinCodeExpiration?: Date | null;
  createdAt?: Date | null;
  remainingAttempts?: number;
  // FRANCECONNECT
  mandat?: Mandat;
  authenticationError?: string;
};

export type Habilitation = {
  id?: string;
  clientId?: string;
  codeCommune: string;
  emailCommune: string;
  franceconnectAuthenticationUrl?: string;
  status: StatusHabilitationEnum;
  strategy?: Strategy | null;
  expiresAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

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

export interface ParseError {
  type: string;
  code: string;
  message: string;
  row: number;
}

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
  specId?: string;
  nom: string;
  mandataire: string;
  chefDeFile?: string;
  chefDeFileEmail?: string;
};

export type Revision = {
  id?: string;
  clientId?: string;
  codeCommune: string;
  ready: boolean;
  current: boolean;
  status: StatusRevisionEnum;
  context?: Context;
  validation?: Validation | null;
  habilitation?: Habilitation | null;
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

export class Perimeter {
  id?: string;
  chefDeFileId?: string;
  type: TypePerimeterEnum;
  code: string;
}

export type ChefDeFile = {
  id?: string;
  nom: string;
  email?: string;
  isEmailPublic: boolean;
  perimeters?: Perimeter[];
  createdAt: Date;
  updatedAt: Date;
};
