import { ApiBalAdminService } from "@/lib/bal-admin";
import { EventType } from "@/lib/bal-admin/type";
import { fetchNews } from "@/lib/mattermost";
import { NewsType } from "@/lib/mattermost/type";
import { NextApiRequest, NextApiResponse } from "next";

const CACHE_TIME = 60 * 60 * 1000; // 1 hour

let cachedData: {
  nextTrainings: EventType[];
  news: NewsType[];
  timestamp: number;
} | null = null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const now = Date.now();

  if (cachedData && now - cachedData.timestamp < CACHE_TIME) {
    res.json(cachedData);
    return;
  }

  let news: NewsType[] = [];
  let nextTrainings: EventType[] = [];

  try {
    news = await fetchNews();
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  try {
    nextTrainings = await ApiBalAdminService.fetchNextTrainings();
  } catch (error) {
    console.error("Error fetching next trainings:", error);
  }

  cachedData = {
    news,
    nextTrainings,
    timestamp: now,
  };

  res.json(cachedData);
}
