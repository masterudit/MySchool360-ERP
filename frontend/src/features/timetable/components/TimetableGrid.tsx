import { DAYS, PERIODS, type Day, type PeriodNumber } from "../types/timetable.types";
import { LUNCH_AFTER_PERIOD, LUNCH_CONFIG, PERIOD_CONFIG } from "../data/timetableConfig";

export type CellContent = {
  line1: string;
  line2?: string;
  colorClass?: string; // full tailwind bg+text+border class string
  isEmpty?: boolean;
};

type TimetableGridProps = {
  getCellContent: (day: Day, period: PeriodNumber) => CellContent;
  onCellClick?: (day: Day, period: PeriodNumber) => void;
  readOnly?: boolean;
};

export function TimetableGrid({ getCellContent, onCellClick, readOnly = false }: TimetableGridProps) {
  const beforeLunch = PERIOD_CONFIG.filter((p) => p.period <= LUNCH_AFTER_PERIOD);
  const afterLunch  = PERIOD_CONFIG.filter((p) => p.period > LUNCH_AFTER_PERIOD);

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 print:shadow-none print:border-gray-300">
      <table className="min-w-full border-collapse text-xs">

        {/* ── Column headers ── */}
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900/60">
            {/* Day column */}
            <th className="w-24 border-b border-r border-gray-200 px-3 py-3 text-left dark:border-gray-800">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Day</span>
            </th>

            {/* Before-lunch periods */}
            {beforeLunch.map((p) => (
              <th key={p.period} className="border-b border-r border-gray-200 px-2 py-2.5 text-center dark:border-gray-800 min-w-[110px]">
                <div className="font-bold text-gray-700 dark:text-white/80">{p.label}</div>
                <div className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">{p.start}–{p.end}</div>
              </th>
            ))}

            {/* Lunch */}
            <th className="border-b border-r border-gray-200 bg-amber-50/80 px-2 py-2.5 text-center dark:border-gray-800 dark:bg-amber-900/20 min-w-[72px]">
              <div className="text-base leading-none">🍽️</div>
              <div className="mt-0.5 font-bold text-amber-600 dark:text-amber-400">LUNCH</div>
              <div className="text-[10px] text-amber-500/80">{LUNCH_CONFIG.start}–{LUNCH_CONFIG.end}</div>
            </th>

            {/* After-lunch periods */}
            {afterLunch.map((p) => (
              <th key={p.period} className="border-b border-r border-gray-200 px-2 py-2.5 text-center dark:border-gray-800 min-w-[110px] last:border-r-0">
                <div className="font-bold text-gray-700 dark:text-white/80">{p.label}</div>
                <div className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">{p.start}–{p.end}</div>
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Rows ── */}
        <tbody>
          {DAYS.map((day, dayIdx) => (
            <tr key={day} className={dayIdx % 2 === 0 ? "" : "bg-gray-50/40 dark:bg-gray-900/30"}>
              {/* Day label */}
              <td className="border-b border-r border-gray-200 px-3 py-2 dark:border-gray-800">
                <div className="font-semibold text-gray-800 dark:text-white/90">{day.slice(0, 3)}</div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500">{day.slice(3)}</div>
              </td>

              {/* Before-lunch cells */}
              {beforeLunch.map((p) => (
                <GridCell
                  key={p.period}
                  content={getCellContent(day, p.period as PeriodNumber)}
                  onClick={!readOnly ? () => onCellClick?.(day, p.period as PeriodNumber) : undefined}
                />
              ))}

              {/* Lunch cell */}
              <td className="border-b border-r border-gray-200 bg-amber-50/60 p-1.5 text-center dark:border-gray-800 dark:bg-amber-900/10">
                <div className="flex min-h-[52px] items-center justify-center text-lg">🍽️</div>
              </td>

              {/* After-lunch cells */}
              {afterLunch.map((p) => (
                <GridCell
                  key={p.period}
                  content={getCellContent(day, p.period as PeriodNumber)}
                  onClick={!readOnly ? () => onCellClick?.(day, p.period as PeriodNumber) : undefined}
                  lastCol={p.period === PERIODS[PERIODS.length - 1]}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type GridCellProps = {
  content: CellContent;
  onClick?: () => void;
  lastCol?: boolean;
};

function GridCell({ content, onClick, lastCol = false }: GridCellProps) {
  const border = `border-b border-r ${lastCol ? "border-r-0" : ""} border-gray-200 dark:border-gray-800 p-1.5`;

  if (content.isEmpty) {
    return (
      <td className={border}>
        <button
          type="button"
          onClick={onClick}
          disabled={!onClick}
          className="flex min-h-[52px] w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-[10px] text-gray-400 transition hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-500 disabled:cursor-default disabled:hover:border-gray-200 disabled:hover:bg-transparent dark:border-gray-800 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/5"
        >
          {onClick ? "+ Add" : "—"}
        </button>
      </td>
    );
  }

  const Wrapper = onClick ? "button" : "div";

  return (
    <td className={border}>
      <Wrapper
        {...(onClick ? { type: "button" as const, onClick } : {})}
        className={`flex min-h-[52px] w-full flex-col items-start justify-center rounded-lg border px-2 py-1.5 text-left transition ${
          content.colorClass ?? "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
        } ${onClick ? "cursor-pointer hover:opacity-80 hover:shadow-sm" : ""}`}
      >
        <span className="text-[11px] font-bold leading-tight">{content.line1}</span>
        {content.line2 && (
          <span className="mt-0.5 text-[10px] opacity-70 leading-tight">{content.line2}</span>
        )}
      </Wrapper>
    </td>
  );
}

export type { TimetableGridProps };
export type { Day, PeriodNumber } from "../types/timetable.types";
