export type HabilitationType = {
  _id: string;
  nom: string;
  mandataire: string;
  client: string;
  emailCommune: string;
  codeCommune: string;
  status: string;
  franceconnectAuthenticationUrl: string;
  expiresAt: string;
  acceptedAt: string;
  createdAt: string;
  updatedAt: string;
  strategy: {
    type: string;
    pinCodeExpiration: string;
    remainingAttempts: number;
    createdAt: string;
  };
}
