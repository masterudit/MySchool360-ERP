import { z } from "zod";
import {
  CONTACT_MODES,
  DESIGNATIONS,
  INDIAN_STATES,
  REFERRAL_SOURCES,
  SCHOOL_BOARDS,
  STAFF_COUNT_RANGES,
  STUDENT_COUNT_RANGES,
  TIME_SLOTS,
} from "../data/getStartedOptions";

const INDIAN_PHONE_RE = /^(?:\+91[-\s]?|0)?[6-9]\d{9}$/;

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const maxDate = () => {
  const d = today();
  d.setDate(d.getDate() + 30);
  return d;
};

export const getStartedSchema = z.object({
  // About you
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(100, "Name must be 100 characters or fewer")
    .regex(/^[A-Za-z\s'.]+$/, "Name may only contain letters, spaces, apostrophes, or dots"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(254),

  phone: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .regex(
      INDIAN_PHONE_RE,
      "Enter a valid 10-digit Indian mobile number (e.g. 9876543210 or +91 9876543210)",
    ),

  designation: z.enum(DESIGNATIONS, { error: "Please select your designation" }),

  // School details
  schoolName: z
    .string()
    .trim()
    .min(2, "School name is required")
    .max(150, "School name must be 150 characters or fewer"),

  board: z.enum(SCHOOL_BOARDS, { error: "Please select a board / curriculum" }),

  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(80, "City must be 80 characters or fewer")
    .regex(/^[A-Za-z\s'.()-]+$/, "Enter a valid city name"),

  state: z.enum(INDIAN_STATES, { error: "Please select a state / UT" }),

  studentCount: z.enum(STUDENT_COUNT_RANGES, { error: "Please select student count" }),

  staffCount: z.enum(STAFF_COUNT_RANGES, { error: "Please select staff count" }),

  // Schedule
  preferredDate: z
    .string()
    .min(1, "Please select a preferred date")
    .refine((val) => {
      const d = new Date(val);
      return !Number.isNaN(d.getTime());
    }, "Enter a valid date")
    .refine((val) => {
      const d = new Date(`${val}T00:00:00`);
      return d >= today();
    }, "Date cannot be in the past")
    .refine((val) => {
      const d = new Date(`${val}T00:00:00`);
      return d <= maxDate();
    }, "Please select a date within the next 30 days"),

  preferredTimeSlot: z.enum(TIME_SLOTS, { error: "Please select a preferred time slot" }),

  contactMode: z.enum(CONTACT_MODES, { error: "Please select a preferred contact mode" }),

  // Extra
  message: z
    .string()
    .trim()
    .max(500, "Message must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),

  referralSource: z.enum(REFERRAL_SOURCES, { error: "Please let us know how you heard about us" }),

  consent: z
    .boolean()
    .refine((val) => val === true, "Please agree to be contacted by our team"),
});

export type GetStartedFormValues = z.infer<typeof getStartedSchema>;

export const EMPTY_GET_STARTED_FORM: GetStartedFormValues = {
  fullName: "",
  email: "",
  phone: "",
  designation: "Principal",
  schoolName: "",
  board: "CBSE",
  city: "",
  state: "Maharashtra",
  studentCount: "200 – 500",
  staffCount: "20 – 50",
  preferredDate: "",
  preferredTimeSlot: "9:00 AM – 11:00 AM",
  contactMode: "Phone call",
  message: "",
  referralSource: "Google search",
  consent: false,
};
