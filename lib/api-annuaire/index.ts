/* eslint no-restricted-imports: off */

const API_ANNURAIRE: string =
  process.env.NEXT_API_ANNUAIRE ||
  "https://api-lannuaire.service-public.fr/api/explore/v2.1";

export class ApiAnnuraireService {
  private static async request(url: string) {
    const res = await fetch(`${API_ANNURAIRE}${url}`);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    return res.json();
  }

  private static validateEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  public static async getEmailsCommune(codeCommune: string): Promise<string[]> {
    try {
      const url: string = `/catalog/datasets/api-lannuaire-administration/records?where=pivot%20LIKE%20"mairie"%20AND%20code_insee_commune="${codeCommune}"&limit=100`;
      const data = await this.request(url);
      const mairies: { adresse_courriel: string }[] = data.results.filter(
        ({ adresse_courriel }) => adresse_courriel && adresse_courriel !== ""
      );

      if (mairies.length <= 0) {
        throw new Error("L’adresse email n’est pas trouvé");
      }

      const emails: string[] = mairies
        .reduce(
          (accumulator, { adresse_courriel }) => [
            ...accumulator,
            ...adresse_courriel.split(";"),
          ],
          []
        )
        .filter((email) => this.validateEmail(email));

      if (emails.length > 0) {
        return emails;
      }

      throw new Error(
        `Les adresses emails " ${emails.join(",")} " ne peut pas être utilisée`
      );
    } catch (error) {
      console.error(
        `Une erreur s’est produite lors de la récupération de l’adresse email de la mairie (Code commune: ${codeCommune}).`,
        error
      );
    }
  }
}
