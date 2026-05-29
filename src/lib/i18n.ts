import { en } from "@/locales/en";
import { es } from "@/locales/es";

export const translations = { en, es } as const;

export type Locale = keyof typeof translations;
export type LocaleMessages = (typeof translations)[Locale];

const categoryLabels = {
  Food: { en: "Food", es: "Alimentos" },
  Shelter: { en: "Shelter", es: "Refugio" },
  Jobs: { en: "Jobs", es: "Empleo" },
  Healthcare: { en: "Healthcare", es: "Salud" },
  Education: { en: "Education", es: "Educación" },
  Legal: { en: "Legal", es: "Legal" },
  Youth: { en: "Youth", es: "Juventud" },
  Community: { en: "Community", es: "Comunidad" },
  Resource: { en: "Resource", es: "Recurso" },
} as const;

const categoryDescriptions = {
  Food: {
    en: "Pantries, meal sites, grocery delivery, and nutrition programs.",
    es: "Despensas, comedores, entrega de alimentos y programas de nutrición.",
  },
  Shelter: {
    en: "Emergency shelters, transitional housing, and rent assistance.",
    es: "Refugios de emergencia, vivienda transitoria y ayuda para el alquiler.",
  },
  Jobs: {
    en: "Job training, resume help, hiring fairs, and benefits support.",
    es: "Capacitación laboral, ayuda con el currículum, ferias de empleo y apoyo con beneficios.",
  },
  Healthcare: {
    en: "Clinics, wellness checks, counseling, and prescription access.",
    es: "Clínicas, chequeos de bienestar, consejería y acceso a medicamentos.",
  },
  Education: {
    en: "Adult education, tutoring, digital literacy, and scholarships.",
    es: "Educación para adultos, tutorías, alfabetización digital y becas.",
  },
  Community: {
    en: "Neighborhood hubs, family support, and volunteer opportunities.",
    es: "Centros vecinales, apoyo familiar y oportunidades de voluntariado.",
  },
  Legal: {
    en: "Legal clinics, benefits guidance, and advocacy support.",
    es: "Clínicas legales, orientación sobre beneficios y apoyo de defensa.",
  },
  Youth: {
    en: "Youth mentoring, school support, and family-centered services.",
    es: "Mentoría juvenil, apoyo escolar y servicios centrados en la familia.",
  },
  Resource: {
    en: "General community resource.",
    es: "Recurso comunitario general.",
  },
} as const;

const needLabels = {
  food: { en: "food", es: "alimentos" },
  shelter: { en: "shelter", es: "refugio" },
  jobs: { en: "jobs", es: "empleo" },
  healthcare: { en: "healthcare", es: "salud" },
  education: { en: "education", es: "educación" },
} as const;

const languageLabels = {
  English: { en: "English", es: "Inglés" },
  Spanish: { en: "Spanish", es: "Español" },
  Vietnamese: { en: "Vietnamese", es: "Vietnamita" },
  Arabic: { en: "Arabic", es: "Árabe" },
} as const;

export function localizeCategory(category: string, locale: Locale) {
  return categoryLabels[category as keyof typeof categoryLabels]?.[locale] ?? category;
}

export function localizeCategoryDescription(category: string, locale: Locale) {
  return (
    categoryDescriptions[category as keyof typeof categoryDescriptions]?.[locale] ?? category
  );
}

export function localizeNeed(need: string, locale: Locale) {
  return needLabels[need as keyof typeof needLabels]?.[locale] ?? need;
}

export function localizeLanguage(label: string, locale: Locale) {
  return languageLabels[label as keyof typeof languageLabels]?.[locale] ?? label;
}

export function formatLocalizedMessage(
  template: string,
  values: Record<string, string | number | undefined>,
) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, value == null ? "" : String(value)),
    template,
  );
}
