import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { MOCK_STUDENTS } from "../data/mockStudents";
import type { Student, StudentDocument, StudentStatus } from "../types/student.types";
import { loadStudents, saveStudents } from "./studentStorage";
import { StudentStoreContext, type StudentStoreValue } from "./studentContext";

const SCHOOL_ID = "sch_demo_001";

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function StudentStoreProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(() => loadStudents() ?? MOCK_STUDENTS);

  useEffect(() => { saveStudents(students); }, [students]);

  const getById = useCallback((id: string) => students.find((s) => s.id === id), [students]);

  const addStudent = useCallback<StudentStoreValue["addStudent"]>((data) => {
    const { guardian, ...rest } = data;
    const created: Student = {
      ...rest,
      id: uid("stu"),
      schoolId: SCHOOL_ID,
      guardians: [{ ...guardian, id: uid("grd") }],
      emergencyContacts: [],
      documents: [],
      classHistory: [{
        id: uid("ch"),
        fromClassId: null,
        toClassId: rest.currentClassId,
        academicYear: rest.academicYear,
        promotedAt: rest.admissionDate,
        remarks: "Initial admission",
      }],
    };
    setStudents((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateStudent = useCallback<StudentStoreValue["updateStudent"]>((id, data) => {
    const { guardian, ...rest } = data;
    setStudents((prev) => prev.map((s) => {
      if (s.id !== id) return s;
      const primaryIdx = s.guardians.findIndex((g) => g.isPrimary);
      const updatedGuardians = [...s.guardians];
      if (primaryIdx >= 0) {
        updatedGuardians[primaryIdx] = { ...updatedGuardians[primaryIdx], ...guardian };
      }
      return { ...s, ...rest, guardians: updatedGuardians };
    }));
  }, []);

  const updateStatus = useCallback<StudentStoreValue["updateStatus"]>((id, status: StudentStatus) => {
    setStudents((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
  }, []);

  const promoteStudent = useCallback<StudentStoreValue["promoteStudent"]>((id, form) => {
    setStudents((prev) => prev.map((s) => {
      if (s.id !== id) return s;
      const entry = {
        id: uid("ch"),
        fromClassId: s.currentClassId,
        toClassId: form.toClassId,
        academicYear: form.academicYear,
        promotedAt: new Date().toISOString().slice(0, 10),
        remarks: form.remarks || undefined,
      };
      return { ...s, currentClassId: form.toClassId, academicYear: form.academicYear, classHistory: [...s.classHistory, entry] };
    }));
  }, []);

  const addGuardian = useCallback<StudentStoreValue["addGuardian"]>((studentId, guardian) => {
    setStudents((prev) => prev.map((s) =>
      s.id !== studentId ? s : { ...s, guardians: [...s.guardians, { ...guardian, id: uid("grd") }] }
    ));
  }, []);

  const updateGuardian = useCallback<StudentStoreValue["updateGuardian"]>((studentId, guardianId, data) => {
    setStudents((prev) => prev.map((s) =>
      s.id !== studentId ? s : {
        ...s, guardians: s.guardians.map((g) => g.id === guardianId ? { ...g, ...data } : g)
      }
    ));
  }, []);

  const removeGuardian = useCallback<StudentStoreValue["removeGuardian"]>((studentId, guardianId) => {
    setStudents((prev) => prev.map((s) =>
      s.id !== studentId ? s : { ...s, guardians: s.guardians.filter((g) => g.id !== guardianId) }
    ));
  }, []);

  const setPrimaryGuardian = useCallback<StudentStoreValue["setPrimaryGuardian"]>((studentId, guardianId) => {
    setStudents((prev) => prev.map((s) =>
      s.id !== studentId ? s : {
        ...s, guardians: s.guardians.map((g) => ({ ...g, isPrimary: g.id === guardianId }))
      }
    ));
  }, []);

  const addEmergencyContact = useCallback<StudentStoreValue["addEmergencyContact"]>((studentId, contact) => {
    setStudents((prev) => prev.map((s) =>
      s.id !== studentId ? s : {
        ...s, emergencyContacts: [...s.emergencyContacts, { ...contact, id: uid("ec") }]
      }
    ));
  }, []);

  const removeEmergencyContact = useCallback<StudentStoreValue["removeEmergencyContact"]>((studentId, contactId) => {
    setStudents((prev) => prev.map((s) =>
      s.id !== studentId ? s : { ...s, emergencyContacts: s.emergencyContacts.filter((c) => c.id !== contactId) }
    ));
  }, []);

  const addDocument = useCallback<StudentStoreValue["addDocument"]>((studentId, doc) => {
    const full: StudentDocument = { ...doc, id: uid("doc"), uploadedAt: new Date().toISOString() };
    setStudents((prev) => prev.map((s) =>
      s.id !== studentId ? s : { ...s, documents: [full, ...s.documents] }
    ));
  }, []);

  const removeDocument = useCallback<StudentStoreValue["removeDocument"]>((studentId, docId) => {
    setStudents((prev) => prev.map((s) =>
      s.id !== studentId ? s : { ...s, documents: s.documents.filter((d) => d.id !== docId) }
    ));
  }, []);

  const bulkImport = useCallback<StudentStoreValue["bulkImport"]>((rows) => {
    const created: Student[] = rows.map((row) => {
      const { guardians, emergencyContacts, ...rest } = row;
      return {
        ...rest,
        id: uid("stu"),
        schoolId: SCHOOL_ID,
        documents: [],
        guardians: guardians.map((g) => ({ ...g, id: uid("grd") })),
        emergencyContacts: emergencyContacts.map((c) => ({ ...c, id: uid("ec") })),
        classHistory: [{
          id: uid("ch"),
          fromClassId: null,
          toClassId: rest.currentClassId,
          academicYear: rest.academicYear,
          promotedAt: rest.admissionDate,
          remarks: "Imported via CSV",
        }],
      };
    });
    setStudents((prev) => [...created, ...prev]);
    return { imported: created.length };
  }, []);

  const value = useMemo<StudentStoreValue>(
    () => ({
      students, getById, addStudent, updateStudent, updateStatus, promoteStudent,
      addGuardian, updateGuardian, removeGuardian, setPrimaryGuardian,
      addEmergencyContact, removeEmergencyContact,
      addDocument, removeDocument, bulkImport,
    }),
    [students, getById, addStudent, updateStudent, updateStatus, promoteStudent,
      addGuardian, updateGuardian, removeGuardian, setPrimaryGuardian,
      addEmergencyContact, removeEmergencyContact, addDocument, removeDocument, bulkImport],
  );

  return <StudentStoreContext.Provider value={value}>{children}</StudentStoreContext.Provider>;
}
