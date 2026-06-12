import { CLASSES } from "../../staff/data/academics";
import { BLOOD_GROUPS } from "../data/studentOptions";
import type { Student } from "../types/student.types";
import { CURRENT_ACADEMIC_YEAR } from "../data/studentOptions";

export type CsvRow = Record<string, string>;
export type ParsedStudent = Omit<Student, "id" | "schoolId" | "documents" | "classHistory"> & {
  guardians: Student["guardians"];
  emergencyContacts: Student["emergencyContacts"];
};

export type CsvImportResult = {
  valid: ParsedStudent[];
  errors: { row: number; data: CsvRow; errors: string[] }[];
};

const CLASS_BY_LABEL = new Map(CLASSES.map((c) => [c.label.toLowerCase(), c.id]));
const CLASS_BY_ID = new Map(CLASSES.map((c) => [c.id.toLowerCase(), c.id]));

function findClassId(raw: string): string | null {
  const key = raw.trim().toLowerCase();
  return CLASS_BY_LABEL.get(key) ?? CLASS_BY_ID.get(key) ?? null;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseCsv(raw: string): CsvRow[] {
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: CsvRow = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ""; });
    return row;
  });
}

const PHONE_RE = /^(?:\+91[-\s]?|0)?[6-9]\d{9}$/;
const PINCODE_RE = /^[1-9]\d{5}$/;

function normalizePhone(raw: string) { return raw.replace(/[-\s]/g, ""); }

export function validateAndTransform(rows: CsvRow[]): CsvImportResult {
  const valid: ParsedStudent[] = [];
  const errors: CsvImportResult["errors"] = [];
  const seenAdmission = new Set<string>();

  rows.forEach((row, idx) => {
    const rowNum = idx + 2;
    const errs: string[] = [];

    const admNo = row.admission_number?.trim();
    const firstName = row.first_name?.trim();
    const lastName = row.last_name?.trim();
    const dob = row.date_of_birth?.trim();
    const sex = row.sex?.toUpperCase().trim();
    const bloodGroup = row.blood_group?.toUpperCase().replace(" ", "").trim();
    const classRaw = row.class?.trim();
    const guardianName = row.guardian_name?.trim();
    const guardianPhone = normalizePhone(row.guardian_phone?.trim() ?? "");
    const guardianRel = row.guardian_relationship?.toUpperCase().trim() || "GUARDIAN";
    const city = row.city?.trim();
    const state = row.state?.trim();
    const pincode = row.pincode?.trim();
    const line1 = row.address?.trim() || "—";

    if (!admNo) errs.push("admission_number is required");
    else if (seenAdmission.has(admNo)) errs.push(`Duplicate admission_number "${admNo}" in this file`);

    if (!firstName) errs.push("first_name is required");
    if (!lastName) errs.push("last_name is required");

    if (!dob) { errs.push("date_of_birth is required"); }
    else {
      const formats = [
        dob.match(/^(\d{2})\/(\d{2})\/(\d{4})$/) ? `${dob.split("/")[2]}-${dob.split("/")[1]}-${dob.split("/")[0]}` : null,
        dob.match(/^\d{4}-\d{2}-\d{2}$/) ? dob : null,
      ].find(Boolean);
      if (!formats || Number.isNaN(new Date(formats).getTime())) errs.push("date_of_birth must be DD/MM/YYYY or YYYY-MM-DD");
    }

    if (!["MALE", "FEMALE", "OTHER"].includes(sex)) errs.push(`sex must be MALE, FEMALE, or OTHER (got "${sex}")`);

    const resolvedBlood = (BLOOD_GROUPS as readonly string[]).includes(bloodGroup ?? "") ? bloodGroup : "UNKNOWN";

    const classId = classRaw ? findClassId(classRaw) : null;
    if (!classId) errs.push(`class "${classRaw}" not found. Use format "Class 10 - A" or ID like "cls_10A"`);

    if (!guardianName) errs.push("guardian_name is required");
    if (!guardianPhone || !PHONE_RE.test(guardianPhone)) errs.push("guardian_phone must be a valid Indian mobile number");

    if (!city) errs.push("city is required");
    if (!state) errs.push("state is required");
    if (pincode && !PINCODE_RE.test(pincode)) errs.push("pincode must be a valid 6-digit Indian pincode");

    if (errs.length > 0) {
      errors.push({ row: rowNum, data: row, errors: errs });
      return;
    }

    seenAdmission.add(admNo!);

    const dobIso = (() => {
      if (dob!.includes("/")) {
        const [d, m, y] = dob!.split("/");
        return `${y}-${m}-${d}`;
      }
      return dob!;
    })();

    const [gFirst, ...gRest] = (guardianName ?? "Guardian").split(" ");
    const gLast = gRest.join(" ") || "—";

    valid.push({
      admissionNumber: admNo!,
      rollNumber: row.roll_number?.trim() || undefined,
      firstName: firstName!,
      lastName: lastName!,
      dateOfBirth: dobIso,
      sex: sex as "MALE" | "FEMALE" | "OTHER",
      bloodGroup: resolvedBlood as Student["bloodGroup"],
      email: row.email?.trim() || undefined,
      phone: normalizePhone(row.phone?.trim() ?? "") || undefined,
      photoUrl: null,
      address: { line1, city: city!, state: state!, pincode: pincode || "000000" },
      status: "ACTIVE",
      currentClassId: classId!,
      admissionDate: row.admission_date?.trim() || new Date().toISOString().slice(0, 10),
      academicYear: row.academic_year?.trim() || CURRENT_ACADEMIC_YEAR,
      guardians: [{
        id: `grd_csv_${rowNum}`,
        firstName: gFirst ?? "Guardian",
        lastName: gLast,
        relationship: (["FATHER","MOTHER","GRANDPARENT","UNCLE_AUNT","SIBLING","GUARDIAN","OTHER"].includes(guardianRel) ? guardianRel : "GUARDIAN") as Student["guardians"][0]["relationship"],
        phone: guardianPhone,
        email: row.guardian_email?.trim() || undefined,
        isPrimary: true,
      }],
      emergencyContacts: [],
    });
  });

  return { valid, errors };
}

export const CSV_TEMPLATE_HEADERS = [
  "admission_number", "first_name", "last_name", "date_of_birth",
  "sex", "blood_group", "class", "roll_number",
  "guardian_name", "guardian_phone", "guardian_relationship", "guardian_email",
  "email", "phone", "address", "city", "state", "pincode",
  "admission_date", "academic_year",
].join(",");

export const CSV_TEMPLATE_EXAMPLE = [
  CSV_TEMPLATE_HEADERS,
  `2025/001,Rohan,Kapoor,15/08/2010,MALE,B+,Class 9 - A,05,Suresh Kapoor,9876543210,FATHER,suresh@email.com,,,12 MG Road,Delhi,Delhi (NCT),110001,01/04/2025,2025-26`,
].join("\n");
