import qs from "querystring";
import { toaster } from "evergreen-ui";
import { CommuneApiGeoType, CommuneDelegueeApiGeoType } from "./type";

const GEO_API_URL =
  process.env.NEXT_PUBLIC_GEO_API_URL || "https://geo.api.gouv.fr";

export class ApiGeoService {
  private static async request(url: string) {
    try {
      const res = await fetch(`${GEO_API_URL}${url}`);
      return res.json();
    } catch (error) {
      toaster.danger("Erreur inattendue", {
        description: error.message,
      });
    }

    return null;
  }

  private static isCodeDep(token: string) {
    return ["2A", "2B"].includes(token) || token.match(/^\d{2,3}$/);
  }

  public static async searchCommunes(
    search: string,
    options = {}
  ): Promise<CommuneApiGeoType[]> {
    const query: any = {
      nom: search,
    };

    const codeDep: string = search
      .split(" ")
      .find((token) => this.isCodeDep(token));
    if (codeDep) {
      query.codeDepartement = codeDep;
    }

    const res = await this.request(
      `/communes?${qs.stringify({
        ...options,
        ...query,
      })}`
    );
    return res || [];
  }

  public static async getCommune(
    code: string,
    options = {}
  ): Promise<CommuneApiGeoType> {
    return this.request(
      `/communes/${code.toUpperCase()}?${qs.stringify(options)}`
    );
  }
}
