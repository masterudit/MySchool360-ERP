export type StudentStatus = "ACTIVE" | "INACTIVE" | "TRANSFERRED" | "GRADUATED";
export type StudentSex = "MALE" | "FEMALE" | "OTHER";
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | "UNKNOWN";

export type GuardianRelationship =
  | "FATHER"
  | "MOTHER"
  | "GRANDPARENT"
  | "UNCLE_AUNT"
  | "SIBLING"
  | "GUARDIAN"
  | "OTHER";

export type DocumentType =
  | "BIRTH_CERTIFICATE"
  | "TRANSFER_CERTIFICATE"
  | "AADHAAR"
  | "MARKSHEET"
  | "MEDICAL"
  | "PHOTO_ID"
  | "OTHER";

export type Guardian = {
  id: string;
  firstName: string;
  lastName: string;
  relationship: GuardianRelationship;
  phone: string;
  email?: string;
  occupation?: string;
  isPrimary: boolean;
};

export type EmergencyContact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
};

export type StudentDocument = {
  id: string;
  name: string;
  type: DocumentType;
  fileName: string;
  fileDataUrl: string;
  uploadedAt: string;
};

export type ClassHistoryEntry = {
  id: string;
  fromClassId: string | null;
  toClassId: string;
  academicYear: string;
  promotedAt: string;
  remarks?: string;
};

export type StudentAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type Student = {
  id: string;
  schoolId: string;
  admissionNumber: string;
  rollNumber?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: StudentSex;
  bloodGroup: BloodGroup;
  email?: string;
  phone?: string;
  photoUrl?: string | null;
  address: StudentAddress;
  status: StudentStatus;
  currentClassId: string;
  admissionDate: string;
  academicYear: string;
  guardians: Guardian[];
  emergencyContacts: EmergencyContact[];
  documents: StudentDocument[];
  classHistory: ClassHistoryEntry[];
};
