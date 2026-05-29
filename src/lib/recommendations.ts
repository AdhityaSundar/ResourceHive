import { categoryNeedsMap } from "@/lib/categories";
import type { RecommendationRequest, RecommendationResponse, Resource } from "@/lib/types";

function scoreResource(resource: Resource, request: RecommendationRequest) {
  const requestedNeeds = new Set(request.needs);
  const mappedNeeds = categoryNeedsMap[resource.category] ?? [];
  let score = mappedNeeds.reduce((total, need) => total + (requestedNeeds.has(need as never) ? 2 : 0), 0);

  if (request.city && resource.city.toLowerCase() === request.city.toLowerCase()) {
    score += 1;
  }

  if (resource.tags.some((tag) => requestedNeeds.has(tag.toLowerCase() as never))) {
    score += 1;
  }

  return score;
}

export function buildRecommendations(
  resources: Resource[],
  request: RecommendationRequest,
): RecommendationResponse {
  const matches = resources
    .map((resource) => ({ resource, score: scoreResource(resource, request) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => item.resource);

  const needsText = request.needs.join(" + ");
  const cityText = request.city ? ` in ${request.city}` : "";

  return {
    summary:
      matches.length > 0
        ? `Here are the strongest matches for ${needsText}${cityText}, ranked by service fit and proximity.`
        : `No exact matches were found for ${needsText}${cityText}, so consider broadening your filters.`,
    matches,
  };
}
