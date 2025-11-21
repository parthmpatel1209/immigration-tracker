// components/pr-pathways/types.ts
export interface Pathway {
  id: number;
  province: string;
  program: string;
  summary: string;
  url?: string;
  status: string;
  key_requirements: string;
}

export const PROGRAM_COLORS = {
  "Express Entry": { light: "#4f46e5", dark: "#a78bfa" },
  PNP: { light: "#059669", dark: "#6ee7b7" },
  CEC: { light: "#7c3aed", dark: "#c4b5fd" },
  FSW: { light: "#d97706", dark: "#fcd34d" },
  default: { light: "#64748b", dark: "#94a3b8" },
} as const;
