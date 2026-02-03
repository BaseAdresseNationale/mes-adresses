const API_BAN =
  process.env.NEXT_PUBLIC_API_BAN_URL ||
  "https://plateforme.adresse.data.gouv.fr";

async function request(url) {
  const res = await fetch(`${API_BAN}${url}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getBANCommune(codeCommune) {
  return request(`/lookup/${codeCommune}`);
}
