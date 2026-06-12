import { z } from "zod";
import { BLOOD_GROUPS, GUARDIAN_RELATIONSHIPS, INDIAN_STATES_LIST } from "../data/studentOptions";

const PHONE_RE = /^(?:\+91[-\s]?|0)?[6-9]\d{9}$/;
const PINCODE_RE = /^[1-9]\d{5}$/;

export const addressSchema = z.object({
  line1: z.string().trim().min(3, "Address line 1 is required").max(150),
  line2: z.string().trim().max(150).optional().or(z.literal("")),
  city: z.string().trim().min(2, "City is required").max(80),
  state: z
    .string()
    .trim()
    .min(1, "Please select a state / UT")
    .refine(
      (v) => (INDIAN_STATES_LIST as readonly string[]).includes(v),
      "Please select a valid Indian state / UT",
    ),
  pincode: z
    .string()
    .trim()
    .min(1, "Pincode is required")
    .regex(PINCODE_RE, "Enter a valid 6-digit Indian pincode"),
});

export const guardianSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(60)
    .regex(/^[A-Za-z\s'.]+$/, "Only letters, spaces, apostrophes, or dots allowed"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(60)
    .regex(/^[A-Za-z\s'.]+$/, "Only letters, spaces, apostrophes, or dots allowed"),
  relationship: z.enum(
    GUARDIAN_RELATIONSHIPS.map((r) => r.value) as [string, ...string[]],
    { error: "Please select a relationship" },
  ),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .regex(PHONE_RE, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email("Enter a valid email").max(254).optional().or(z.literal("")),
  occupation: z.string().trim().max(80).optional().or(z.literal("")),
  isPrimary: z.boolean(),
});

export const emergencyContactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  relationship: z.string().trim().min(1, "Relationship is required").max(60),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .regex(PHONE_RE, "Enter a valid 10-digit Indian mobile number"),
});

const MAX_DOB = new Date();
MAX_DOB.setFullYear(MAX_DOB.getFullYear() - 3);
const MIN_DOB = new Date();
MIN_DOB.setFullYear(MIN_DOB.getFullYear() - 25);

export const studentFormSchema = z.object({
  photoUrl: z.string().nullable().optional(),

  // Admission
  admissionNumber: z
    .string()
    .trim()
    .min(2, "Admission number is required")
    .max(30)
    .regex(/^[A-Za-z0-9\-/]+$/, "Only letters, digits, hyphens, or slashes"),
  rollNumber: z.string().trim().max(20).optional().or(z.literal("")),
  admissionDate: z
    .string()
    .min(1, "Admission date is required")
    .refine((v) => !Number.isNaN(new Date(v).getTime()), "Enter a valid date")
    .refine((v) => new Date(v) <= new Date(), "Admission date cannot be in the future"),
  academicYear: z.string().min(1, "Academic year is required"),
  currentClassId: z.string().min(1, "Please assign a class"),

  // Personal
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(60)
    .regex(/^[A-Za-z\s'.]+$/, "Only letters, spaces, apostrophes, or dots"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(60)
    .regex(/^[A-Za-z\s'.]+$/, "Only letters, spaces, apostrophes, or dots"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((v) => !Number.isNaN(new Date(v).getTime()), "Enter a valid date")
    .refine((v) => new Date(v) <= MAX_DOB, "Student must be at least 3 years old")
    .refine((v) => new Date(v) >= MIN_DOB, "Date of birth appears too far in the past"),
  sex: z.enum(["MALE", "FEMALE", "OTHER"] as const, { error: "Please select sex" }),
  bloodGroup: z.enum(BLOOD_GROUPS as unknown as [string, ...string[]], {
    error: "Please select blood group",
  }),
  email: z.string().trim().email("Enter a valid email").max(254).optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(PHONE_RE, "Enter a valid 10-digit Indian mobile number")
    .optional()
    .or(z.literal("")),

  // Address
  address: addressSchema,

  // Status
  status: z.enum(["ACTIVE", "INACTIVE", "TRANSFERRED", "GRADUATED"] as const),

  // Primary guardian (required on admission)
  guardian: guardianSchema,
});

export const promotionSchema = z.object({
  toClassId: z.string().min(1, "Please select a class to promote to"),
  academicYear: z.string().min(1, "Academic year is required"),
  remarks: z.string().trim().max(200).optional().or(z.literal("")),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
export type GuardianFormValues = z.infer<typeof guardianSchema>;
export type EmergencyContactFormValues = z.infer<typeof emergencyContactSchema>;
export type PromotionFormValues = z.infer<typeof promotionSchema>;
