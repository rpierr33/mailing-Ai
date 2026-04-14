import { NextRequest, NextResponse } from "next/server";
import { getAudienceGrowthData, getOpensClicksData, getHeatmapData } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(request: NextRequest) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "growth";

  switch (type) {
    case "growth":
      return NextResponse.json({ data: getAudienceGrowthData() });
    case "opensClicks":
      return NextResponse.json({ data: getOpensClicksData() });
    case "heatmap":
      return NextResponse.json({ data: getHeatmapData() });
    default:
      return NextResponse.json({ data: getAudienceGrowthData() });
  }
}
