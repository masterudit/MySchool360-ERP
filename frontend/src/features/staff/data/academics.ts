export type SchoolClass = {
  id: string;
  grade: number;
  section: string;
  label: string;
};

export type Subject = {
  id: string;
  name: string;
  shortName: string;
};

const SECTIONS = ["A", "B", "C"] as const;

export const CLASSES: SchoolClass[] = Array.from({ length: 12 }, (_, gradeIndex) => {
  const grade = gradeIndex + 1;
  return SECTIONS.map((section) => ({
    id: `cls_${grade}${section}`,
    grade,
    section,
    label: `Class ${grade} - ${section}`,
  }));
}).flat();

export const SUBJECTS: Subject[] = [
  { id: "subj_math", name: "Mathematics", shortName: "Math" },
  { id: "subj_eng", name: "English", shortName: "Eng" },
  { id: "subj_hindi", name: "Hindi", shortName: "Hin" },
  { id: "subj_sci", name: "Science", shortName: "Sci" },
  { id: "subj_phy", name: "Physics", shortName: "Phy" },
  { id: "subj_chem", name: "Chemistry", shortName: "Chem" },
  { id: "subj_bio", name: "Biology", shortName: "Bio" },
  { id: "subj_sst", name: "Social Studies", shortName: "SST" },
  { id: "subj_cs", name: "Computer Science", shortName: "CS" },
  { id: "subj_pe", name: "Physical Education", shortName: "PE" },
  { id: "subj_art", name: "Art", shortName: "Art" },
];

const CLASS_INDEX = new Map(CLASSES.map((cls) => [cls.id, cls]));
const SUBJECT_INDEX = new Map(SUBJECTS.map((subj) => [subj.id, subj]));

export function getClass(id: string): SchoolClass | undefined {
  return CLASS_INDEX.get(id);
}

export function getSubject(id: string): Subject | undefined {
  return SUBJECT_INDEX.get(id);
}

export function getClassLabel(id: string): string {
  return getClass(id)?.label ?? id;
}

export function getSubjectName(id: string): string {
  return getSubject(id)?.name ?? id;
}
