import { Revision } from "@/types/revision.type";

const BAN_API_DEPOT: string =
  process.env.NEXT_PUBLIC_BAN_API_DEPOT ||
  "https://plateforme-bal.adresse.data.gouv.fr/api-depot";

async function request(url: string) {
  const res = await fetch(`${BAN_API_DEPOT}${url}`);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getRevisions(codeCommune: string): Promise<Revision[]> {
  return request(`/communes/${codeCommune}/revisions`);
}

export async function getCurrentRevision(
  codeCommune: string
): Promise<Revision> {
  return request(`/communes/${codeCommune}/current-revision`);
}
