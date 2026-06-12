import { useContext } from "react";
import { StaffStoreContext, type StaffStoreValue } from "./staffContext";

export function useStaffStore(): StaffStoreValue {
  const ctx = useContext(StaffStoreContext);
  if (!ctx) {
    throw new Error("useStaffStore must be used within a StaffStoreProvider");
  }
  return ctx;
}
