import type { TimetableSlot, Day, PeriodNumber } from "../types/timetable.types";

// Staff IDs (from mockStaff.ts)
const I = "stf_003"; // Rajesh Iyer – Mathematics
const B = "stf_004"; // Sunita Banerjee – English
const K = "stf_005"; // Mohammed Khan – Science / Physics / Chemistry
const V = "stf_006"; // Priya Verma – Social Studies
const P = "stf_007"; // Nandini Pillai – Hindi
const M = "stf_008"; // Arjun Mehta – Computer Science
const J = "stf_012"; // Deepak Joshi – Physical Education

// Subject IDs
const MATH  = "subj_math";
const ENG   = "subj_eng";
const PHY   = "subj_phy";
const CHEM  = "subj_chem";
const BIO   = "subj_bio";
const HINDI = "subj_hindi";
const SST   = "subj_sst";
const CS    = "subj_cs";
const PE    = "subj_pe";
const SCI   = "subj_sci";

const AY = "2025-26";

let _uid = 1;
function slot(classId: string, day: Day, period: PeriodNumber, subjectId: string, teacherId: string): TimetableSlot {
  return { id: `tt_${_uid++}`, classId, academicYear: AY, day, period, subjectId, teacherId };
}

// ─── Class 10-A ───────────────────────────────────────────────────────────────
// Teachers: Iyer(Math), Banerjee(Eng), Khan(Phy/Chem/Bio), Pillai(Hindi), Verma(SST), Mehta(CS), Joshi(PE)
const C10A = "cls_10A";
const TT_10A: TimetableSlot[] = [
  // Monday
  slot(C10A, "Monday",    1, MATH,  I), slot(C10A, "Monday",    2, ENG,   B),
  slot(C10A, "Monday",    3, PHY,   K), slot(C10A, "Monday",    4, HINDI, P),
  slot(C10A, "Monday",    5, CS,    M), slot(C10A, "Monday",    6, MATH,  I),
  slot(C10A, "Monday",    7, SST,   V), slot(C10A, "Monday",    8, PE,    J),
  // Tuesday
  slot(C10A, "Tuesday",   1, ENG,   B), slot(C10A, "Tuesday",   2, MATH,  I),
  slot(C10A, "Tuesday",   3, CHEM,  K), slot(C10A, "Tuesday",   4, BIO,   K),
  slot(C10A, "Tuesday",   5, SST,   V), slot(C10A, "Tuesday",   6, HINDI, P),
  slot(C10A, "Tuesday",   7, PHY,   K), slot(C10A, "Tuesday",   8, CS,    M),
  // Wednesday
  slot(C10A, "Wednesday", 1, HINDI, P), slot(C10A, "Wednesday", 2, SST,   V),
  slot(C10A, "Wednesday", 3, MATH,  I), slot(C10A, "Wednesday", 4, CS,    M),
  slot(C10A, "Wednesday", 5, ENG,   B), slot(C10A, "Wednesday", 6, MATH,  I),
  slot(C10A, "Wednesday", 7, BIO,   K), slot(C10A, "Wednesday", 8, PE,    J),
  // Thursday
  slot(C10A, "Thursday",  1, PHY,   K), slot(C10A, "Thursday",  2, HINDI, P),
  slot(C10A, "Thursday",  3, ENG,   B), slot(C10A, "Thursday",  4, SST,   V),
  slot(C10A, "Thursday",  5, MATH,  I), slot(C10A, "Thursday",  6, CHEM,  K),
  slot(C10A, "Thursday",  7, CS,    M), slot(C10A, "Thursday",  8, PE,    J),
  // Friday
  slot(C10A, "Friday",    1, SST,   V), slot(C10A, "Friday",    2, MATH,  I),
  slot(C10A, "Friday",    3, PE,    J), slot(C10A, "Friday",    4, ENG,   B),
  slot(C10A, "Friday",    5, PHY,   K), slot(C10A, "Friday",    6, CHEM,  K),
  slot(C10A, "Friday",    7, HINDI, P), slot(C10A, "Friday",    8, MATH,  I),
];

