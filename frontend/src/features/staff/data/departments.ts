export const DEPARTMENTS = [
  "Administration",
  "Accounts",
  "Arts & Craft",
  "Biology",
  "Chemistry",
  "Commerce",
  "Computer Science",
  "Economics",
  "English",
  "Front Office",
  "Geography",
  "Hindi",
  "History",
  "Library",
  "Mathematics",
  "Physical Education",
  "Physics",
  "Sanskrit",
  "Science",
  "Social Studies",
] as const;

export type Department = (typeof DEPARTMENTS)[number];
