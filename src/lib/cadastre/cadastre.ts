import type { FeatureCollection, Geometry } from "geojson";

interface ParcelleProperties {
  id: string;
  commune: string;
  prefixe: string;
  section: string;
  numero: string;
  contenance: number;
  arpente: boolean;
  created: string;
  updated: string;
}

type ParcellesCollection = FeatureCollection<Geometry, ParcelleProperties>;

const URL_API_CADASTRE: string =
  process.env.URL_API_CADASTRE || "https://cadastre.data.gouv.fr/bundler/";

export class CadastreService {
  private static async request(url: string): Promise<any> {
    const res = await fetch(`${URL_API_CADASTRE}${url}`);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    return res.json();
  }

  public static findCadastreCommune(
    coeCommune: string
  ): Promise<ParcellesCollection> {
    return this.request(
      `/cadastre-etalab/communes/${coeCommune}/geojson/parcelles`
    );
  }
}
