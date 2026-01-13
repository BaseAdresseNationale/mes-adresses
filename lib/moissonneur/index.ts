import { Organization } from "./type";

const NEXT_PUBLIC_MOISSONNEUR_BAL_API_URL =
  process.env.NEXT_PUBLIC_MOISSONNEUR_BAL_API_URL ||
  "https://plateforme-bal.adresse.data.gouv.fr/moissonneur";

export class ApiMoissonneurBalService {
  public static async getOrganization(id: string): Promise<Organization> {
    const response = await fetch(
      `${NEXT_PUBLIC_MOISSONNEUR_BAL_API_URL}/organizations/${id}`
    );
    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.message);
    }

    const data: Organization = await response.json();

    return data;
  }
}
