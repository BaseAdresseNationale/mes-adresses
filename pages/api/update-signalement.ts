import type { NextApiRequest, NextApiResponse } from "next";

const API_SIGNALEMENT = process.env.NEXT_PUBLIC_API_SIGNALEMENT;
const SIGNALEMENT_CLIENT_TOKEN = process.env.SIGNALEMENT_CLIENT_TOKEN;

async function updateSignalement(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const response = await fetch(`${API_SIGNALEMENT}/signalements`, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SIGNALEMENT_CLIENT_TOKEN}`,
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default updateSignalement;
