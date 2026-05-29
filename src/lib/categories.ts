import { BriefcaseBusiness, GraduationCap, HeartPulse, Home, Soup, Users } from "lucide-react";

import type { ResourceCategory } from "@/lib/types";

export const resourceCategories: Array<{
  category: ResourceCategory;
  title: string;
  description: string;
  icon: typeof Soup;
  accent: string;
}> = [
  {
    category: "Food",
    title: "Food support",
    description: "Pantries, meal sites, grocery delivery, and nutrition programs.",
    icon: Soup,
    accent: "from-amber-300 via-orange-200 to-white",
  },
  {
    category: "Shelter",
    title: "Safe housing",
    description: "Emergency shelters, transitional housing, and rent assistance.",
    icon: Home,
    accent: "from-sky-300 via-cyan-200 to-white",
  },
  {
    category: "Jobs",
    title: "Work and income",
    description: "Job training, resume help, hiring fairs, and benefits support.",
    icon: BriefcaseBusiness,
    accent: "from-blue-300 via-indigo-200 to-white",
  },
  {
    category: "Healthcare",
    title: "Health services",
    description: "Clinics, wellness checks, counseling, and prescription access.",
    icon: HeartPulse,
    accent: "from-emerald-300 via-teal-200 to-white",
  },
  {
    category: "Education",
    title: "Learning pathways",
    description: "Adult education, tutoring, digital literacy, and scholarships.",
    icon: GraduationCap,
    accent: "from-violet-300 via-fuchsia-200 to-white",
  },
  {
    category: "Community",
    title: "Community care",
    description: "Neighborhood hubs, family support, and volunteer opportunities.",
    icon: Users,
    accent: "from-rose-300 via-pink-200 to-white",
  },
];

export const categoryNeedsMap: Record<string, string[]> = {
  Food: ["food"],
  Shelter: ["shelter"],
  Jobs: ["jobs"],
  Healthcare: ["healthcare"],
  Education: ["education"],
  Legal: ["jobs", "shelter"],
  Youth: ["education", "food"],
  Community: ["food", "jobs", "education"],
  Resource: [],
};
