import { useContext } from "react";
import { StudentStoreContext, type StudentStoreValue } from "./studentContext";

export function useStudentStore(): StudentStoreValue {
  const ctx = useContext(StudentStoreContext);
  if (!ctx) throw new Error("useStudentStore must be used within a StudentStoreProvider");
  return ctx;
}
