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

    const url = await response.text();

    // Check if the URL is valid and does not point to Wikimedia Commons (to avoid discrepancies between the logo displayed on mes-adresses and the one one the generated documents)
    const isValidUrl =
      url &&
      (url.startsWith("http") || url.startsWith("data:image")) &&
      !url.includes("commons.wikimedia.org");

    if (!response.ok || !isValidUrl) {
      return getCommuneFlagFromBal(codeCommune);
    }

    return url;
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
