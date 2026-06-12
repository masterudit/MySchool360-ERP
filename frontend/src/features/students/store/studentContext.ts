import { createContext } from "react";
import type { Student, Guardian, EmergencyContact, StudentDocument, StudentStatus } from "../types/student.types";
import type { ParsedStudent } from "../utils/csvParser";
import type { PromotionFormValues } from "../schemas/student.schema";

export type StudentStoreValue = {
  students: Student[];
  getById: (id: string) => Student | undefined;
  addStudent: (data: Omit<Student, "id" | "schoolId" | "guardians" | "emergencyContacts" | "documents" | "classHistory"> & { guardian: Omit<Guardian, "id"> }) => Student;
  updateStudent: (id: string, data: Omit<Student, "id" | "schoolId" | "guardians" | "emergencyContacts" | "documents" | "classHistory"> & { guardian: Omit<Guardian, "id"> }) => void;
  updateStatus: (id: string, status: StudentStatus) => void;
  promoteStudent: (id: string, form: PromotionFormValues) => void;

  addGuardian: (studentId: string, guardian: Omit<Guardian, "id">) => void;
  updateGuardian: (studentId: string, guardianId: string, data: Omit<Guardian, "id">) => void;
  removeGuardian: (studentId: string, guardianId: string) => void;
  setPrimaryGuardian: (studentId: string, guardianId: string) => void;

  addEmergencyContact: (studentId: string, contact: Omit<EmergencyContact, "id">) => void;
  removeEmergencyContact: (studentId: string, contactId: string) => void;

  addDocument: (studentId: string, doc: Omit<StudentDocument, "id" | "uploadedAt">) => void;
  removeDocument: (studentId: string, docId: string) => void;

  bulkImport: (rows: ParsedStudent[]) => { imported: number };
};

export const StudentStoreContext = createContext<StudentStoreValue | undefined>(undefined);
