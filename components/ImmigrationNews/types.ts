// ImmigrationNews/types.ts
export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source?: string;
  published_at?: string;
  url?: string;
  program?: string;
  image_url?: string | null;
}

export const PROGRAM_COLORS: Record<string, { light: string; dark: string }> = {
  "Express Entry": { light: "#4338ca", dark: "#c7d2fe" },
  PNP: { light: "#065f46", dark: "#a7f3d0" },
  CEC: { light: "#6b21a8", dark: "#e9d5ff" },
  FSW: { light: "#92400e", dark: "#fde68a" },
  default: { light: "#374151", dark: "#d1d5db" },
};
