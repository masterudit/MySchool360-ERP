export type PeriodConfig = {
  period: number;
  label: string;
  start: string;
  end: string;
};

export const LUNCH_CONFIG = { start: "10:40", end: "11:10" };

export const PERIOD_CONFIG: PeriodConfig[] = [
  { period: 1, label: "P1", start: "8:00", end: "8:40" },
  { period: 2, label: "P2", start: "8:40", end: "9:20" },
  { period: 3, label: "P3", start: "9:20", end: "10:00" },
  { period: 4, label: "P4", start: "10:00", end: "10:40" },
  { period: 5, label: "P5", start: "11:10", end: "11:50" },
  { period: 6, label: "P6", start: "11:50", end: "12:30" },
  { period: 7, label: "P7", start: "12:30", end: "1:10" },
  { period: 8, label: "P8", start: "1:10", end: "1:50" },
];

export const LUNCH_AFTER_PERIOD = 4; // Lunch shown between P4 and P5

// Tailwind classes — bg + text + border — per subject ID
export const SUBJECT_COLORS: Record<string, { cell: string; badge: string }> = {
  subj_math: {
    cell:  "bg-brand-50  text-brand-800  border-brand-200  dark:bg-brand-500/10  dark:text-brand-300  dark:border-brand-500/20",
    badge: "bg-brand-100 text-brand-700  dark:bg-brand-500/20 dark:text-brand-300",
  },
  subj_eng: {
    cell:  "bg-success-50  text-success-800  border-success-200  dark:bg-success-500/10  dark:text-success-300  dark:border-success-500/20",
    badge: "bg-success-100 text-success-700  dark:bg-success-500/20 dark:text-success-300",
  },
  subj_sci: {
    cell:  "bg-orange-50  text-orange-800  border-orange-200  dark:bg-orange-500/10  dark:text-orange-300  dark:border-orange-500/20",
    badge: "bg-orange-100 text-orange-700  dark:bg-orange-500/20 dark:text-orange-300",
  },
  subj_phy: {
    cell:  "bg-blue-light-50  text-blue-light-800  border-blue-light-200  dark:bg-blue-light-500/10  dark:text-blue-light-300  dark:border-blue-light-500/20",
    badge: "bg-blue-light-100 text-blue-light-700  dark:bg-blue-light-500/20 dark:text-blue-light-300",
  },
  subj_chem: {
    cell:  "bg-error-50  text-error-800  border-error-200  dark:bg-error-500/10  dark:text-error-300  dark:border-error-500/20",
    badge: "bg-error-100 text-error-700  dark:bg-error-500/20 dark:text-error-300",
  },
  subj_bio: {
    cell:  "bg-success-50  text-success-800  border-success-300  dark:bg-success-500/10  dark:text-success-300  dark:border-success-500/30",
    badge: "bg-success-100 text-success-700  dark:bg-success-500/20 dark:text-success-300",
  },
  subj_hindi: {
    cell:  "bg-warning-50  text-warning-800  border-warning-200  dark:bg-warning-500/10  dark:text-warning-300  dark:border-warning-500/20",
    badge: "bg-warning-100 text-warning-700  dark:bg-warning-500/20 dark:text-warning-300",
  },
  subj_sst: {
    cell:  "bg-gray-100  text-gray-800  border-gray-300  dark:bg-gray-800  dark:text-gray-200  dark:border-gray-700",
    badge: "bg-gray-200 text-gray-700  dark:bg-gray-700 dark:text-gray-300",
  },
  subj_cs: {
    cell:  "bg-brand-950/5  text-gray-800  border-gray-300  dark:bg-gray-800  dark:text-gray-200  dark:border-gray-700",
    badge: "bg-gray-100 text-gray-700  dark:bg-gray-800 dark:text-gray-300",
  },
  subj_pe: {
    cell:  "bg-orange-50  text-orange-700  border-orange-200  dark:bg-orange-500/5  dark:text-orange-300  dark:border-orange-500/20",
    badge: "bg-orange-100 text-orange-600  dark:bg-orange-500/10 dark:text-orange-300",
  },
  subj_art: {
    cell:  "bg-warning-50  text-warning-700  border-warning-200  dark:bg-warning-500/5  dark:text-warning-300  dark:border-warning-500/20",
    badge: "bg-warning-100 text-warning-600  dark:bg-warning-500/10 dark:text-warning-300",
  },
};

export const DEFAULT_SUBJECT_COLOR = {
  cell:  "bg-gray-50  text-gray-700  border-gray-200  dark:bg-gray-800  dark:text-gray-300  dark:border-gray-700",
  badge: "bg-gray-100 text-gray-600  dark:bg-gray-700 dark:text-gray-400",
};
