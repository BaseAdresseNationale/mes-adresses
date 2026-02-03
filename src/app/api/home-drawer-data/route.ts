import { NextResponse } from "next/server";
import { EventType } from "@/lib/bal-admin/type";
import { NewsType } from "@/lib/mattermost/type";
import { ApiBalAdminService } from "@/lib/bal-admin";
import { fetchNews } from "@/lib/mattermost";

const CACHE_TIME = 60 * 60 * 1000; // 1 hour

let cachedData: {
  nextTrainings: EventType[];
  news: NewsType[];
  timestamp: number;
} | null = null;

export async function GET() {
  const now = Date.now();

  if (cachedData && now - cachedData.timestamp < CACHE_TIME) {
    return NextResponse.json(cachedData);
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

  return NextResponse.json(cachedData);
}
