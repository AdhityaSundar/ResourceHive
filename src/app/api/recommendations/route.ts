import { NextResponse } from "next/server";

import { buildRecommendations } from "@/lib/recommendations";
import { getResources } from "@/lib/resource-store";
import type { RecommendationRequest } from "@/lib/types";

export async function POST(request: Request) {
  const payload = (await request.json()) as RecommendationRequest;
  const resources = await getResources();
  const recommendations = buildRecommendations(resources, payload);
  return NextResponse.json(recommendations);
}
