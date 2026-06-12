import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const DISPLAY_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function parseIso(iso: string): Date | null {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function startDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

type DatePickerInputProps = {
  id?: string;
  value: string;
  onChange: (iso: string) => void;
  hasError?: boolean;
  maxDate?: Date;
  minDate?: Date;
};

export function DatePickerInput({
  id,
  value,
  onChange,
  hasError = false,
  maxDate,
  minDate,
}: DatePickerInputProps) {
  const today = new Date();
  const resolved = parseIso(value) ?? today;

  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(resolved.getFullYear());
  const [viewMonth, setViewMonth] = useState(resolved.getMonth());

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function onOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [isOpen]);

  const selected = parseIso(value);
  const effective = maxDate ?? today;

  function isDayDisabled(year: number, month: number, day: number): boolean {
    const d = new Date(year, month, day);
    if (maxDate && d > maxDate) return true;
    if (minDate && d < minDate) return true;
    return false;
  }

  function selectDay(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    if (isDayDisabled(viewYear, viewMonth, day)) return;
    onChange(toIso(d));
    setIsOpen(false);
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
    const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
    const firstOfNext = new Date(nextY, nextM, 1);
    if (firstOfNext > effective) return;
    setViewYear(nextY);
    setViewMonth(nextM);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") setIsOpen(false);
  }

  const totalDays = daysInMonth(viewYear, viewMonth);
  const startDay = startDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array<null>(startDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const canGoNext = (() => {
    const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
    const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
    return new Date(nextY, nextM, 1) <= effective;
  })();

  const displayValue = selected ? DISPLAY_FORMATTER.format(selected) : "";

  const borderClass = hasError
    ? "border-error-500 focus:ring-error-500/20"
    : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700";

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <div className="relative">
        <input
          id={id}
          readOnly
          value={displayValue}
          placeholder="Select a date"
          onClick={() => setIsOpen((o) => !o)}
          className={`h-11 w-full cursor-pointer rounded-lg border bg-transparent px-3 py-2 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:text-white/90 ${borderClass}`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setIsOpen((o) => !o)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Open calendar"
        >
          <svg viewBox="0 0 20 20" className="size-5 fill-current" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM3 8h14v9H3V8zm2 2a1 1 0 011-1h1a1 1 0 010 2H6a1 1 0 01-1-1zm5 0a1 1 0 011-1h1a1 1 0 010 2h-1a1 1 0 01-1-1zm5 0a1 1 0 011-1h1a1 1 0 010 2h-1a1 1 0 01-1-1zm-10 4a1 1 0 011-1h1a1 1 0 010 2H6a1 1 0 01-1-1zm5 0a1 1 0 011-1h1a1 1 0 010 2h-1a1 1 0 01-1-1z" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="grid size-8 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Previous month"
            >
              ‹
            </button>
            <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              disabled={!canGoNext}
              className="grid size-8 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-gray-800"
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            {DAYS.map((d) => <span key={d}>{d}</span>)}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-0.5 text-center text-sm">
            {cells.map((day, idx) => {
              if (!day) return <span key={`empty-${idx}`} />;
              const disabled = isDayDisabled(viewYear, viewMonth, day);
              const isSelected =
                selected && sameDay(selected, new Date(viewYear, viewMonth, day));
              const isToday = sameDay(today, new Date(viewYear, viewMonth, day));
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => selectDay(day)}
                  disabled={disabled}
                  className={[
                    "mx-auto flex size-8 items-center justify-center rounded-full text-sm transition",
                    isSelected
                      ? "bg-brand-500 font-semibold text-white"
                      : isToday
                      ? "font-semibold text-brand-500"
                      : "text-gray-700 dark:text-gray-300",
                    disabled
                      ? "cursor-not-allowed opacity-30"
                      : "hover:bg-brand-50 dark:hover:bg-brand-500/10",
                  ].join(" ")}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Today shortcut */}
          <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-800">
            <button
              type="button"
              onClick={() => {
                const iso = toIso(today);
                if (!isDayDisabled(today.getFullYear(), today.getMonth(), today.getDate())) {
                  onChange(iso);
                  setIsOpen(false);
                }
              }}
              className="w-full rounded-lg py-1.5 text-xs font-medium text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
