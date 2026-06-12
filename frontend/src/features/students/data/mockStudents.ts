import type { Student } from "../types/student.types";

const S = "sch_demo_001";

export const MOCK_STUDENTS: Student[] = [
  {
    id: "stu_001", schoolId: S, admissionNumber: "2020/001", rollNumber: "01",
    firstName: "Rahul", lastName: "Gupta", dateOfBirth: "2008-03-15", sex: "MALE",
    bloodGroup: "B+", email: "rahul.gupta@student.myschool.edu", phone: "9876500001",
    photoUrl: null, status: "ACTIVE", currentClassId: "cls_10A",
    admissionDate: "2020-04-01", academicYear: "2025-26",
    address: { line1: "12, Shivaji Nagar", city: "Pune", state: "Maharashtra", pincode: "411005" },
    guardians: [
      { id: "grd_001a", firstName: "Suresh", lastName: "Gupta", relationship: "FATHER",
        phone: "9876500011", email: "suresh.gupta@email.com", occupation: "Engineer", isPrimary: true },
      { id: "grd_001b", firstName: "Anita", lastName: "Gupta", relationship: "MOTHER",
        phone: "9876500012", email: "", occupation: "Homemaker", isPrimary: false },
    ],
    emergencyContacts: [
      { id: "ec_001a", name: "Ramesh Gupta", relationship: "Uncle", phone: "9876500021" },
    ],
    documents: [],
    classHistory: [
      { id: "ch_001a", fromClassId: null, toClassId: "cls_6A", academicYear: "2020-21", promotedAt: "2020-04-01", remarks: "Fresh admission" },
      { id: "ch_001b", fromClassId: "cls_6A", toClassId: "cls_7A", academicYear: "2021-22", promotedAt: "2021-04-05" },
      { id: "ch_001c", fromClassId: "cls_7A", toClassId: "cls_8A", academicYear: "2022-23", promotedAt: "2022-04-04" },
      { id: "ch_001d", fromClassId: "cls_8A", toClassId: "cls_9A", academicYear: "2023-24", promotedAt: "2023-04-03" },
      { id: "ch_001e", fromClassId: "cls_9A", toClassId: "cls_10A", academicYear: "2024-25", promotedAt: "2024-04-01" },
    ],
  },
  {
    id: "stu_002", schoolId: S, admissionNumber: "2020/002", rollNumber: "02",
    firstName: "Priya", lastName: "Singh", dateOfBirth: "2008-07-22", sex: "FEMALE",
    bloodGroup: "O+", phone: "9876500002", photoUrl: null, status: "ACTIVE",
    currentClassId: "cls_10A", admissionDate: "2020-04-01", academicYear: "2025-26",
    address: { line1: "45, Gandhi Road", city: "Nagpur", state: "Maharashtra", pincode: "440001" },
    guardians: [
      { id: "grd_002a", firstName: "Vikram", lastName: "Singh", relationship: "FATHER",
        phone: "9876500013", email: "vikram.singh@email.com", occupation: "Doctor", isPrimary: true },
    ],
    emergencyContacts: [],
    documents: [],
    classHistory: [
      { id: "ch_002a", fromClassId: null, toClassId: "cls_6A", academicYear: "2020-21", promotedAt: "2020-04-01" },
      { id: "ch_002b", fromClassId: "cls_9A", toClassId: "cls_10A", academicYear: "2024-25", promotedAt: "2024-04-01" },
    ],
  },
  {
    id: "stu_003", schoolId: S, admissionNumber: "2020/003", rollNumber: "01",
    firstName: "Aryan", lastName: "Sharma", dateOfBirth: "2008-11-05", sex: "MALE",
    bloodGroup: "A+", phone: "9876500003", photoUrl: null, status: "ACTIVE",
    currentClassId: "cls_10B", admissionDate: "2020-04-01", academicYear: "2025-26",
    address: { line1: "7, MG Road", city: "Mumbai", state: "Maharashtra", pincode: "400001" },
    guardians: [
      { id: "grd_003a", firstName: "Deepak", lastName: "Sharma", relationship: "FATHER",
        phone: "9876500014", email: "deepak.sharma@email.com", occupation: "Business", isPrimary: true },
      { id: "grd_003b", firstName: "Neha", lastName: "Sharma", relationship: "MOTHER",
        phone: "9876500015", email: "", occupation: "Teacher", isPrimary: false },
    ],
    emergencyContacts: [
      { id: "ec_003a", name: "Ajay Sharma", relationship: "Grandfather", phone: "9876500022" },
    ],
    documents: [],
    classHistory: [
      { id: "ch_003a", fromClassId: null, toClassId: "cls_6B", academicYear: "2020-21", promotedAt: "2020-04-01" },
      { id: "ch_003b", fromClassId: "cls_9B", toClassId: "cls_10B", academicYear: "2024-25", promotedAt: "2024-04-01" },
    ],
  },
  {
    id: "stu_004", schoolId: S, admissionNumber: "2021/001", rollNumber: "01",
    firstName: "Sneha", lastName: "Verma", dateOfBirth: "2009-02-14", sex: "FEMALE",
    bloodGroup: "AB+", phone: "9876500004", photoUrl: null, status: "ACTIVE",
    currentClassId: "cls_9A", admissionDate: "2021-04-01", academicYear: "2025-26",
    address: { line1: "23, Rajiv Colony", city: "Jaipur", state: "Rajasthan", pincode: "302001" },
    guardians: [
      { id: "grd_004a", firstName: "Rakesh", lastName: "Verma", relationship: "FATHER",
        phone: "9876500016", email: "rakesh.verma@email.com", occupation: "Govt. Employee", isPrimary: true },
    ],
    emergencyContacts: [
      { id: "ec_004a", name: "Sunita Verma", relationship: "Aunt", phone: "9876500023" },
    ],
    documents: [],
    classHistory: [
      { id: "ch_004a", fromClassId: null, toClassId: "cls_8A", academicYear: "2021-22", promotedAt: "2021-04-01" },
      { id: "ch_004b", fromClassId: "cls_8A", toClassId: "cls_9A", academicYear: "2022-23", promotedAt: "2022-04-04" },
    ],
  },
  {
    id: "stu_005", schoolId: S, admissionNumber: "2021/002", rollNumber: "02",
    firstName: "Amit", lastName: "Kumar", dateOfBirth: "2009-08-30", sex: "MALE",
    bloodGroup: "O-", phone: "9876500005", photoUrl: null, status: "ACTIVE",
    currentClassId: "cls_9A", admissionDate: "2021-04-01", academicYear: "2025-26",
    address: { line1: "89, Nehru Nagar", city: "Lucknow", state: "Uttar Pradesh", pincode: "226001" },
    guardians: [
      { id: "grd_005a", firstName: "Manoj", lastName: "Kumar", relationship: "FATHER",
        phone: "9876500017", email: "", occupation: "Shopkeeper", isPrimary: true },
      { id: "grd_005b", firstName: "Sunita", lastName: "Kumar", relationship: "MOTHER",
        phone: "9876500018", email: "", occupation: "Homemaker", isPrimary: false },
    ],
    emergencyContacts: [],
    documents: [],
    classHistory: [
      { id: "ch_005a", fromClassId: null, toClassId: "cls_8A", academicYear: "2021-22", promotedAt: "2021-04-01" },
      { id: "ch_005b", fromClassId: "cls_8A", toClassId: "cls_9A", academicYear: "2022-23", promotedAt: "2022-04-04" },
    ],
  },
  {
    id: "stu_006", schoolId: S, admissionNumber: "2022/001", rollNumber: "01",
    firstName: "Riya", lastName: "Mehta", dateOfBirth: "2010-05-19", sex: "FEMALE",
    bloodGroup: "B-", phone: "9876500006", photoUrl: null, status: "ACTIVE",
    currentClassId: "cls_8C", admissionDate: "2022-04-01", academicYear: "2025-26",
    address: { line1: "56, Tagore Road", city: "Ahmedabad", state: "Gujarat", pincode: "380001" },
    guardians: [
      { id: "grd_006a", firstName: "Nilesh", lastName: "Mehta", relationship: "FATHER",
        phone: "9876500019", email: "nilesh.mehta@email.com", occupation: "CA", isPrimary: true },
    ],
    emergencyContacts: [
      { id: "ec_006a", name: "Kavita Mehta", relationship: "Mother", phone: "9876500024" },
    ],
    documents: [],
    classHistory: [
      { id: "ch_006a", fromClassId: null, toClassId: "cls_6C", academicYear: "2022-23", promotedAt: "2022-04-01" },
      { id: "ch_006b", fromClassId: "cls_6C", toClassId: "cls_7C", academicYear: "2023-24", promotedAt: "2023-04-03" },
      { id: "ch_006c", fromClassId: "cls_7C", toClassId: "cls_8C", academicYear: "2024-25", promotedAt: "2024-04-01" },
    ],
  },
  {
    id: "stu_007", schoolId: S, admissionNumber: "2022/002", rollNumber: "02",
    firstName: "Kartik", lastName: "Nair", dateOfBirth: "2010-12-03", sex: "MALE",
    bloodGroup: "A-", phone: "9876500007", photoUrl: null, status: "ACTIVE",
    currentClassId: "cls_8C", admissionDate: "2022-04-01", academicYear: "2025-26",
    address: { line1: "34, Patel Street", city: "Kochi", state: "Kerala", pincode: "682001" },
    guardians: [
      { id: "grd_007a", firstName: "Arun", lastName: "Nair", relationship: "FATHER",
        phone: "9876500020", email: "arun.nair@email.com", occupation: "IT Professional", isPrimary: true },
    ],
    emergencyContacts: [],
    documents: [],
    classHistory: [
      { id: "ch_007a", fromClassId: null, toClassId: "cls_6C", academicYear: "2022-23", promotedAt: "2022-04-01" },
      { id: "ch_007b", fromClassId: "cls_7C", toClassId: "cls_8C", academicYear: "2024-25", promotedAt: "2024-04-01" },
    ],
  },
  {
    id: "stu_008", schoolId: S, admissionNumber: "2023/001", rollNumber: "01",
    firstName: "Ananya", lastName: "Das", dateOfBirth: "2011-09-07", sex: "FEMALE",
    bloodGroup: "O+", phone: "9876500008", photoUrl: null, status: "ACTIVE",
    currentClassId: "cls_7A", admissionDate: "2023-04-01", academicYear: "2025-26",
    address: { line1: "78, Lake Road", city: "Kolkata", state: "West Bengal", pincode: "700001" },
    guardians: [
      { id: "grd_008a", firstName: "Subhash", lastName: "Das", relationship: "FATHER",
        phone: "9876500025", email: "subhash.das@email.com", occupation: "Professor", isPrimary: true },
      { id: "grd_008b", firstName: "Rina", lastName: "Das", relationship: "MOTHER",
        phone: "9876500026", email: "rina.das@email.com", occupation: "Nurse", isPrimary: false },
    ],
    emergencyContacts: [
      { id: "ec_008a", name: "Prashant Das", relationship: "Uncle", phone: "9876500027" },
    ],
    documents: [],
    classHistory: [
      { id: "ch_008a", fromClassId: null, toClassId: "cls_6A", academicYear: "2023-24", promotedAt: "2023-04-01" },
      { id: "ch_008b", fromClassId: "cls_6A", toClassId: "cls_7A", academicYear: "2024-25", promotedAt: "2024-04-01" },
    ],
  },
  {
    id: "stu_009", schoolId: S, admissionNumber: "2023/002", rollNumber: "02",
    firstName: "Vikash", lastName: "Rao", dateOfBirth: "2011-04-25", sex: "MALE",
    bloodGroup: "B+", phone: "9876500009", photoUrl: null, status: "ACTIVE",
    currentClassId: "cls_7A", admissionDate: "2023-04-01", academicYear: "2025-26",
    address: { line1: "22, Temple Street", city: "Hyderabad", state: "Telangana", pincode: "500001" },
    guardians: [
      { id: "grd_009a", firstName: "Venkat", lastName: "Rao", relationship: "FATHER",
        phone: "9876500028", email: "", occupation: "Farmer", isPrimary: true },
    ],
    emergencyContacts: [],
    documents: [],
    classHistory: [
      { id: "ch_009a", fromClassId: null, toClassId: "cls_6A", academicYear: "2023-24", promotedAt: "2023-04-01" },
      { id: "ch_009b", fromClassId: "cls_6A", toClassId: "cls_7A", academicYear: "2024-25", promotedAt: "2024-04-01" },
    ],
  },
  {
    id: "stu_010", schoolId: S, admissionNumber: "2024/001", rollNumber: "01",
    firstName: "Meera", lastName: "Patel", dateOfBirth: "2012-01-18", sex: "FEMALE",
    bloodGroup: "AB-", phone: "9876500010", photoUrl: null, status: "INACTIVE",
    currentClassId: "cls_6B", admissionDate: "2024-04-01", academicYear: "2025-26",
    address: { line1: "10, Sardar Patel Road", city: "Surat", state: "Gujarat", pincode: "395001" },
    guardians: [
      { id: "grd_010a", firstName: "Rohit", lastName: "Patel", relationship: "FATHER",
        phone: "9876500029", email: "rohit.patel@email.com", occupation: "Textile Merchant", isPrimary: true },
    ],
    emergencyContacts: [],
    documents: [],
    classHistory: [
      { id: "ch_010a", fromClassId: null, toClassId: "cls_6B", academicYear: "2024-25", promotedAt: "2024-04-01", remarks: "Fresh admission" },
    ],
  },
];
