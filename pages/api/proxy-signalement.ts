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
): Promise<void> {
  const { id, ...rest } = req.body;
  try {
    const signalement = await SignalementsService.updateSignalement(id, rest);
    res.status(200).json(signalement);
  } catch (error: any) {
    res.status(error.status).json(error.body);
  }
}

export default proxySignalement;
