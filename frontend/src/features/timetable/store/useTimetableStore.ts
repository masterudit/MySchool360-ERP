import { useContext } from "react";
import { TimetableStoreContext, type TimetableStoreValue } from "./timetableContext";

export function useTimetableStore(): TimetableStoreValue {
  const ctx = useContext(TimetableStoreContext);
  if (!ctx) throw new Error("useTimetableStore must be used within TimetableStoreProvider");
  return ctx;
}
