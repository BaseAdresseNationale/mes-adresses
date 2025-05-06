import { getCommuneFlag } from "../../../lib/api-blason-commune";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const codeCommune = req.query.codeCommune as string;
  const flagUrl = await getCommuneFlag(codeCommune);

  res.json(flagUrl);
}