// ─── Class 10-B ───────────────────────────────────────────────────────────────
const C10B = "cls_10B";
const TT_10B: TimetableSlot[] = [
  // Monday
  slot(C10B, "Monday",    1, ENG,   B), slot(C10B, "Monday",    2, MATH,  I),
  slot(C10B, "Monday",    3, CS,    M), slot(C10B, "Monday",    4, SST,   V),
  slot(C10B, "Monday",    5, MATH,  I), slot(C10B, "Monday",    6, PHY,   K),
  slot(C10B, "Monday",    7, HINDI, P), slot(C10B, "Monday",    8, ENG,   B),
  // Tuesday
  slot(C10B, "Tuesday",   1, MATH,  I), slot(C10B, "Tuesday",   2, CS,    M),
  slot(C10B, "Tuesday",   3, ENG,   B), slot(C10B, "Tuesday",   4, CHEM,  K),
  slot(C10B, "Tuesday",   5, HINDI, P), slot(C10B, "Tuesday",   6, MATH,  I),
  slot(C10B, "Tuesday",   7, SST,   V), slot(C10B, "Tuesday",   8, PE,    J),
  // Wednesday
  slot(C10B, "Wednesday", 1, HINDI, P), slot(C10B, "Wednesday", 2, ENG,   B),
  slot(C10B, "Wednesday", 3, MATH,  I), slot(C10B, "Wednesday", 4, PHY,   K),
  slot(C10B, "Wednesday", 5, SST,   V), slot(C10B, "Wednesday", 6, BIO,   K),
  slot(C10B, "Wednesday", 7, MATH,  I), slot(C10B, "Wednesday", 8, CS,    M),
  // Thursday
  slot(C10B, "Thursday",  1, SST,   V), slot(C10B, "Thursday",  2, HINDI, P),
  slot(C10B, "Thursday",  3, CHEM,  K), slot(C10B, "Thursday",  4, ENG,   B),
  slot(C10B, "Thursday",  5, PHY,   K), slot(C10B, "Thursday",  6, MATH,  I),
  slot(C10B, "Thursday",  7, BIO,   K), slot(C10B, "Thursday",  8, ENG,   B),
  // Friday
  slot(C10B, "Friday",    1, MATH,  I), slot(C10B, "Friday",    2, PHY,   K),
  slot(C10B, "Friday",    3, HINDI, P), slot(C10B, "Friday",    4, SST,   V),
  slot(C10B, "Friday",    5, CS,    M), slot(C10B, "Friday",    6, ENG,   B),
  slot(C10B, "Friday",    7, MATH,  I), slot(C10B, "Friday",    8, PE,    J),
];

// ─── Class 9-A ────────────────────────────────────────────────────────────────
const C9A = "cls_9A";
const TT_9A: TimetableSlot[] = [
  // Monday
  slot(C9A, "Monday",    1, SCI,   K), slot(C9A, "Monday",    2, MATH,  I),
  slot(C9A, "Monday",    3, ENG,   B), slot(C9A, "Monday",    4, SST,   V),
  slot(C9A, "Monday",    5, HINDI, P), slot(C9A, "Monday",    6, CS,    M),
  slot(C9A, "Monday",    7, MATH,  I), slot(C9A, "Monday",    8, PE,    J),
  // Tuesday
  slot(C9A, "Tuesday",   1, MATH,  I), slot(C9A, "Tuesday",   2, ENG,   B),
  slot(C9A, "Tuesday",   3, HINDI, P), slot(C9A, "Tuesday",   4, SCI,   K),
  slot(C9A, "Tuesday",   5, SST,   V), slot(C9A, "Tuesday",   6, MATH,  I),
  slot(C9A, "Tuesday",   7, CS,    M), slot(C9A, "Tuesday",   8, SCI,   K),
  // Wednesday
  slot(C9A, "Wednesday", 1, ENG,   B), slot(C9A, "Wednesday", 2, SST,   V),
  slot(C9A, "Wednesday", 3, SCI,   K), slot(C9A, "Wednesday", 4, MATH,  I),
  slot(C9A, "Wednesday", 5, CS,    M), slot(C9A, "Wednesday", 6, HINDI, P),
  slot(C9A, "Wednesday", 7, ENG,   B), slot(C9A, "Wednesday", 8, PE,    J),
  // Thursday
  slot(C9A, "Thursday",  1, SST,   V), slot(C9A, "Thursday",  2, MATH,  I),
  slot(C9A, "Thursday",  3, SCI,   K), slot(C9A, "Thursday",  4, ENG,   B),
  slot(C9A, "Thursday",  5, MATH,  I), slot(C9A, "Thursday",  6, SST,   V),
  slot(C9A, "Thursday",  7, HINDI, P), slot(C9A, "Thursday",  8, SCI,   K),
  // Friday
  slot(C9A, "Friday",    1, HINDI, P), slot(C9A, "Friday",    2, CS,    M),
  slot(C9A, "Friday",    3, MATH,  I), slot(C9A, "Friday",    4, SCI,   K),
  slot(C9A, "Friday",    5, ENG,   B), slot(C9A, "Friday",    6, MATH,  I),
  slot(C9A, "Friday",    7, SST,   V), slot(C9A, "Friday",    8, PE,    J),
];

