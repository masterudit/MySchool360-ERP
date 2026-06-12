import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { MOCK_STAFF } from "../data/mockStaff";
import type { StaffDraft, StaffMember } from "../types/staff.types";
import { loadStoredStaff, persistStaff } from "./staffStorage";
import { StaffStoreContext, type StaffStoreValue } from "./staffContext";

const SCHOOL_ID = "sch_demo_001";

function generateId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${random}`;
}

function normalizeAssignments(draft: StaffDraft): StaffMember["assignments"] {
  if (draft.role !== "TEACHER") return [];
  return draft.assignments.map((entry) => ({
    id: generateId("asn"),
    classId: entry.classId,
    subjectId: entry.subjectId,
  }));
}

function normalizeClassTeacher(draft: StaffDraft): string | null {
  if (draft.role !== "TEACHER") return null;
  return draft.classTeacherOf?.trim() ? draft.classTeacherOf : null;
}

export function StaffStoreProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<StaffMember[]>(() => loadStoredStaff() ?? MOCK_STAFF);

  useEffect(() => {
    persistStaff(staff);
  }, [staff]);

  const getById = useCallback(
    (id: string) => staff.find((entry) => entry.id === id),
    [staff],
  );

  const addStaff = useCallback<StaffStoreValue["addStaff"]>((draft) => {
    const created: StaffMember = {
      id: generateId("stf"),
      schoolId: SCHOOL_ID,
      employeeCode: draft.employeeCode,
      firstName: draft.firstName,
      lastName: draft.lastName,
      email: draft.email,
      phone: draft.phone,
      sex: draft.sex,
      role: draft.role,
      department: draft.department || undefined,
      dateOfJoining: draft.dateOfJoining,
      status: draft.status,
      photoUrl: draft.photoUrl ?? null,
      classTeacherOf: normalizeClassTeacher(draft),
      assignments: normalizeAssignments(draft),
    };
    setStaff((current) => [created, ...current]);
    return created;
  }, []);

  const updateStaff = useCallback<StaffStoreValue["updateStaff"]>((id, draft) => {
    let updated: StaffMember | undefined;
    setStaff((current) =>
      current.map((entry) => {
        if (entry.id !== id) return entry;
        updated = {
          ...entry,
          employeeCode: draft.employeeCode,
          firstName: draft.firstName,
          lastName: draft.lastName,
          email: draft.email,
          phone: draft.phone,
          sex: draft.sex,
          role: draft.role,
          department: draft.department || undefined,
          dateOfJoining: draft.dateOfJoining,
          status: draft.status,
          photoUrl: draft.photoUrl ?? null,
          classTeacherOf: normalizeClassTeacher(draft),
          assignments: normalizeAssignments(draft),
        };
        return updated;
      }),
    );
    return updated;
  }, []);

  const toggleStatus = useCallback<StaffStoreValue["toggleStatus"]>((id) => {
    setStaff((current) =>
      current.map((entry) =>
        entry.id === id
          ? { ...entry, status: entry.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
          : entry,
      ),
    );
  }, []);

  const removeStaff = useCallback<StaffStoreValue["removeStaff"]>((id) => {
    setStaff((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const value = useMemo<StaffStoreValue>(
    () => ({ staff, getById, addStaff, updateStaff, toggleStatus, removeStaff }),
    [staff, getById, addStaff, updateStaff, toggleStatus, removeStaff],
  );

  return <StaffStoreContext.Provider value={value}>{children}</StaffStoreContext.Provider>;
}
