export enum BaseLocaleStatus {
  DEMO = 'demo',
  DRAFT = 'draft',
  PUBLISHED = 'published',
  REAPLACED = 'replaced',
  READY_TO_PUBLISH = 'ready-to-publish'
}

export type BaseLocaleType = {
  _id: string;
  status: BaseLocaleStatus;
}

