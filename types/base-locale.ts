export enum BaseLocaleStatus {
  DEMO = 'demo',
  DRAFT = 'draft',
  PUBLISHED = 'published',
  REAPLACED = 'replaced',
  READY_TO_PUBLISH = 'ready-to-publish'
}

export enum BaseLocaleSyncStatus {
  SYNCED = 'synced',
  OUTDATED = 'outdated',
  CONFLICT = 'conflict'
}

export type BaseLocaleSyncType = {
  status: BaseLocaleSyncStatus;
  isPaused: boolean;
  lastUploadedRevisionId: string;
}

export type BaseLocaleType = {
  _id: string;
  nom: string;
  emails: string[];
  commune: string;
  token?: string;
  status: BaseLocaleStatus;
  _created: string;
  _updated: string;
  _deleted: string;
  _habilitation?: string;
  sync?: BaseLocaleSyncType;

  // Computed fields
  nbNumeros: number;
  nbNumerosCertifies: number;
  isAllCertified: boolean;
  commentedNumeros?: any[];
}

