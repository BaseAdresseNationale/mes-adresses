const BAL_BLASON_BUCKET_URL =
  "https://base-adresse-locale-prod-blasons-communes.s3.fr-par.scw.cloud";

const DEFAULT_URL_DISTRICT_FLAG = "/static/images/commune-default-flag.svg";

// Fetch the commune flag from a proxy for front-end to avoid CORS issues
export const getCommuneFlagProxy = async (
  codeCommune: string
): Promise<string> => {
  const response = await fetch(`/api/proxy-flag-commune/${codeCommune}`);

  return response.json();
};

export const getCommuneFlag = async (codeCommune: string): Promise<string> => {
  if (!process.env.NEXT_PUBLIC_API_ANNUAIRE_DES_COLLECTIVITES) {
    return getCommuneFlagFromBal(codeCommune);
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ANNUAIRE_DES_COLLECTIVITES}/commune/logo/${codeCommune}`
    );

    if (!response.ok) {
      return getCommuneFlagFromBal(codeCommune);
    }

    const { logo, blason } = (await response.json()) as {
      blason: string | null;
      logo: string | null;
    };

    const imgUrl = logo || blason;

    const isValidUrl =
      imgUrl && (imgUrl.startsWith("http") || imgUrl.startsWith("data:image"));

    if (!isValidUrl) {
      return getCommuneFlagFromBal(codeCommune);
    }

    return imgUrl;
  } catch (err) {
    console.error(
      "Error fetching commune flag from annuaire des collectivités",
      err
    );
    return getCommuneFlagFromBal(codeCommune);
  }
};

export const getCommuneFlagFromBal = async (
  codeCommune: string
): Promise<string> => {
  const url = `${BAL_BLASON_BUCKET_URL}/${codeCommune}.svg`;

  const response = await fetch(url, {
    method: "HEAD",
  });

  if (!response.ok) {
    return DEFAULT_URL_DISTRICT_FLAG;
  }

  return url;
};
