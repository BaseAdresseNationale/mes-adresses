const URL_API_ANNUAIRE: string =
  process.env.NEXT_PUBLIC_API_ANNUAIRE ||
  "https://api-lannuaire.service-public.fr/api/explore/v2.1";

export class ApiAnnuaireService {
  private static async request(url: string) {
    const res = await fetch(`${URL_API_ANNUAIRE}${url}`);

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
      const { results } = await this.request(
        `/catalog/datasets/api-lannuaire-administration/records?where=pivot%20LIKE%20"mairie"%20AND%20code_insee_commune="${codeCommune}"&limit=100`
      );
      const mairies = results.filter(
        ({ adresse_courriel }) => adresse_courriel && adresse_courriel !== ""
      );

      if (mairies.length <= 0) {
        console.error(`Aucune mairie trouvé pour la commune ${codeCommune}`);
        return [];
      }

      const emails: string[] = [
        ...new Set<string>(
          mairies
            .reduce(
              (accumulator, { adresse_courriel }) => [
                ...accumulator,
                ...adresse_courriel.split(";"),
              ],
              []
            )
            .filter((email) => this.validateEmail(email))
        ),
      ];

      if (emails.length > 0) {
        return emails;
      }

      console.error(
        `Les adresses emails " ${emails.join(",")} " ne peut pas être utilisée`
      );
      return [];
    } catch (error) {
      console.error(
        `Une erreur s’est produite lors de la récupération de l’adresse email de la mairie (Code commune: ${codeCommune}).`,
        error
      );
      return [];
    }
  }
}
