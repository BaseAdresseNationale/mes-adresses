export interface Organization {
  class: string;
  id: string;
  acronym: string;
  badges: [
    {
      kind: string;
    },
  ];
  logo: string;
  logo_thumbnail: string;
  name: string;
  page: string;
  slug: string;
  uri: string;
}

export interface Dataset {
  organization: Organization;
}
