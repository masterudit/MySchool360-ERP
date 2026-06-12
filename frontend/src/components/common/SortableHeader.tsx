import type { SortState } from "./sortUtils";

type SortableHeaderProps<K extends string> = {
  label: string;
  sortKey: K;
  current: SortState<K>;
  onSort: (key: K) => void;
  className?: string;
};

export function SortableHeader<K extends string>({
  label,
  sortKey,
  current,
  onSort,
  className = "",
}: SortableHeaderProps<K>) {
  const isActive = current.key === sortKey;
  const dir = isActive ? current.dir : null;

  return (
    <th className={`px-5 py-3 font-medium ${className}`}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition hover:text-brand-500"
      >
        {label}
        <span className="flex flex-col" aria-hidden="true">
          <svg
            viewBox="0 0 8 5"
            className={`size-2 fill-current transition ${
              isActive && dir === "asc" ? "text-brand-500" : "text-gray-300 dark:text-gray-600"
            }`}
          >
            <path d="M4 0L8 5H0L4 0z" />
          </svg>
          <svg
            viewBox="0 0 8 5"
            className={`-mt-0.5 size-2 fill-current transition ${
              isActive && dir === "desc" ? "text-brand-500" : "text-gray-300 dark:text-gray-600"
            }`}
          >
            <path d="M4 5L0 0H8L4 5z" />
          </svg>
        </span>
        {isActive && (
          <span className="sr-only">
            {dir === "asc" ? "sorted A to Z" : "sorted Z to A"}
          </span>
        )}
      </button>
    </th>
  );
}
