import { NextRequest, NextResponse } from "next/server";

import { getCommuneFlag } from "@/lib/api-blason-commune";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codeCommune: string }> }
) {
  const { codeCommune } = await params;
  const flagUrl = await getCommuneFlag(codeCommune);

  return NextResponse.json(flagUrl);
}
