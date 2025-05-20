/* eslint no-restricted-imports: off */
import { Revision } from "./types";

export const PRO_CONNECT_QUERY_PARAM = "pro-connect";

const BAN_API_DEPOT: string =
  process.env.NEXT_PUBLIC_BAN_API_DEPOT ||
  "https://plateforme-bal.adresse.data.gouv.fr/api-depot";

export class ApiDepotService {
  private static async request(url: string) {
    const res = await fetch(`${BAN_API_DEPOT}${url}`);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    return res.json();
  }

  public static async getRevisions(codeCommune: string): Promise<Revision[]> {
    return this.request(`/communes/${codeCommune}/revisions`);
  }

  public static async getCurrentRevision(
    codeCommune: string
  ): Promise<Revision> {
    return this.request(`/communes/${codeCommune}/current-revision`);
  }

  public static async getEmailsCommune(codeCommune: string): Promise<string[]> {
    return this.request(`/communes/${codeCommune}/emails`);
  }

  public static getUrlProConnect(
    habiliationId: string,
    redirectUrl: string
  ): string {
    return `${BAN_API_DEPOT}/habilitations/${habiliationId}/authentication/proconnect?redirectUrl=${redirectUrl}`;
  }
}
