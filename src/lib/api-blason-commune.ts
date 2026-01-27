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

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_ANNUAIRE_DES_COLLECTIVITES}/commune/logo/${codeCommune}`
  );

  if (!response.ok) {
    return getCommuneFlagFromBal(codeCommune);
  }

  const url = await response.text();

  return url;
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
