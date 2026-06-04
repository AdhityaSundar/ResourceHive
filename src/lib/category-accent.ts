// Vivid accent color per category — gives the steel resource cards their
// "variety of colors" while staying meaningful (color signals the type).
const ACCENTS: Record<string, string> = {
  Food: "#ef9d17", // amber
  Shelter: "#0e9aa7", // teal
  Jobs: "#3b6fe0", // blue
  Healthcare: "#15b7a6", // mint-teal
  Education: "#8b5cf6", // violet
  Legal: "#5b74c4", // indigo
  Youth: "#f97316", // orange
  Community: "#e0658c", // rose
  Resource: "#8aa0b4", // steel-neutral
};

export function categoryAccent(category: string): string {
  return ACCENTS[category] ?? ACCENTS.Resource;
}
