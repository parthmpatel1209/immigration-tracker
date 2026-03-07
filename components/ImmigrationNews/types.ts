// ImmigrationNews/types.ts
export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source?: string;
  title_text?: string;
  published_at?: string;
  url?: string;
  program?: string;
  image_url?: string | null;
}

export const PROGRAM_COLORS: Record<string, { light: string; dark: string }> = {
  "Express Entry": { light: "#b91c1c", dark: "#fca5a5" },
  PNP: { light: "#065f46", dark: "#a7f3d0" },
  CEC: { light: "#9f1239", dark: "#fda4af" },
  FSW: { light: "#92400e", dark: "#fde68a" },
  default: { light: "#374151", dark: "#d1d5db" },
};
