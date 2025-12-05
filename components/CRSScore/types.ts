export interface Draw {
    id: number;
    round: string;
    program: string;
    crs_cutoff: string;
    invitations: string;
    draw_date: string;
    draw_province: string | null;
}

export interface TrendDataPoint {
    date: string;
    timestamp: number;
    crs: number;
    program: string;
    category: string;
}

export interface ScatterDataPoint {
    category: string;
    crs: number;
    date: string;
    program: string;
}

export interface MonthlyData {
    month: string;
    CEC: number;
    PNP: number;
    Others: number;
}

export interface DistributionData {
    range: string;
    CEC: number;
    PNP: number;
    Others: number;
}

export type ProgramCategory = "CEC" | "PNP" | "Others";
export type ViewMode = "table" | "analytics";
export type SortBy = "date" | "crs" | "invitations";
export type SortOrder = "asc" | "desc";
