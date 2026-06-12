import { z } from "zod";

export const STAFF_ROLES = [
  "PRINCIPAL",
  "VICE_PRINCIPAL",
  "TEACHER",
  "OFFICE_STAFF",
  "LIBRARIAN",
  "ACCOUNTANT",
] as const;

export const STAFF_STATUSES = ["ACTIVE", "INACTIVE"] as const;

export const SEX_OPTIONS = [
  "MALE",
  "FEMALE",
  "OTHER",
  "PREFER_NOT_TO_SAY",
] as const;

// Accepts: 9876543210 | 09876543210 | +919876543210 | +91-98765-43210 | +91 98765 43210
const INDIAN_PHONE_RE = /^(?:\+91[-\s]?|0)?[6-9]\d{9}$/;

const assignmentSchema = z.object({
  classId: z.string().min(1, "Select a class"),
  subjectId: z.string().min(1, "Select a subject"),
});

export const staffFormSchema = z
  .object({
    photoUrl: z.string().nullable().optional(),

    employeeCode: z
      .string()
      .trim()
      .min(2, "Employee code must be at least 2 characters")
      .max(20, "Employee code must be 20 characters or fewer")
      .regex(/^[A-Za-z0-9\-_]+$/, "Only letters, digits, hyphens, and underscores allowed"),

    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(60, "First name must be 60 characters or fewer")
      .regex(/^[A-Za-z\s'.]+$/, "First name may only contain letters, spaces, apostrophes, or dots"),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(60, "Last name must be 60 characters or fewer")
      .regex(/^[A-Za-z\s'.]+$/, "Last name may only contain letters, spaces, apostrophes, or dots"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address")
      .max(254, "Email is too long"),

    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(INDIAN_PHONE_RE, "Enter a valid 10-digit Indian mobile number (e.g. 9876543210 or +91 9876543210)"),

    sex: z.enum(SEX_OPTIONS, { error: "Please select a gender" }),

    role: z.enum(STAFF_ROLES, { error: "Please select a role" }),

    department: z
      .string()
      .trim()
      .max(80, "Department name must be 80 characters or fewer")
      .optional()
      .or(z.literal("")),

    dateOfJoining: z
      .string()
      .min(1, "Date of joining is required")
      .refine((val) => !Number.isNaN(new Date(val).getTime()), "Enter a valid date")
      .refine((val) => new Date(val) <= new Date(), "Date of joining cannot be in the future"),

    status: z.enum(STAFF_STATUSES),

    classTeacherOf: z.string().optional().or(z.literal("")),

    assignments: z.array(assignmentSchema),
  })
  .superRefine((data, ctx) => {
    if (data.role !== "TEACHER") return;
    const seen = new Set<string>();
    data.assignments.forEach((entry, index) => {
      const key = `${entry.classId}::${entry.subjectId}`;
      if (seen.has(key)) {
        ctx.addIssue({
          code: "custom",
          path: ["assignments", index, "subjectId"],
          message: "This class + subject combination is already added",
        });
      }
      seen.add(key);
    });
  });

export type StaffFormValues = z.infer<typeof staffFormSchema>;
