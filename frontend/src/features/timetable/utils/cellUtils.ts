import type { CellContent } from "../components/TimetableGrid";

export function emptyCell(): CellContent {
  return { line1: "", isEmpty: true };
}
