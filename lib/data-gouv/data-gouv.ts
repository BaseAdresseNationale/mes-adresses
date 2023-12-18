import { Dataset } from "./types";

const URL_API_DATA_GOUV: string =
  process.env.URL_API_DATA_GOUV || "https://www.data.gouv.fr/api/1/";

export class DataGouvService {
  private static async request(url: string): Promise<any> {
    const res = await fetch(`${URL_API_DATA_GOUV}${url}`);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    return res.json();
  }

  public static findDataset(id: string): Promise<Dataset> {
    return this.request(`/datasets/${id}`);
  }
}