// ─── Class 8-C ────────────────────────────────────────────────────────────────
const C8C = "cls_8C";
const TT_8C: TimetableSlot[] = [
  slot(C8C, "Monday",    1, MATH,  I), slot(C8C, "Monday",    2, HINDI, P),
  slot(C8C, "Monday",    3, SST,   V), slot(C8C, "Monday",    4, ENG,   B),
  slot(C8C, "Monday",    5, SCI,   K), slot(C8C, "Monday",    6, MATH,  I),
  slot(C8C, "Monday",    7, CS,    M), slot(C8C, "Monday",    8, PE,    J),

  slot(C8C, "Tuesday",   1, ENG,   B), slot(C8C, "Tuesday",   2, SCI,   K),
  slot(C8C, "Tuesday",   3, MATH,  I), slot(C8C, "Tuesday",   4, HINDI, P),
  slot(C8C, "Tuesday",   5, SST,   V), slot(C8C, "Tuesday",   6, ENG,   B),
  slot(C8C, "Tuesday",   7, MATH,  I), slot(C8C, "Tuesday",   8, SCI,   K),

  slot(C8C, "Wednesday", 1, SST,   V), slot(C8C, "Wednesday", 2, ENG,   B),
  slot(C8C, "Wednesday", 3, HINDI, P), slot(C8C, "Wednesday", 4, MATH,  I),
  slot(C8C, "Wednesday", 5, SCI,   K), slot(C8C, "Wednesday", 6, CS,    M),
  slot(C8C, "Wednesday", 7, HINDI, P), slot(C8C, "Wednesday", 8, PE,    J),

  slot(C8C, "Thursday",  1, SCI,   K), slot(C8C, "Thursday",  2, MATH,  I),
  slot(C8C, "Thursday",  3, ENG,   B), slot(C8C, "Thursday",  4, SST,   V),
  slot(C8C, "Thursday",  5, HINDI, P), slot(C8C, "Thursday",  6, MATH,  I),
  slot(C8C, "Thursday",  7, SCI,   K), slot(C8C, "Thursday",  8, ENG,   B),

  slot(C8C, "Friday",    1, HINDI, P), slot(C8C, "Friday",    2, SST,   V),
  slot(C8C, "Friday",    3, SCI,   K), slot(C8C, "Friday",    4, ENG,   B),
  slot(C8C, "Friday",    5, MATH,  I), slot(C8C, "Friday",    6, PE,    J),
  slot(C8C, "Friday",    7, MATH,  I), slot(C8C, "Friday",    8, CS,    M),
];

// ─── Class 7-A ────────────────────────────────────────────────────────────────
const C7A = "cls_7A";
const TT_7A: TimetableSlot[] = [
  slot(C7A, "Monday",    1, ENG,   B), slot(C7A, "Monday",    2, MATH,  I),
  slot(C7A, "Monday",    3, HINDI, P), slot(C7A, "Monday",    4, SCI,   K),
  slot(C7A, "Monday",    5, SST,   V), slot(C7A, "Monday",    6, ENG,   B),
  slot(C7A, "Monday",    7, MATH,  I), slot(C7A, "Monday",    8, PE,    J),

  slot(C7A, "Tuesday",   1, MATH,  I), slot(C7A, "Tuesday",   2, SST,   V),
  slot(C7A, "Tuesday",   3, ENG,   B), slot(C7A, "Tuesday",   4, HINDI, P),
  slot(C7A, "Tuesday",   5, MATH,  I), slot(C7A, "Tuesday",   6, SCI,   K),
  slot(C7A, "Tuesday",   7, HINDI, P), slot(C7A, "Tuesday",   8, ENG,   B),

  slot(C7A, "Wednesday", 1, SCI,   K), slot(C7A, "Wednesday", 2, MATH,  I),
  slot(C7A, "Wednesday", 3, SST,   V), slot(C7A, "Wednesday", 4, ENG,   B),
  slot(C7A, "Wednesday", 5, HINDI, P), slot(C7A, "Wednesday", 6, MATH,  I),
  slot(C7A, "Wednesday", 7, SCI,   K), slot(C7A, "Wednesday", 8, PE,    J),

  slot(C7A, "Thursday",  1, HINDI, P), slot(C7A, "Thursday",  2, ENG,   B),
  slot(C7A, "Thursday",  3, MATH,  I), slot(C7A, "Thursday",  4, SCI,   K),
  slot(C7A, "Thursday",  5, SST,   V), slot(C7A, "Thursday",  6, HINDI, P),
  slot(C7A, "Thursday",  7, ENG,   B), slot(C7A, "Thursday",  8, MATH,  I),

  slot(C7A, "Friday",    1, SST,   V), slot(C7A, "Friday",    2, SCI,   K),
  slot(C7A, "Friday",    3, ENG,   B), slot(C7A, "Friday",    4, MATH,  I),
  slot(C7A, "Friday",    5, HINDI, P), slot(C7A, "Friday",    6, SST,   V),
  slot(C7A, "Friday",    7, MATH,  I), slot(C7A, "Friday",    8, PE,    J),
];

export const MOCK_TIMETABLE_SLOTS: TimetableSlot[] = [
  ...TT_10A, ...TT_10B, ...TT_9A, ...TT_8C, ...TT_7A,
];
