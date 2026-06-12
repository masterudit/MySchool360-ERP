export type SortDir = "asc" | "desc";

export type SortState<K extends string> = {
  key: K;
  dir: SortDir;
};

/** Toggle helper: same key flips dir; new key resets to asc */
export function nextSort<K extends string>(
  prev: SortState<K>,
  clicked: K,
): SortState<K> {
  if (prev.key !== clicked) return { key: clicked, dir: "asc" };
  return { key: clicked, dir: prev.dir === "asc" ? "desc" : "asc" };
}
