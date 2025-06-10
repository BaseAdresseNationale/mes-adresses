const API_CADASTRE =
  process.env.NEXT_PUBLIC_API_CADASTRE_URL ||
  "https://cadastre.data.gouv.fr/bundler";

async function request(url) {
  const res = await fetch(`${API_CADASTRE}${url}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getGeoJsonCommuneParcelles(codeCommune) {
  return request(`/cadastre-etalab/communes/${codeCommune}/geojson/parcelles`);
}
