import {
  OpenAPI,
  Signalement,
  SignalementsService,
} from "@/lib/openapi-signalement";
import type { NextApiRequest, NextApiResponse } from "next";

OpenAPI.BASE = process.env.NEXT_PUBLIC_API_SIGNALEMENT;
OpenAPI.TOKEN = process.env.SIGNALEMENT_CLIENT_TOKEN;

async function proxySignalement(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Signalement> {
  return SignalementsService.updateSignalement(req.body);
}

export default proxySignalement;
