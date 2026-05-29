export type ResourceCategory =
  | "Food"
  | "Shelter"
  | "Jobs"
  | "Healthcare"
  | "Education"
  | "Legal"
  | "Youth"
  | "Community"
  | "Resource";

export type ResourceNeed = "food" | "shelter" | "jobs" | "healthcare" | "education";

export type Resource = {
  id: string;
  name: string;
  category: ResourceCategory;
  description: string;
  services: string[];
  address: string;
  city: string;
  state: string;
  zip: string;
  stateLocation?: string;
  phone: string;
  email?: string;
  contactName?: string;
  resourceInformation?: string;
  info?: string;
  website: string;
  hours: string;
  languages: string[];
  tags: string[];
  latitude: number;
  longitude: number;
  lat?: number;
  lng?: number;
  eligibility: string;
  sourceType: "seed" | "spreadsheet" | "manual";
  sourceRef?: string;
  updatedAt: string;
};

export type ResourceFilters = {
  query: string;
  category: string;
  city: string;
  needs?: ResourceNeed[];
};

export type SavedResource = {
  resourceId: string;
  savedAt: string;
};

export type ViewedResource = {
  resourceId: string;
  viewedAt: string;
};

export type DemoUser = {
  name: string;
  email: string;
};

export type RecommendationRequest = {
  needs: ResourceNeed[];
  city?: string;
};

export type RecommendationResponse = {
  summary: string;
  matches: Resource[];
};

export type ResourceSearchParams = {
  query?: string;
  category?: string;
  city?: string;
  needs?: string[];
  page?: number;
  pageSize?: number;
};

export type ResourceSearchResult = {
  items: Resource[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  counts: {
    totalResources: number;
    categories: number;
    cities: number;
  };
};

export type ResourceImportRow = Record<string, unknown>;

export type ResourceImportSummary = {
  imported: number;
  skipped: number;
  errors: string[];
  resources: Resource[];
};
