import { createContext } from "react";
import type { StaffDraft, StaffMember } from "../types/staff.types";

export type StaffStoreValue = {
  staff: StaffMember[];
  getById: (id: string) => StaffMember | undefined;
  addStaff: (draft: StaffDraft) => StaffMember;
  updateStaff: (id: string, draft: StaffDraft) => StaffMember | undefined;
  toggleStatus: (id: string) => void;
  removeStaff: (id: string) => void;
};

export const StaffStoreContext = createContext<StaffStoreValue | undefined>(undefined);
